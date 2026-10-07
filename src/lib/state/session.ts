/*
 * A session with WeeChat: connection lifecycle (connect, initial sync,
 * reconnection, WeeChat upgrades) and user actions, on top of a store holding
 * the chat state. Independent of the UI framework.
 */
import { createStore, type StoreApi } from 'zustand/vanilla';
import { RelayApi } from '../relay/api';
import {
    ConnectError,
    MIN_RELAY_API,
    RelayClient,
    type ConnectOptions,
} from '../relay/client';
import type { ApiEvent, ApiCompletion } from '../relay/types';
import type { Line } from './model';
import {
    activeBuffer,
    applyBuffers,
    applyEvent,
    applyHotlist,
    applyLines,
    applyNicklist,
    initialState,
    markAllRead,
    markRead,
    setActiveBuffer,
    setLoadingLines,
    type ChatState,
    type Effect,
} from './reducers';

/**
 * WeeChat options used: their default values (relay API 0.6.0 can't read
 * options)
 */
export const WEECHAT_OPTIONS: Record<string, string> = {
    'weechat.look.buffer_time_format': '%H:%M:%S',
    'weechat.completion.nick_completer': ':',
    'weechat.completion.nick_add_space': 'on',
};

/** Time to wait for a buffer we asked to open (ms) */
const OUTGOING_QUERY_TIMEOUT = 60000;

/** Lines kept in the input history of a buffer */
const HISTORY_SIZE = 1000;

/** Commands opening a buffer: switch to it once WeeChat opened it */
const OPEN_COMMANDS = ['/query', '/join', '/j', '/q'];

/**
 * Name of the buffer a command opens ("/join -server x #a,#b" → "#a"), or
 * undefined (not such a command, or with -noswitch).
 */
export function openedBufferName(text: string): string | undefined {
    const words = text.trim().split(/\s+/);
    if (!OPEN_COMMANDS.includes(words[0])) {
        return undefined;
    }
    let i = 1;
    for (; i < words.length && words[i].startsWith('-'); i++) {
        if (words[i] === '-noswitch') {
            return undefined;
        }
        if (words[i] === '-server') {
            // its value
            i++;
        }
    }
    return words[i]?.split(',')[0] || undefined;
}

/** A connection attempt replaced by a newer one, or by a disconnect */
class Cancelled extends Error {
    constructor() {
        super('Connection attempt cancelled');
    }
}

export interface SessionState extends ChatState {
    /** Round-trip time of the last ping (ms), null if unknown */
    latency: number | null;
    /** Error of the last connection attempt */
    error: ConnectError | null;
}

export interface SessionOptions {
    /** Clear WeeChat's hotlist when viewing a buffer, and poll the hotlist */
    hotlistSync: () => boolean;
    /** Whether the window has the focus */
    windowFocused?: () => boolean;
    /** Called for highlights and private messages to notify */
    onHighlight?: (bufferId: number, line: Line) => void;
    /** Called when a line is added to the active buffer */
    onActiveBufferLine?: () => void;
    /** Full name of the buffer to show after connecting */
    resumeBuffer?: () => string | undefined;
    /** Interval between hotlist refreshes in ms */
    hotlistInterval?: number;
    /** Keepalive ping interval in ms (0 to disable) */
    pingInterval?: number;
    /** First reconnection delay in ms (multiplied by 1.5 at each attempt) */
    reconnectDelay?: number;
    /** Give up reconnecting when the delay reaches this (ms) */
    reconnectMaxDelay?: number;
}

export class Session {
    readonly store: StoreApi<SessionState>;
    private client: RelayClient | null = null;
    private api: RelayApi | null = null;
    private connectOptions: ConnectOptions | null = null;
    /** Number of the last connection attempt (see open()) */
    private attempt = 0;
    private hotlistTimer: ReturnType<typeof setInterval> | undefined;
    private reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    private history = new Map<number, { lines: string[]; pos: number }>();
    private readonly options: SessionOptions;

    constructor(options: SessionOptions) {
        this.options = options;
        this.store = createStore<SessionState>(() => ({
            ...initialState,
            error: null,
            latency: null,
        }));
    }

