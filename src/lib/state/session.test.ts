import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    FakeWebSocket,
    flush,
    installFakes,
    nextSocket,
} from '../relay/fake-websocket.test-helper';
import { apiBuffer, apiLine } from './fixtures.test-helper';
import { openedBufferName, Session, type SessionOptions } from './session';

const OPTIONS = {
    host: 'localhost',
    port: 9001,
    path: 'api',
    password: 'secret',
    tls: false,
};

const VERSION = {
    weechat_version: '4.10.1',
    weechat_version_git: '',
    weechat_version_number: 0x040a0100,
    relay_api_version: '0.6.0',
    relay_api_version_number: 0x000600,
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

/** Let pending promises run (also with fake timers) */
async function ticks(): Promise<void> {
    for (let i = 0; i < 20; i++) {
        await Promise.resolve();
    }
}

/** Answer the version request, sent first */
async function answerVersion(ws: FakeWebSocket, version = VERSION): Promise<void> {
    ws.replyTo('GET /api/version', 200, version, 'version');
    await ticks();
}

/** Answer the initial requests of a connection */
async function answerInitialSync(ws: FakeWebSocket): Promise<void> {
    await answerVersion(ws);
    ws.replyTo('GET /api/buffers', 200, BUFFERS, 'buffer');
    ws.replyTo('GET /api/hotlist', 200, [], 'hotlist');
    ws.replyTo('POST /api/sync', 204);
}

/** Open the next WebSocket and answer the initial sync */
async function acceptConnection(): Promise<FakeWebSocket> {
    const ws = await nextSocket();
    ws.open();
    await flush();
    await answerInitialSync(ws);
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
    it('checks the version, loads everything with one batch, shows the first buffer', async () => {
        const { session, ws } = await connected();
        expect(ws.frames[0]).toMatchObject({ request: 'GET /api/version' });
        expect(ws.frames[1]).toEqual([
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
        await answerVersion(ws);
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
        await answerVersion(ws);
        ws.replyTo('GET /api/buffers', 500, { error: 'oops' });
        await expect(connecting).rejects.toThrow();
        expect(session.state.status).toBe('disconnected');
        expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
        // Events of the dropped connection are ignored
        ws.receive(lineEvent(2, 1, 'late'));
        expect(session.state.buffers).toEqual({});
    });

    it('refuses relay API versions older than 0.6.0, without retrying', async () => {
        const { session, ws } = await connected({ reconnectDelay: 1 });
        ws.refuse(1006);
        await vi.waitFor(() => expect(FakeWebSocket.last).not.toBe(ws));
        const old = FakeWebSocket.last;
        old.open();
        await flush();
        await answerVersion(old, {
            ...VERSION,
            weechat_version: '4.9.0',
            relay_api_version: '0.5.0',
            relay_api_version_number: 0x000500,
        });
        await flush();
        expect(session.state.status).toBe('disconnected');
        expect(session.state.error?.kind).toBe('version');
        expect(session.state.error?.message).toContain('WeeChat 4.10 or later');
        expect(old.readyState).toBe(FakeWebSocket.CLOSED);
        // The batch was not sent
        expect(old.sent.map((r) => r.request)).toEqual(['GET /api/version']);
        const count = FakeWebSocket.instances.length;
        await new Promise((r) => setTimeout(r, 20));
        expect(FakeWebSocket.instances).toHaveLength(count);
    });

    it('reports an old relay API when connecting', async () => {
        const session = newSession();
        const connecting = session.connect(OPTIONS);
        const ws = await nextSocket();
        ws.open();
        await flush();
        await answerVersion(ws, {
            ...VERSION,
            relay_api_version: '0.1.0',
            relay_api_version_number: 0x000100,
        });
        await expect(connecting).rejects.toMatchObject({ kind: 'version' });
        expect(session.state.error?.kind).toBe('version');
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
            await answerInitialSync(ws);
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

    it('keeps reconnecting after WeeChat quit, which shows it', async () => {
        const { session, ws } = await connected({ reconnectDelay: 1 });
        ws.receive({ code: 0, message: 'OK', event_name: 'quit', buffer_id: -1 });
        ws.refuse(1000);
        expect(session.state.status).toBe('reconnecting');
        expect(session.state.quitting).toBe(true);
        await acceptConnection();
        await flush();
        expect(session.state.status).toBe('connected');
        expect(session.state.quitting).toBe(false);
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

describe('buffers', () => {
    it('fetches free buffers whole', async () => {
        const { session, ws } = await connected();
        ws.receive({
            code: 0,
            message: 'OK',
            event_name: 'buffer_opened',
            buffer_id: 5,
            body_type: 'buffer',
            body: apiBuffer(5, 3, 'fset.fset', 'fset', {
                type: 'free',
                local_variables: { plugin: 'fset' },
            }),
        });
        session.activate(5);
        expect(ws.sent.map((r) => r.request)).toContain(
            'GET /api/buffers/5/lines?colors=weechat',
        );
    });

    it('fetches the lines of a buffer that received lines before being shown', async () => {
        const { session, ws } = await connected();
        for (let id = 1; id <= 150; id++) {
            ws.receive(lineEvent(2, id, 'line ' + id));
        }
        // (with the 150 unread lines)
        session.activate(2);
        expect(ws.sent.map((r) => r.request)).toContain(
            'GET /api/buffers/2/lines?lines=-150&colors=weechat',
        );
    });

    it('shows and loads another buffer when the active one is closed', async () => {
        const { session, ws } = await connected();
        session.activate(2);
        ws.receive({
            code: 0,
            message: 'OK',
            event_name: 'buffer_closed',
            buffer_id: 2,
            body_type: null,
            body: null,
        });
        expect(session.state.activeBufferId).toBe(1);
    });

    it('opens queries and channels on the server of the buffer', async () => {
        const { session, ws } = await connected();
        session.activate(2);
        session.openQuery(2, '#WeeChat');
        // already open (names are case insensitive)
        expect(session.state.activeBufferId).toBe(2);
        session.openQuery(1, 'bob');
        expect(ws.sent[ws.sent.length - 1]).toMatchObject({
            request: 'POST /api/input',
            body: { buffer_id: 1, command: '/query -noswitch bob' },
        });
        expect(session.state.outgoingQueries).toEqual([
            { name: 'bob', expires: expect.any(Number) },
        ]);
    });

    it('sends each line of a text, skipping empty ones', async () => {
        const { session, ws } = await connected();
        const count = ws.sent.length;
        const sending = session.send(2, 'one\n\ntwo\n');
        await flush();
        ws.reply(204);
        await flush();
        ws.reply(204);
        await sending;
        expect(
            ws.sent.slice(count).map((r) => (r.body as { command: string }).command),
        ).toEqual(['one', 'two']);
    });
});

describe('lines', () => {
    it('tracks the loading of lines per buffer', async () => {
        const { session, ws } = await connected();
        // The first buffer is loading since connected
        expect(session.state.buffers[1].loadingLines).toBe(true);
        void session.fetchLines(2);
        expect(session.state.buffers[2].loadingLines).toBe(true);
        ws.replyTo('GET /api/buffers/1/lines', 200, [], 'line');
        await flush();
        expect(session.state.buffers[1].loadingLines).toBe(false);
        expect(session.state.buffers[2].loadingLines).toBe(true);
    });
});

describe('commands opening a buffer', () => {
    it('finds the name of the buffer', () => {
        expect(openedBufferName('/join #a')).toBe('#a');
        expect(openedBufferName('/j #a,#b key')).toBe('#a');
        expect(openedBufferName('/join -server libera #a')).toBe('#a');
        expect(openedBufferName('/query bob hello')).toBe('bob');
        expect(openedBufferName('/q  bob')).toBe('bob');
        expect(openedBufferName('/join -noswitch #a')).toBeUndefined();
        expect(openedBufferName('/join')).toBeUndefined();
        expect(openedBufferName('/msg bob hi')).toBeUndefined();
        expect(openedBufferName('hello')).toBeUndefined();
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

    it('keeps a limited number of lines', () => {
        const session = newSession();
        for (let i = 0; i < 1005; i++) {
            session.addToHistory(1, 'line ' + i);
        }
        let first = '';
        for (let i = 0; i < 1100; i++) {
            first = session.historyUp(1, first);
        }
        expect(first).toBe('line 5');
    });

    it('is kept when reconnecting, forgotten when the buffer closes', async () => {
        const { session, ws } = await connected({ reconnectDelay: 60000 });
        session.addToHistory(2, 'hello');
        ws.refuse(1006);
        const reconnecting = session.reconnect();
        const current = await acceptConnection();
        await reconnecting;
        expect(session.historyUp(2, '')).toBe('hello');
        session.historyDown(2, 'hello');
        current.receive({
            code: 0,
            message: 'OK',
            event_name: 'buffer_closed',
            buffer_id: 2,
            body_type: null,
            body: null,
        });
        expect(session.historyUp(2, '')).toBe('');
    });

    it('is per buffer', () => {
        const session = newSession();
        session.addToHistory(1, 'one');
        expect(session.historyUp(2, '')).toBe('');
    });
});
