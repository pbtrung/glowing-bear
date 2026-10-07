/*
 * Client for the WeeChat relay "api" protocol (relay API >= 0.6.0, WeeChat >= 4.10).
 *
 * Connecting:
 *   1. POST /api/handshake (HTTP, no authentication) to agree on the password
 *      hash algorithm;
 *   2. open the WebSocket on /api, authenticated through a sub-protocol.
 * If the WebSocket is refused, GET /api/version over HTTP tells us why (e.g.
 * a wrong password): the WebSocket API gives no details at all. This request
 * is only made on failure, never before opening the WebSocket: a client
 * reusing its keep-alive connection for the upgrade would be refused.
 *
 * On the WebSocket, requests are JSON objects {request, body, request_id};
 * responses carry the request_id back. Messages with code 0 are events pushed
 * by WeeChat once synchronization is enabled (POST /api/sync).
 */
import {
    buildCredentials,
    base64,
    describeAuthError,
    relayUrls,
    supportedHashAlgos,
    websocketProtocols,
    type RelayUrls,
} from './auth';
import type { ApiEvent, ApiHandshake, ApiResponse } from './types';

export interface ConnectOptions {
    host: string;
    port: number | string;
    /** Path of the API, "api" unless behind a reverse proxy */
    path: string;
    password: string;
    tls: boolean;
}

export type ConnectErrorKind =
    /** relay not reachable, invalid certificate, not an "api" relay... */
    | 'network'
    /** wrong password, timestamp out of the time window... */
    | 'auth'
    /** TOTP is enabled in WeeChat: browsers can't send it on a WebSocket */
    | 'totp'
    /** no common password hash algorithm */
    | 'hash'
    /** unencrypted relay from a page loaded over https */
    | 'insecure'
    /** relay API older than MIN_RELAY_API */
    | 'version';

/** Oldest relay API supported (that of WeeChat 4.10) */
export const MIN_RELAY_API = { version: '0.6.0', number: 0x000600, weechat: '4.10' };

export class ConnectError extends Error {
    readonly kind: ConnectErrorKind;

    constructor(kind: ConnectErrorKind, message: string) {
        super(message);
        this.name = 'ConnectError';
        this.kind = kind;
    }
}

/** Error response (code >= 400) to a request */
export class RequestError extends Error {
    readonly response: ApiResponse;

    constructor(response: ApiResponse) {
        const error = (response.body as { error?: string } | null)?.error;
        super(
            `${response.request}: ${response.code} ${response.message}` +
                (error ? ` (${error})` : ''),
        );
        this.name = 'RequestError';
        this.response = response;
    }
}

export interface CloseInfo {
    code: number;
    reason: string;
    /** Closed by close() */
    byClient: boolean;
}

export interface RelayClientOptions {
    /** Called for every event pushed by WeeChat */
    onEvent?: (event: ApiEvent) => void;
    /** Called when the connection is closed after being opened */
    onClose?: (info: CloseInfo) => void;
    /** Interval between keepalive pings in ms (0 disables them) */
    pingInterval?: number;
    /** How long to wait for the answer to a ping before dropping the connection */
    pingTimeout?: number;
    /** Page protocol, to detect mixed content (defaults to location.protocol) */
    pageProtocol?: string;
}

interface Pending {
    resolve: (response: ApiResponse) => void;
    reject: (error: Error) => void;
}

export class RelayClient {
    private ws: WebSocket | null = null;
    private pending = new Map<string, Pending>();
    private nextId = 0;
    /** Requests collected by batch(), sent together */
    private batched: Record<string, unknown>[] | null = null;
    private pingTimer: ReturnType<typeof setInterval> | undefined;
    private pingDeadline: ReturnType<typeof setTimeout> | undefined;
    private closing = false;
    private readonly options: RelayClientOptions;

    constructor(options: RelayClientOptions = {}) {
        this.options = options;
    }