    get state(): SessionState {
        return this.store.getState();
    }

    private set(partial: Partial<SessionState>): void {
        this.store.setState(partial);
    }

    private update(fn: (state: ChatState) => ChatState): void {
        this.store.setState((s) => ({ ...s, ...fn(s) }));
    }

    /*
     * Connection
     */

    /** Connect to WeeChat; resolves when connected, rejects with a ConnectError */
    async connect(options: ConnectOptions): Promise<void> {
        if (this.state.status === 'connecting' || this.state.status === 'connected') {
            return;
        }
        clearTimeout(this.reconnectTimer);
        // (the history is kept when reconnecting: buffer ids don't change)
        this.history.clear();
        this.connectOptions = options;
        this.set({ status: 'connecting', error: null, quitting: false });
        try {
            await this.open(options);
        } catch (e) {
            if (e instanceof Cancelled) {
                return;
            }
            this.set({
                status: 'disconnected',
                error:
                    e instanceof ConnectError
                        ? e
                        : new ConnectError('network', String(e)),
            });
            throw e;
        }
    }

    /**
     * Open a connection and load everything. A newer attempt (or a disconnect)
     * cancels it: it then closes its connection and rejects with Cancelled.
     */
    private async open(options: ConnectOptions): Promise<void> {
        const attempt = ++this.attempt;
        const current = () => {
            if (attempt !== this.attempt) {
                throw new Cancelled();
            }
        };
        const client = new RelayClient({
            onEvent: (event) => {
                if (this.client === client) {
                    this.onEvent(event);
                }
            },
            onClose: (info) => {
                if (this.client === client) {
                    this.onClose(info.byClient);
                }
            },
            pingInterval: this.options.pingInterval,
            onLatency: (latency) => {
                if (this.client === client) {
                    this.set({ latency });
                }
            },
        });
        try {
            await client.connect(options);
            current();
            this.client = client;
            this.api = new RelayApi(client);
            await this.initialSync(client, this.api, current);
        } catch (e) {
            if (this.client === client) {
                this.client = null;
                this.api = null;
            }
            client.close();
            throw attempt === this.attempt ? e : new Cancelled();
        }
    }

    /**
     * Check the relay API version, then load everything and enable the
     * synchronization. These requests are sent in one frame so that no event
     * is missed between the buffer list and the sync.
     *
     * @param current throws if the connection attempt was cancelled
     */
    private async initialSync(
        client: RelayClient,
        api: RelayApi,
        current: () => void,
    ): Promise<void> {
        const previous = activeBuffer(this.state)?.fullName;
        // Alone first: older relays may not answer the batch
        const version = await api.version();
        current();
        if (version.relay_api_version_number < MIN_RELAY_API.number) {
            throw new ConnectError(
                'version',
                `WeeChat ${version.weechat_version} has relay API ` +
                    `${version.relay_api_version}: Glowing Bear needs relay API ` +
                    `${MIN_RELAY_API.version} or newer (WeeChat ` +
                    `${MIN_RELAY_API.weechat} or later).`,
            );
        }
        const [buffers, hotlist] = await Promise.all(
            client.batch(
                () =>
                    [
                        api.buffers({ colors: 'weechat' }),
                        api.hotlist(),
                        api.sync({
                            sync: true,
                            nicks: true,
                            // the input of buffers, shared with other clients
                            input: true,
                            colors: 'weechat',
                        }),
                    ] as const,
            ),
        );
        current();

        const loaded: ChatState = {
            ...initialState,
            status: 'connected',
            options: { ...WEECHAT_OPTIONS },
            version,
        };
        this.set({
            ...applyHotlist(applyBuffers(loaded, buffers), hotlist),
            error: null,
        });

        // The latency, then every keepalive ping updates it
        client.ping().catch(() => undefined);

        // Scripts are not needed right away
        api.scripts().then(
            (scripts) => this.set({ scripts }),
            () => undefined,
        );

        // Show the buffer we were on, else the first one
        const resume = previous ?? this.options.resumeBuffer?.();
        const sorted = Object.values(this.state.buffers).sort(
            (a, b) => a.number - b.number,
        );
        const target = sorted.find((b) => b.fullName === resume) ?? sorted[0];
        if (target) {
            this.activate(target.id);
        }

        clearInterval(this.hotlistTimer);
        if (this.options.hotlistSync()) {
            this.hotlistTimer = setInterval(
                () => void this.refreshHotlist(),
                this.options.hotlistInterval ?? 60000,
            );
        }
    }

