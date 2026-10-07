import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    FakeWebSocket,
    flush,
    installFakes,
    nextSocket,
} from '../relay/fake-websocket.test-helper';
import { apiBuffer, apiLine } from './fixtures.test-helper';
import { Session, type SessionOptions } from './session';

const OPTIONS = {
    host: 'localhost',
    port: 9001,
    path: 'api',
    password: 'secret',
    tls: false,
};

const VERSION = {
    weechat_version: '4.4.0',
    weechat_version_git: '',
    weechat_version_number: 0x04040000,
    relay_api_version: '0.2.0',
    relay_api_version_number: 0x000200,
};

const BUFFERS = [
    apiBuffer(1, 1, 'core.weechat', 'weechat', {
        local_variables: { plugin: 'core', name: 'weechat' },
        nicklist: false,
    }),
    apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
];

beforeEach(() => {
    installFakes();
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

const newSession = (options: Partial<SessionOptions> = {}) =>
    new Session({ hotlistSync: () => false, pingInterval: 0, ...options });

/** Answer the initial requests of a connection */
function answerInitialSync(ws: FakeWebSocket): void {
    ws.replyTo('GET /api/version', 200, VERSION, 'version');
    ws.replyTo('GET /api/buffers', 200, BUFFERS, 'buffer');
    ws.replyTo('GET /api/hotlist', 200, [], 'hotlist');
    ws.replyTo('POST /api/sync', 204);
}

/** Open the next WebSocket and answer the initial sync */
async function acceptConnection(): Promise<FakeWebSocket> {
    const ws = await nextSocket();
    ws.open();
    await flush();
    answerInitialSync(ws);
    await flush();
    return ws;
}

async function connected(options: Partial<SessionOptions> = {}) {
    const session = newSession(options);
    const connecting = session.connect(OPTIONS);
    const ws = await acceptConnection();
    await connecting;
    return { session, ws };
}

const lineEvent = (bufferId: number, id: number, message: string) => ({
    code: 0,
    message: 'OK',
    event_name: 'buffer_line_added',
    buffer_id: bufferId,
    body_type: 'line',
    body: apiLine(id, message),
});

describe('connection', () => {
    it('loads everything with one batch, then shows the first buffer', async () => {
        const { session, ws } = await connected();
        expect(ws.frames[0]).toEqual([
            expect.objectContaining({ request: 'GET /api/version' }),
            expect.objectContaining({ request: 'GET /api/buffers?colors=weechat' }),
            expect.objectContaining({ request: 'GET /api/hotlist' }),
            expect.objectContaining({
                request: 'POST /api/sync',
                body: { sync: true, nicks: true, input: false, colors: 'weechat' },
            }),
        ]);
        expect(session.state.status).toBe('connected');
        expect(session.state.version).toEqual(VERSION);
        expect(Object.keys(session.state.buffers)).toEqual(['1', '2']);
        expect(session.state.activeBufferId).toBe(1);
        expect(ws.sent.map((r) => r.request)).toContain(
            'GET /api/buffers/1/lines?lines=-100&colors=weechat',
        );
    });

    it('never goes through another status while loading', async () => {
        const session = newSession();
        const statuses: string[] = [];
        session.store.subscribe((s) => statuses.push(s.status));
        const connecting = session.connect(OPTIONS);
        await acceptConnection();
        await connecting;
        expect([...new Set(statuses)]).toEqual(['connecting', 'connected']);
    });

    it('cancels the connection when disconnecting while connecting', async () => {
        const session = newSession();
        const connecting = session.connect(OPTIONS);
        const ws = await nextSocket();
        session.disconnect();
        ws.open();
        await connecting;
        expect(session.state.status).toBe('disconnected');
        expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
    });

    it('cancels the connection when disconnecting during the initial sync', async () => {
        const session = newSession();
        const connecting = session.connect(OPTIONS);
        const ws = await nextSocket();
        ws.open();
        await flush();
        session.disconnect();
        answerInitialSync(ws);
        await connecting;
        expect(session.state.status).toBe('disconnected');
        expect(session.state.buffers).toEqual({});
    });

    it('closes the connection when the initial sync fails', async () => {
        const session = newSession();
        const connecting = session.connect(OPTIONS);
        const ws = await nextSocket();
        ws.open();
        await flush();
        ws.replyTo('GET /api/buffers', 500, { error: 'oops' });
        await expect(connecting).rejects.toThrow();
        expect(session.state.status).toBe('disconnected');
        expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
        // Events of the dropped connection are ignored
        ws.receive(lineEvent(2, 1, 'late'));
        expect(session.state.buffers).toEqual({});
    });

    it('reconnects with a growing delay, and gives up', async () => {
        vi.useFakeTimers();
        const { session, ws } = await (async () => {
            const session = newSession({
                reconnectDelay: 1000,
                reconnectMaxDelay: 3000,
            });
            const connecting = session.connect(OPTIONS);
            await vi.advanceTimersByTimeAsync(0);
            const ws = FakeWebSocket.last;
            ws.open();
            await vi.advanceTimersByTimeAsync(0);
            answerInitialSync(ws);
            await connecting;
            return { session, ws };
        })();
        const count = FakeWebSocket.instances.length;
        ws.refuse(1006);
        expect(session.state.status).toBe('reconnecting');
        // The buffers are kept while reconnecting
        expect(Object.keys(session.state.buffers)).toHaveLength(2);

        await vi.advanceTimersByTimeAsync(1000);
        expect(FakeWebSocket.instances).toHaveLength(count + 1);
        FakeWebSocket.last.refuse(1006);
        await vi.advanceTimersByTimeAsync(0);
        // Second attempt after 1.5 s; the third would be after 2.25 * 1.5 > 3 s
        await vi.advanceTimersByTimeAsync(1500);
        expect(FakeWebSocket.instances).toHaveLength(count + 2);
        FakeWebSocket.last.refuse(1006);
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(2250);
        expect(FakeWebSocket.instances).toHaveLength(count + 3);
        FakeWebSocket.last.refuse(1006);
        await vi.advanceTimersByTimeAsync(0);
        expect(session.state.status).toBe('disconnected');
    });

    it('replaces a reconnection in progress, ignoring the old connection', async () => {
        const { session, ws } = await connected({ reconnectDelay: 60000 });
        ws.refuse(1006);
        const first = session.reconnect();
        const old = await nextSocket();
        const second = session.reconnect();
        old.open();
        await first;
        expect(old.readyState).toBe(FakeWebSocket.CLOSED);

        const current = await acceptConnection();
        await second;
        expect(session.state.status).toBe('connected');
        old.receive(lineEvent(2, 1, 'from the old connection'));
        current.receive(lineEvent(2, 2, 'from the new one'));
        expect(session.state.buffers[2].lines.map((l) => l.id)).toEqual([2]);
    });

    it('reconnects after a WeeChat upgrade', async () => {
        const { session, ws } = await connected({ reconnectDelay: 1 });
        ws.receive({ code: 0, message: 'OK', event_name: 'upgrade', buffer_id: -1 });
        expect(session.state.status).toBe('reconnecting');
        expect(session.state.upgrading).toBe(true);
        await acceptConnection();
        await flush();
        expect(session.state.status).toBe('connected');
        expect(session.state.upgrading).toBe(false);
    });

    it('resumes on the buffer shown before reconnecting', async () => {
        const { session, ws } = await connected({ reconnectDelay: 60000 });
        session.activate(2);
        ws.refuse(1006);
        const reconnecting = session.reconnect();
        await acceptConnection();
        await reconnecting;
        expect(session.state.activeBufferId).toBe(2);
    });
});

describe('input history', () => {
    it('navigates up and down, keeping the line being typed', async () => {
        const session = newSession();
        session.addToHistory(1, 'one');
        session.addToHistory(1, 'two');
        expect(session.historyUp(1, 'typing')).toBe('two');
        expect(session.historyUp(1, 'two')).toBe('one');
        expect(session.historyUp(1, 'one')).toBe('one');
        expect(session.historyDown(1, 'one')).toBe('two');
        expect(session.historyDown(1, 'two')).toBe('typing');
        // At the bottom, the text is stashed in the history like WeeChat does
        expect(session.historyDown(1, 'typing')).toBe('');
        expect(session.historyUp(1, '')).toBe('typing');
    });

    it('keeps the text with an empty history', () => {
        const session = newSession();
        expect(session.historyUp(1, 'text')).toBe('text');
        expect(session.historyDown(1, 'text')).toBe('');
        expect(session.historyUp(1, '')).toBe('text');
    });

    it('is per buffer', () => {
        const session = newSession();
        session.addToHistory(1, 'one');
        expect(session.historyUp(2, '')).toBe('');
    });
});