    get isOpen(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Connect and authenticate. Resolves once the WebSocket is open, rejects
     * with a ConnectError otherwise.
     */
    async connect(options: ConnectOptions): Promise<void> {
        const urls = relayUrls(options.host, options.port, options.path, options.tls);
        const pageProtocol =
            this.options.pageProtocol ??
            (typeof location !== 'undefined' ? location.protocol : 'http:');
        if (pageProtocol === 'https:' && !options.tls) {
            throw new ConnectError(
                'insecure',
                'Unencrypted relays are blocked on pages loaded over https',
            );
        }

        let handshake: ApiHandshake;
        try {
            handshake = await RelayClient.handshake(urls);
        } catch (e) {
            throw new ConnectError('network', 'Handshake failed: ' + String(e));
        }
        if (handshake.totp) {
            throw new ConnectError(
                'totp',
                'TOTP is enabled in WeeChat (relay.network.totp_secret), but browsers ' +
                    "can't send it on a WebSocket",
            );
        }
        if (!handshake.password_hash_algo) {
            throw new ConnectError('hash', 'No common password hash algorithm');
        }
        const credentials = await buildCredentials(
            options.password,
            handshake.password_hash_algo,
            handshake.password_hash_iterations,
        );

        try {
            await this.open(urls.ws, credentials);
        } catch (closeCode) {
            throw await RelayClient.diagnose(urls, credentials, closeCode as number);
        }
    }

    /** POST /api/handshake */
    static async handshake(urls: RelayUrls): Promise<ApiHandshake> {
        // No Content-Type header: this keeps it a "simple" CORS request
        const response = await fetch(urls.http + '/handshake', {
            method: 'POST',
            body: JSON.stringify({ password_hash_algo: supportedHashAlgos() }),
        });
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return (await response.json()) as ApiHandshake;
    }

    /** Find out why the WebSocket was refused */
    private static async diagnose(
        urls: RelayUrls,
        credentials: string,
        closeCode: number,
    ): Promise<ConnectError> {
        try {
            const response = await fetch(urls.http + '/version', {
                headers: { Authorization: 'Basic ' + base64(credentials) },
            });
            if (response.status === 401) {
                const json = (await response.json().catch(() => ({}))) as {
                    error?: string;
                };
                return new ConnectError('auth', describeAuthError(json.error));
            }
            return new ConnectError(
                'network',
                `The WebSocket connection was refused (code ${closeCode})`,
            );
        } catch (e) {
            return new ConnectError('network', 'Relay not reachable: ' + String(e));
        }
    }

    private open(url: string, credentials: string): Promise<void> {
        this.closing = false;
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url, websocketProtocols(credentials));
            let opened = false;
            this.ws = ws;
            ws.onopen = () => {
                opened = true;
                this.startPing();
                resolve();
            };
            ws.onmessage = (event: MessageEvent) => this.onMessage(event.data);
            ws.onclose = (event: CloseEvent) => {
                if (!opened) {
                    this.ws = null;
                    reject(event.code);
                    return;
                }
                this.closed({
                    code: event.code,
                    reason: event.reason,
                    byClient: this.closing,
                });
            };
        });
    }

    private closed(info: CloseInfo): void {
        this.stopPing();
        this.ws = null;
        const pending = [...this.pending.values()];
        this.pending.clear();
        for (const p of pending) {
            p.reject(new Error('Connection closed'));
        }
        this.options.onClose?.(info);
    }

    private onMessage(data: unknown): void {
        let messages: unknown;
        try {
            messages = JSON.parse(String(data));
        } catch {
            // The stream is corrupted (this happens with compressed frames
            // after a /upgrade of WeeChat): drop the connection
            this.abort('corrupted stream');
            return;
        }
        for (const message of Array.isArray(messages) ? messages : [messages]) {
            if (typeof message !== 'object' || message === null) {
                continue;
            }
            try {
                this.dispatch(message as ApiResponse | ApiEvent);
            } catch (e) {
                // An event handler failing must not drop the next messages
                // (and leave their requests pending forever)
                console.error('Error handling a relay message', e);
            }
        }
    }

    private dispatch(message: ApiResponse | ApiEvent): void {
        if (message.code === 0) {
            this.options.onEvent?.(message as ApiEvent);
            return;
        }
        const response = message as ApiResponse;
        const pending = response.request_id
            ? this.pending.get(response.request_id)
            : undefined;
        if (!pending || !response.request_id) {
            if (response.code >= 400) {
                console.warn('Unexpected relay error', response);
            }
            return;
        }
        this.pending.delete(response.request_id);
        if (response.code >= 400) {
            pending.reject(new RequestError(response));
        } else {
            pending.resolve(response);
        }
    }

    /**
     * Send a request on the WebSocket.
     *
     * @param method HTTP method, e.g. "GET"
     * @param path resource path, e.g. "/api/buffers?lines=-100"
     * @param body request body (for POST/PUT)
     */
    request<T = unknown>(
        method: string,
        path: string,
        body?: unknown,
    ): Promise<ApiResponse<T>> {
        const ws = this.ws;
        if (ws === null || ws.readyState !== WebSocket.OPEN) {
            return Promise.reject(new Error('Not connected'));
        }
        const id = 'gb' + ++this.nextId;
        const request: Record<string, unknown> = {
            request: `${method} ${path}`,
            request_id: id,
        };
        if (body !== undefined) {
            request.body = body;
        }
        return new Promise<ApiResponse<T>>((resolve, reject) => {
            this.pending.set(id, {
                resolve: resolve as (response: ApiResponse) => void,
                reject,
            });
            if (this.batched !== null) {
                this.batched.push(request);
            } else {
                ws.send(JSON.stringify(request));
            }
        });
    }

    /**
     * Send the requests made by fn in a single frame (a JSON array): WeeChat
     * processes them together, so no event can happen in between (e.g. between
     * the buffer list and the start of the synchronization).
     */
    batch<T>(fn: () => T): T {
        if (this.batched !== null) {
            return fn();
        }
        this.batched = [];
        try {
            return fn();
        } finally {
            const requests = this.batched;
            this.batched = null;
            if (requests.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(
                    JSON.stringify(requests.length === 1 ? requests[0] : requests),
                );
            }
        }
    }

    /** Close the connection */
    close(): void {
        if (this.ws !== null) {
            this.closing = true;
            this.ws.close();
        }
    }

    /**
     * Drop the connection without waiting for the closing handshake (which
     * never completes if the relay doesn't answer), and report it closed now.
     */
    abort(reason = 'aborted'): void {
        const ws = this.ws;
        if (ws === null) {
            return;
        }
        ws.onopen = null;
        ws.onclose = null;
        ws.onmessage = null;
        try {
            ws.close();
        } catch {
            // already closed
        }
        this.closed({ code: 4000, reason, byClient: false });
    }

    private startPing(): void {
        const interval = this.options.pingInterval ?? 30000;
        if (interval <= 0) {
            return;
        }
        let waiting = false;
        this.pingTimer = setInterval(() => {
            if (waiting) {
                // the deadline of the previous ping runs
                return;
            }
            waiting = true;
            this.pingDeadline = setTimeout(
                () => this.abort('ping timeout'),
                this.options.pingTimeout ?? 15000,
            );
            // Any answer, even an error, shows the connection is alive
            const answered = () => {
                waiting = false;
                clearTimeout(this.pingDeadline);
            };
            this.request('POST', '/api/ping', { data: String(Date.now()) }).then(
                answered,
                (e: unknown) => {
                    if (e instanceof RequestError) {
                        answered();
                    }
                },
            );
        }, interval);
    }

    private stopPing(): void {
        clearInterval(this.pingTimer);
        clearTimeout(this.pingDeadline);
    }
}
