import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RelayApi } from './api';
import { ConnectError, RelayClient, RequestError, type CloseInfo } from './client';
import type { ApiEvent } from './types';
import {
    FakeWebSocket,
    installFakes,
    nextSocket,
    type FakeHttp,
} from './fake-websocket.test-helper';

const OPTIONS = {
    host: 'localhost',
    port: 9001,
    path: 'api',
    password: 'secret',
    tls: false,
};

let http: FakeHttp;

beforeEach(() => {
    http = installFakes();
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

async function connected(options: ConstructorParameters<typeof RelayClient>[0] = {}) {
    const client = new RelayClient({
        pingInterval: 0,
        pageProtocol: 'http:',
        ...options,
    });
    const connecting = client.connect(OPTIONS);
    const ws = await nextSocket(0);
    ws.open();
    await connecting;
    return { client, ws };
}

describe('connecting', () => {
    it('performs the handshake over HTTP, then opens an authenticated WebSocket', async () => {
        const { ws } = await connected();
        expect(http.requests[0].url).toBe('http://localhost:9001/api/handshake');
        expect(http.requests[0].init?.method).toBe('POST');
        expect(JSON.parse(String(http.requests[0].init?.body))).toEqual({
            password_hash_algo: [
                'pbkdf2+sha512',
                'pbkdf2+sha256',
                'sha512',
                'sha256',
                'plain',
            ],
        });
        // No request is made before opening the WebSocket besides the handshake
        expect(http.requests).toHaveLength(1);
        expect(ws.url).toBe('ws://localhost:9001/api');
        expect(ws.protocols).toEqual([
            'api.weechat',
            'base64url.bearer.authorization.weechat.cGxhaW46c2VjcmV0',
        ]);
    });

    it('hashes the password with the algorithm chosen by WeeChat', async () => {
        http.handshake = {
            password_hash_algo: 'pbkdf2+sha512',
            password_hash_iterations: 10,
            totp: false,
        };
        const { ws } = await connected();
        const credentials = atob(
            ws.protocols[1]
                .replace('base64url.bearer.authorization.weechat.', '')
                .replace(/-/g, '+')
                .replace(/_/g, '/'),
        );
        expect(credentials).toMatch(/^hash:pbkdf2\+sha512:\d+:10:[0-9a-f]{128}$/);
    });

    it('refuses TOTP, which browsers cannot send on a WebSocket', async () => {
        http.handshake = {
            password_hash_algo: 'plain',
            password_hash_iterations: 0,
            totp: true,
        };
        await expect(
            new RelayClient({ pageProtocol: 'http:' }).connect(OPTIONS),
        ).rejects.toMatchObject({ kind: 'totp' });
    });

    it('reports when no hash algorithm is common', async () => {
        http.handshake = {
            password_hash_algo: null,
            password_hash_iterations: 0,
            totp: false,
        };
        await expect(
            new RelayClient({ pageProtocol: 'http:' }).connect(OPTIONS),
        ).rejects.toMatchObject({ kind: 'hash' });
    });

    it('refuses unencrypted relays on secure pages', async () => {
        const client = new RelayClient({ pageProtocol: 'https:' });
        await expect(client.connect(OPTIONS)).rejects.toMatchObject({
            kind: 'insecure',
        });
        expect(http.requests).toHaveLength(0);
    });

    it('reports network errors', async () => {
        vi.stubGlobal('fetch', () => Promise.reject(new TypeError('Failed to fetch')));
        const error = await new RelayClient({ pageProtocol: 'http:' })
            .connect(OPTIONS)
            .catch((e) => e);
        expect(error).toBeInstanceOf(ConnectError);
        expect(error.kind).toBe('network');
    });

    it('explains a refused WebSocket with an authenticated HTTP request', async () => {
        http.versionStatus = 401;
        http.versionBody = { error: 'Invalid password' };
        const connecting = new RelayClient({ pageProtocol: 'http:' }).connect(OPTIONS);
        (await nextSocket(0)).refuse();
        const error = await connecting.catch((e) => e);
        expect(error).toMatchObject({ kind: 'auth', message: 'Wrong password.' });
        expect(http.requests[1].url).toBe('http://localhost:9001/api/version');
        expect(
            (http.requests[1].init?.headers as Record<string, string>).Authorization,
        ).toBe('Basic cGxhaW46c2VjcmV0');
    });

    it('reports a refused WebSocket with valid credentials as a network error', async () => {
        const connecting = new RelayClient({ pageProtocol: 'http:' }).connect(OPTIONS);
        (await nextSocket(0)).refuse();
        await expect(connecting).rejects.toMatchObject({ kind: 'network' });
    });
});

describe('requests', () => {
    it('sends requests with an id and resolves them with the matching response', async () => {
        const { client, ws } = await connected();
        const first = client.request('GET', '/api/version');
        const second = client.request('POST', '/api/input', { command: 'hi' });
        expect(ws.sent).toEqual([
            { request: 'GET /api/version', request_id: 'gb1' },
            { request: 'POST /api/input', request_id: 'gb2', body: { command: 'hi' } },
        ]);
        // Answer out of order, in a single frame (array)
        ws.receive([
            {
                code: 204,
                message: 'No Content',
                request: 'POST /api/input',
                request_body: {},
                request_id: 'gb2',
                body_type: null,
                body: null,
            },
            {
                code: 200,
                message: 'OK',
                request: 'GET /api/version',
                request_body: null,
                request_id: 'gb1',
                body_type: 'version',
                body: { weechat_version: '4.10.1' },
            },
        ]);
        expect((await first).body).toEqual({ weechat_version: '4.10.1' });
        expect((await second).code).toBe(204);
    });

    it('rejects requests answered with an error', async () => {
        const { client, ws } = await connected();
        const request = client.request('GET', '/api/buffers/nope');
        ws.reply(404, { error: 'Buffer "nope" not found' });
        const error = await request.catch((e) => e);
        expect(error).toBeInstanceOf(RequestError);
        expect(error.response.code).toBe(404);
        expect(error.message).toContain('Buffer "nope" not found');
    });

    it('rejects requests when not connected', async () => {
        await expect(new RelayClient().request('GET', '/api/version')).rejects.toThrow(
            'Not connected',
        );
    });

    it('dispatches events', async () => {
        const events: ApiEvent[] = [];
        const { ws } = await connected({ onEvent: (e) => events.push(e) });
        const event = {
            code: 0,
            message: 'Event',
            event_name: 'buffer_closed',
            buffer_id: 42,
            body_type: null,
            body: null,
        };
        ws.receive(event);
        expect(events).toEqual([event]);
    });

    it('rejects pending requests and reports when the connection closes', async () => {
        const closes: CloseInfo[] = [];
        const { client, ws } = await connected({
            onClose: (info) => closes.push(info),
        });
        const pending = client.request('GET', '/api/hotlist');
        ws.refuse(1006);
        await expect(pending).rejects.toThrow('Connection closed');
        expect(closes).toEqual([{ code: 1006, reason: '', byClient: false }]);
        expect(client.isOpen).toBe(false);
    });

    it('reports a close by the client', async () => {
        const closes: CloseInfo[] = [];
        const { client } = await connected({ onClose: (info) => closes.push(info) });
        client.close();
        expect(closes[0].byClient).toBe(true);
    });

    it('drops the connection when a frame is not valid JSON (corrupted stream)', async () => {
        const closes: CloseInfo[] = [];
        const { ws } = await connected({ onClose: (info) => closes.push(info) });
        ws.receive('{"code":0,"mes\u0000garbage');
        expect(closes).toEqual([
            { code: 4000, reason: 'corrupted stream', byClient: false },
        ]);
    });

    it('sends batched requests in one frame', async () => {
        const { client, ws } = await connected();
        const api = new RelayApi(client);
        const [version, hotlist] = client.batch(() => [api.version(), api.hotlist()]);
        expect(ws.frames).toHaveLength(1);
        expect(ws.frames[0]).toEqual([
            { request: 'GET /api/version', request_id: expect.any(String) },
            { request: 'GET /api/hotlist', request_id: expect.any(String) },
        ]);
        // WeeChat answers with an array too
        ws.receive([
            ws.response(ws.sent[0], 200, { weechat_version: '4.4.0' }),
            ws.response(ws.sent[1], 200, []),
        ]);
        expect(await version).toEqual({ weechat_version: '4.4.0' });
        expect(await hotlist).toEqual([]);
        // A single request is sent as an object
        void client.batch(() => api.hotlist());
        expect(ws.frames[1]).toMatchObject({ request: 'GET /api/hotlist' });
    });

    it('keeps handling the messages of a frame when an event handler throws', async () => {
        const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const { client, ws } = await connected({
            onEvent: () => {
                throw new Error('bug');
            },
        });
        const pending = client.request('GET', '/api/hotlist');
        ws.receive([
            { code: 0, message: 'OK', event_name: 'quit', buffer_id: -1 },
            null,
            42,
            ws.response(ws.sent[0], 200, []),
        ]);
        expect((await pending).body).toEqual([]);
        expect(errors).toHaveBeenCalledOnce();
    });

    it('ignores responses to unknown requests', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { ws } = await connected();
        ws.receive({ code: 200, message: 'OK', request_id: 'nope', body: null });
        ws.receive({ code: 400, message: 'Bad Request', request_id: null, body: null });
        expect(warn).toHaveBeenCalledOnce();
    });

    it('pings and drops the connection if WeeChat does not answer', async () => {
        vi.useFakeTimers();
        const closes: CloseInfo[] = [];
        const client = new RelayClient({
            pingInterval: 1000,
            pingTimeout: 500,
            pageProtocol: 'http:',
            onClose: (i) => closes.push(i),
        });
        const connecting = client.connect(OPTIONS);
        await vi.advanceTimersByTimeAsync(0);
        const ws = FakeWebSocket.last;
        ws.open();
        await connecting;

        await vi.advanceTimersByTimeAsync(1000);
        expect(ws.sent[0]).toMatchObject({
            request: 'POST /api/ping',
            body: { data: expect.any(String) },
        });
        ws.reply(200, ws.sent[0].body, 'ping');
        await vi.advanceTimersByTimeAsync(600);
        expect(closes).toEqual([]);

        await vi.advanceTimersByTimeAsync(400 + 500);
        expect(closes).toEqual([
            { code: 4000, reason: 'ping timeout', byClient: false },
        ]);
    });

    it('waits for the answer of a ping before the next one', async () => {
        vi.useFakeTimers();
        const closes: CloseInfo[] = [];
        const client = new RelayClient({
            // a timeout longer than the interval
            pingInterval: 1000,
            pingTimeout: 2500,
            pageProtocol: 'http:',
            onClose: (i) => closes.push(i),
        });
        const connecting = client.connect(OPTIONS);
        await vi.advanceTimersByTimeAsync(0);
        const ws = FakeWebSocket.last;
        ws.open();
        await connecting;

        await vi.advanceTimersByTimeAsync(2000);
        expect(ws.sent).toHaveLength(1);
        // an error answer shows the connection is alive
        ws.reply(400, { error: 'x' });
        await vi.advanceTimersByTimeAsync(1000);
        expect(closes).toEqual([]);
        expect(ws.sent).toHaveLength(2);
        await vi.advanceTimersByTimeAsync(2500);
        expect(closes).toEqual([
            { code: 4000, reason: 'ping timeout', byClient: false },
        ]);
    });
});

describe('resources', () => {
    async function connectApi() {
        const { client, ws } = await connected();
        return { api: new RelayApi(client), ws };
    }

    it('formats every resource of the API', async () => {
        const { api, ws } = await connectApi();
        const calls: Array<[() => Promise<unknown>, Record<string, unknown>]> = [
            [() => api.version(), { request: 'GET /api/version' }],
            [() => api.buffers(), { request: 'GET /api/buffers' }],
            [
                () =>
                    api.buffers({
                        lines: -100,
                        lines_free: 0,
                        nicks: true,
                        colors: 'weechat',
                    }),
                {
                    request:
                        'GET /api/buffers?lines=-100&lines_free=0&nicks=true&colors=weechat',
                },
            ],
            [
                () => api.buffer(42, { lines: -1 }),
                { request: 'GET /api/buffers/42?lines=-1' },
            ],
            [
                () => api.buffer('irc.libera.#weechat'),
                { request: 'GET /api/buffers/irc.libera.%23weechat' },
            ],
            [
                () => api.lines(42, -50, 'weechat'),
                { request: 'GET /api/buffers/42/lines?lines=-50&colors=weechat' },
            ],
            [
                () => api.lines('core.weechat'),
                { request: 'GET /api/buffers/core.weechat/lines' },
            ],
            [
                () => api.line(42, 7, 'strip'),
                { request: 'GET /api/buffers/42/lines/7?colors=strip' },
            ],
            [
                () => api.nicks(42, 'weechat'),
                { request: 'GET /api/buffers/42/nicks?colors=weechat' },
            ],
            [() => api.hotlist(), { request: 'GET /api/hotlist' }],
            [() => api.scripts(), { request: 'GET /api/scripts' }],
            [
                () => api.input('hello'),
                { request: 'POST /api/input', body: { command: 'hello' } },
            ],
            [
                () => api.input('hello', 42),
                {
                    request: 'POST /api/input',
                    body: { buffer_id: 42, command: 'hello' },
                },
            ],
            [
                () => api.input('/part', 'irc.libera.#weechat'),
                {
                    request: 'POST /api/input',
                    body: { buffer_name: 'irc.libera.#weechat', command: '/part' },
                },
            ],
            [
                () => api.completion('/qu', 42, 3),
                {
                    request: 'POST /api/completion',
                    body: { buffer_id: 42, command: '/qu', position: 3 },
                },
            ],
            [
                () => api.completion('/qu'),
                { request: 'POST /api/completion', body: { command: '/qu' } },
            ],
            [
                () => api.ping('123'),
                { request: 'POST /api/ping', body: { data: '123' } },
            ],
            [() => api.ping(), { request: 'POST /api/ping', body: {} }],
            [
                () =>
                    api.sync({
                        sync: true,
                        nicks: true,
                        input: false,
                        colors: 'weechat',
                    }),
                {
                    request: 'POST /api/sync',
                    body: { sync: true, nicks: true, input: false, colors: 'weechat' },
                },
            ],
        ];
        for (const [call, expected] of calls) {
            const result = call();
            const sent = ws.sent[ws.sent.length - 1];
            const { request_id, ...rest } = sent;
            expect(request_id).toMatch(/^gb\d+$/);
            expect(rest).toEqual(expected);
            ws.reply(200, {});
            await result;
        }
    });

    it('returns the body of responses', async () => {
        const { api, ws } = await connectApi();
        const ping = api.ping('abc');
        ws.reply(200, { data: 'abc' }, 'ping');
        expect(await ping).toBe('abc');
        const noData = api.ping();
        ws.reply(204);
        expect(await noData).toBeNull();
        const completion = api.completion('/qu', 1);
        const body = {
            context: 'command',
            base_word: 'qu',
            position_replace: 1,
            add_space: true,
            list: ['quit'],
        };
        ws.reply(200, body, 'completion');
        expect(await completion).toEqual(body);
    });
});