    private onClose(byClient: boolean): void {
        clearInterval(this.hotlistTimer);
        this.set({ latency: null });
        this.client = null;
        this.api = null;
        if (byClient || this.state.status === 'disconnected') {
            this.set({ status: 'disconnected' });
            return;
        }
        // Keep the UI while reconnecting
        this.set({ status: 'reconnecting' });
        this.scheduleReconnect(this.options.reconnectDelay ?? 3000);
    }

    private scheduleReconnect(delay: number): void {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => void this.reconnect(delay), delay);
    }

    /**
     * Try to reconnect now (also when the user asks for it): an attempt in
     * progress is replaced by this one.
     */
    async reconnect(delay = this.options.reconnectDelay ?? 3000): Promise<void> {
        if (
            !this.connectOptions ||
            this.state.status === 'connected' ||
            this.state.status === 'connecting'
        ) {
            return;
        }
        clearTimeout(this.reconnectTimer);
        this.set({ status: 'reconnecting' });
        try {
            await this.open(this.connectOptions);
        } catch (e) {
            if (e instanceof Cancelled) {
                return;
            }
            if (e instanceof ConnectError && e.kind === 'version') {
                // retrying won't help
                this.set({ status: 'disconnected', error: e });
                return;
            }
            const next = delay * 1.5;
            if (next >= (this.options.reconnectMaxDelay ?? 600000)) {
                this.set({ status: 'disconnected' });
            } else {
                this.scheduleReconnect(next);
            }
        }
    }

    /** Disconnect (no reconnection); cancels a connection in progress */
    disconnect(): void {
        this.attempt++;
        clearTimeout(this.reconnectTimer);
        clearInterval(this.hotlistTimer);
        this.set({ status: 'disconnected', latency: null });
        const client = this.client;
        this.client = null;
        this.api = null;
        client?.close();
    }

    private async refreshHotlist(): Promise<void> {
        if (!this.api) {
            return;
        }
        try {
            const hotlist = await this.api.hotlist();
            this.update((s) => applyHotlist(s, hotlist));
        } catch {
            // connection lost, the reconnection reloads it
        }
    }

    /*
     * Events
     */

    private onEvent(event: ApiEvent): void {
        if (event.event_name === 'buffer_closed') {
            this.history.delete(event.buffer_id);
        }
        const result = applyEvent(this.state, event, {
            windowFocused: this.options.windowFocused?.() ?? true,
        });
        this.update(() => result.state);
        for (const effect of result.effects) {
            this.runEffect(effect);
        }
    }

    private runEffect(effect: Effect): void {
        switch (effect.type) {
            case 'highlight':
                this.options.onHighlight?.(effect.bufferId, effect.line);
                break;
            case 'activeBufferLine':
                this.options.onActiveBufferLine?.();
                break;
            case 'activate':
                this.activate(effect.bufferId);
                break;
            case 'upgrade':
                // Frames received after the upgrade can't be decompressed with
                // this WebSocket: reconnect, which reloads everything
                this.client?.abort('upgrade');
                break;
        }
    }

    /*
     * Buffers
     */

    /**
     * Switch to a buffer: load its lines and nicklist if needed, and mark it
     * as read in WeeChat.
     *
     * @param linesWanted number of lines to load if none are loaded yet
     */
    activate(bufferId: number, linesWanted = 100): void {
        const before = this.state.buffers[bufferId];
        if (!before) {
            return;
        }
        const unread = before.unread + before.notification;
        this.update((s) => setActiveBuffer(s, bufferId));
        const buffer = this.state.buffers[bufferId];
        if (
            (!buffer.linesFetched || buffer.requestedLines < linesWanted) &&
            !buffer.allLinesFetched
        ) {
            void this.fetchLines(
                bufferId,
                Math.max(linesWanted, Math.min(unread, 4 * linesWanted)),
                unread,
            );
        }
        if (buffer.hasNicklist && !buffer.nicklistLoaded) {
            void this.loadNicklist(bufferId);
        }
        if (this.options.hotlistSync()) {
            this.clearHotlist(bufferId);
        }
    }

    /** Switch back to the previously active buffer */
    activatePrevious(): void {
        if (this.state.previousBufferId !== null) {
            this.activate(this.state.previousBufferId);
        }
    }

    /**
     * Fetch the last lines of a buffer (replacing the loaded ones).
     *
     * @param count number of lines (at least twice the number fetched)
     */
    async fetchLines(bufferId: number, count?: number, unreadHint = 0): Promise<void> {
        const buffer = this.state.buffers[bufferId];
        if (!this.api || !buffer) {
            return;
        }
        // Free buffers (e.g. /fset) are fetched whole: their lines are a screen
        const wanted = buffer.free
            ? Infinity
            : Math.max(
                  count ?? 0,
                  buffer.linesFetched ? buffer.requestedLines * 2 : 0,
                  1,
              );
        this.update((s) => setLoadingLines(s, bufferId, true));
        try {
            const lines = await this.api.lines(
                bufferId,
                buffer.free ? undefined : -wanted,
                'weechat',
            );
            this.update((s) => applyLines(s, bufferId, lines, wanted, unreadHint));
        } catch {
            // connection lost (the reconnection reloads them), or buffer closed
        } finally {
            this.update((s) => setLoadingLines(s, bufferId, false));
        }
    }

    async loadNicklist(bufferId: number): Promise<void> {
        if (!this.api) {
            return;
        }
        try {
            const root = await this.api.nicks(bufferId, 'weechat');
            this.update((s) => applyNicklist(s, bufferId, root));
        } catch {
            // connection lost (the reconnection reloads it), or buffer closed
        }
    }

    /** Clear the unread counters of a buffer, locally */
    markRead(bufferId: number): void {
        this.update((s) => markRead(s, bufferId));
    }

    /** Remove a buffer from WeeChat's hotlist and move its read marker */
    clearHotlist(bufferId: number): void {
        void this.input('/buffer set hotlist -1', bufferId).catch(() => undefined);
        void this.input('/input set_unread_current_buffer', bufferId).catch(
            () => undefined,
        );
    }

    /** Clear all unread counters, here and in WeeChat */
    clearAllHotlists(): void {
        this.update((s) => markAllRead(s));
        void this.input('/hotlist clear').catch(() => undefined);
    }

    /*
     * Input
     */

    /** Send text or a command to a buffer (core.weechat by default) */
    async input(command: string, bufferId?: number): Promise<void> {
        if (!this.api) {
            throw new Error('Not connected');
        }
        await this.api.input(command, bufferId ?? 'core.weechat');
    }

    /**
     * Send what the user typed in the input bar of a buffer: one message per
     * line, remembered in the history.
     *
     * @param confirmQuit asked before sending /quit; false skips the line
     */
    async send(
        bufferId: number,
        text: string,
        confirmQuit: () => boolean = () => true,
    ): Promise<void> {
        if (text === '') {
            return;
        }
        this.addToHistory(bufferId, text);
        const opened = openedBufferName(text);
        if (opened) {
            this.expectBuffer(opened);
        }
        // A buffer accepting multi-line input gets the text whole
        const multiline = this.state.buffers[bufferId]?.inputMultiline === true;
        const lines = multiline && !text.startsWith('/') ? [text] : text.split(/\r?\n/);
        for (const line of lines) {
            if (line === '') {
                continue;
            }
            if ((line === '/quit' || line.startsWith('/quit ')) && !confirmQuit()) {
                continue;
            }
            await this.input(line, bufferId);
        }
        if (this.options.hotlistSync()) {
            this.clearHotlist(bufferId);
        }
    }

    /**
     * Set the text of WeeChat's input of a buffer (shared with WeeChat and
     * its other clients): sent in one frame, so nothing happens in between.
     */
    setRemoteInput(bufferId: number, text: string): void {
        const client = this.client;
        const api = this.api;
        if (!client || !api) {
            return;
        }
        // "/input insert" reads escapes like /print
        const escaped = text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        const requests = client.batch(() => [
            api.input('/input delete_input', bufferId),
            ...(text ? [api.input('/input insert ' + escaped, bufferId)] : []),
        ]);
        for (const request of requests) {
            request.catch(() => undefined);
        }
    }

    /** Run the commands of a key binding of a buffer (e.g. /fset -down) */
    runKeyCommands(bufferId: number, commands: string[]): void {
        for (const command of commands) {
            void this.input(command, bufferId).catch(() => undefined);
        }
    }

    /** Ask WeeChat to complete a command */
    completion(
        bufferId: number,
        text: string,
        position: number,
    ): Promise<ApiCompletion> {
        if (!this.api) {
            return Promise.reject(new Error('Not connected'));
        }
        return this.api.completion(text, bufferId, position);
    }

    /** Open a query with a nick, or switch to it */
    openQuery(bufferId: number, nick: string): void {
        const buffer = this.state.buffers[bufferId];
        if (!buffer) {
            return;
        }
        // IRC buffers are named irc.<server>.<channel or nick>
        const fullName = (
            buffer.plugin === 'irc' && buffer.server
                ? `irc.${buffer.server}.${nick}`
                : buffer.fullName.substring(0, buffer.fullName.lastIndexOf('.') + 1) +
                  nick
        ).toLowerCase();
        const existing = Object.values(this.state.buffers).find(
            (b) => b.fullName.toLowerCase() === fullName,
        );
        if (existing) {
            this.activate(existing.id);
            return;
        }
        // Channel names start with #, &, + or ! (RFC 2811)
        const command = /^[#&+!]/.test(nick) ? '/join -noswitch ' : '/query -noswitch ';
        this.expectBuffer(nick);
        void this.input(command + nick, bufferId).catch(() => undefined);
    }

    /** Switch to the buffer with this short name once WeeChat opens it */
    private expectBuffer(name: string): void {
        this.set({
            outgoingQueries: [
                ...this.state.outgoingQueries,
                { name, expires: Date.now() + OUTGOING_QUERY_TIMEOUT },
            ],
        });
    }

    /*
     * Input history, per buffer
     */

    private historyOf(bufferId: number): { lines: string[]; pos: number } {
        let history = this.history.get(bufferId);
        if (!history) {
            history = { lines: [], pos: 0 };
            this.history.set(bufferId, history);
        }
        return history;
    }

    addToHistory(bufferId: number, text: string): void {
        const history = this.historyOf(bufferId);
        if (history.pos !== history.lines.length) {
            // Drop the line cached when navigating the history
            history.lines.pop();
        }
        history.lines.push(text);
        if (history.lines.length > HISTORY_SIZE) {
            history.lines.shift();
        }
        history.pos = history.lines.length;
    }

    /** Previous line of the history (the current one is kept for coming back) */
    historyUp(bufferId: number, current: string): string {
        const history = this.historyOf(bufferId);
        if (history.pos <= 0) {
            return current;
        }
        if (history.pos >= history.lines.length) {
            // stash the line being typed, popped when coming back down
            history.lines.push(current);
        }
        history.pos--;
        return history.lines[history.pos];
    }

    /** Next line of the history; at the end, the current text is pushed to it */
    historyDown(bufferId: number, current: string): string {
        const history = this.historyOf(bufferId);
        if (history.pos === history.lines.length) {
            // stash the current text like WeeChat does
            if (current !== '') {
                history.lines.push(current);
                history.pos++;
            }
            return '';
        }
        if (history.pos < 0 || history.pos > history.lines.length) {
            return current;
        }
        history.pos++;
        if (history.lines.length > 0 && history.pos === history.lines.length - 1) {
            // back to the line we were typing
            return history.lines.pop() ?? '';
        }
        return history.lines[history.pos];
    }
}
