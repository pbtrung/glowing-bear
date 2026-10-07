/*
 * Helpers for the relay integration tests.
 */
import { inject } from 'vitest';
import { RelayApi } from '../../src/lib/relay/api';
import {
    RelayClient,
    type CloseInfo,
    type ConnectOptions,
} from '../../src/lib/relay/client';
import type { ApiEvent } from '../../src/lib/relay/types';

/*
 * Node's fetch reuses its keep-alive connection for the next WebSocket
 * upgrade, which the relay refuses (browsers use separate connections).
 * Closing HTTP connections avoids it in the tests.
 */
const nodeFetch = globalThis.fetch;
globalThis.fetch = (input: RequestInfo | URL, init: RequestInit = {}) =>
    nodeFetch(input, {
        ...init,
        headers: { ...(init.headers as Record<string, string>), Connection: 'close' },
    });

export function relayOptions(overrides: Partial<ConnectOptions> = {}): ConnectOptions {
    return {
        host: inject('relayHost'),
        port: inject('relayPort'),
        path: 'api',
        password: inject('relayPassword'),
        tls: false,
        ...overrides,
    };
}

export interface Connection {
    client: RelayClient;
    api: RelayApi;
    events: ApiEvent[];
    closes: CloseInfo[];
    /** Wait for an event matching name (and predicate), received after `since` */
    waitEvent: (
        name: string,
        predicate?: (event: ApiEvent) => boolean,
        timeout?: number,
    ) => Promise<ApiEvent>;
    /** Number of events received so far (to wait for events after an action) */
    mark: () => void;
    /** Run a command in WeeChat (core buffer by default) */
    weechat: (command: string, buffer?: number | string) => Promise<void>;
}

export async function connect(
    overrides: Partial<ConnectOptions> = {},
): Promise<Connection> {
    const events: ApiEvent[] = [];
    const closes: CloseInfo[] = [];
    const listeners = new Set<() => void>();
    let since = 0;
    const client = new RelayClient({
        onEvent: (event) => {
            events.push(event);
            listeners.forEach((l) => l());
        },
        onClose: (info) => closes.push(info),
        pingInterval: 0,
    });
    await client.connect(relayOptions(overrides));
    const api = new RelayApi(client);

    const find = (name: string, predicate?: (event: ApiEvent) => boolean) =>
        events
            .slice(since)
            .find((e) => e.event_name === name && (!predicate || predicate(e)));

    return {
        client,
        api,
        events,
        closes,
        mark: () => {
            since = events.length;
        },
        waitEvent: (name, predicate, timeout = 5000) =>
            new Promise((resolve, reject) => {
                const check = () => {
                    const event = find(name, predicate);
                    if (event) {
                        listeners.delete(check);
                        clearTimeout(timer);
                        resolve(event);
                    }
                };
                const timer = setTimeout(() => {
                    listeners.delete(check);
                    const received = events.slice(since).map((e) => e.event_name);
                    reject(
                        new Error(
                            `No ${name} event; received: ${received.join(', ') || 'none'}`,
                        ),
                    );
                }, timeout);
                listeners.add(check);
                check();
            }),
        weechat: async (command, buffer) => {
            await api.input(command, buffer);
            await barrier(api);
        },
    };
}

let barrierCount = 0;

/**
 * Wait until the commands sent are executed: WeeChat answers POST /api/input
 * right away but runs the command a bit later. Commands run in order, so once
 * a marker set by a later command is visible, the previous ones are done.
 */
export async function barrier(api: RelayApi): Promise<void> {
    const value = String(++barrierCount);
    await api.input('/buffer setvar gbbarrier ' + value, 'core.weechat');
    await until(async () => {
        const core = await api.buffer('core.weechat');
        return core.local_variables.gbbarrier === value;
    });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Wait until a condition is true */
export async function until(
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
): Promise<void> {
    const start = Date.now();
    while (!(await condition())) {
        if (Date.now() - start > timeout) {
            throw new Error('Timed out waiting for a condition');
        }
        await sleep(50);
    }
}
