/*
 * A fake WebSocket and fetch for testing the relay client without a relay.
 */
import { vi } from 'vitest';

export class FakeWebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    static instances: FakeWebSocket[] = [];

    readonly url: string;
    readonly protocols: string[];
    readyState = FakeWebSocket.CONNECTING;
    /** Requests sent (those of a batch one by one) */
    sent: Record<string, unknown>[] = [];
    /** Frames sent */
    frames: unknown[] = [];
    onopen: (() => void) | null = null;
    onclose: ((event: { code: number; reason: string }) => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;

    constructor(url: string, protocols: string[]) {
        this.url = url;
        this.protocols = protocols;
        FakeWebSocket.instances.push(this);
    }

    static get last(): FakeWebSocket {
        return FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
    }

    send(data: string): void {
        const frame = JSON.parse(data) as
            Record<string, unknown> | Record<string, unknown>[];
        this.frames.push(frame);
        this.sent.push(...(Array.isArray(frame) ? frame : [frame]));
    }

    close(): void {
        if (this.readyState === FakeWebSocket.CLOSED) {
            return;
        }
        this.readyState = FakeWebSocket.CLOSED;
        this.onclose?.({ code: 1000, reason: '' });
    }

    // Test helpers
    open(): void {
        this.readyState = FakeWebSocket.OPEN;
        this.onopen?.();
    }

    refuse(code = 1006): void {
        this.readyState = FakeWebSocket.CLOSED;
        this.onclose?.({ code, reason: '' });
    }

    receive(message: unknown): void {
        this.onmessage?.({
            data: typeof message === 'string' ? message : JSON.stringify(message),
        });
    }

    /** Answer the last request sent */
    reply(code: number, body: unknown = null, bodyType: string | null = null): void {
        this.receive(
            this.response(this.sent[this.sent.length - 1], code, body, bodyType),
        );
    }

    /** Answer the first request sent matching "METHOD /path" (prefix) */
    replyTo(
        request: string,
        code: number,
        body: unknown = null,
        bodyType: string | null = null,
    ): void {
        const sent = this.sent.find((r) => String(r.request).startsWith(request));
        if (!sent) {
            throw new Error('No request ' + request);
        }
        this.receive(this.response(sent, code, body, bodyType));
    }

    response(
        request: Record<string, unknown>,
        code: number,
        body: unknown = null,
        bodyType: string | null = null,
    ): Record<string, unknown> {
        return {
            code,
            message: code === 200 ? 'OK' : code === 204 ? 'No Content' : 'Error',
            request: request.request,
            request_body: request.body ?? null,
            request_id: request.request_id,
            body_type: bodyType,
            body,
        };
    }
}

export interface FakeHttp {
    handshake: Record<string, unknown>;
    versionStatus: number;
    versionBody: Record<string, unknown>;
    requests: { url: string; init?: RequestInit }[];
}

/** Install the fakes; returns the HTTP state to configure */
export function installFakes(): FakeHttp {
    FakeWebSocket.instances = [];
    const http: FakeHttp = {
        handshake: {
            password_hash_algo: 'plain',
            password_hash_iterations: 100000,
            totp: false,
        },
        versionStatus: 200,
        versionBody: {},
        requests: [],
    };
    vi.stubGlobal('WebSocket', FakeWebSocket);
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
        http.requests.push({ url, init });
        if (url.endsWith('/handshake')) {
            return new Response(JSON.stringify(http.handshake), { status: 200 });
        }
        return new Response(JSON.stringify(http.versionBody), {
            status: http.versionStatus,
        });
    });
    return http;
}

/** Wait for pending promises */
export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Wait until a new WebSocket is created (hashing the password takes time) */
export async function nextSocket(
    count = FakeWebSocket.instances.length,
): Promise<FakeWebSocket> {
    for (let i = 0; i < 1000 && FakeWebSocket.instances.length <= count; i++) {
        await flush();
    }
    if (FakeWebSocket.instances.length <= count) {
        throw new Error('No WebSocket was created');
    }
    return FakeWebSocket.last;
}
