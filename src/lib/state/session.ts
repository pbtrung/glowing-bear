/*
 * A session with WeeChat: connection lifecycle (connect, initial sync,
 * reconnection, WeeChat upgrades) and user actions, on top of a store holding
 * the chat state. Independent of the UI framework.
 */
import { createStore, type StoreApi } from 'zustand/vanilla';
import { RelayApi } from '../relay/api';
import { ConnectError, RelayClient, type ConnectOptions } from '../relay/client';
import type { ApiEvent, ApiCompletion } from '../relay/types';
import type { Line } from './model';
import {
    applyBuffers,
    applyEvent,
    applyHotlist,
    applyLines,
    applyNicklist,
    initialState,
    markAllRead,
    markRead,
    setActiveBuffer,
    type ChatState,
    type Effect,
} from './reducers';

/** WeeChat options used, with defaults (/api/options is newer than WeeChat 4.10) */
export const WEECHAT_OPTIONS: Record<string, string> = {
    'weechat.look.buffer_time_format': '%H:%M:%S',
    'weechat.completion.nick_completer': ':',
    'weechat.completion.nick_add_space': 'on',
};

/** Commands opening a buffer: switch to it once WeeChat opened it */
const OPEN_COMMANDS = ['/query', '/join', '/j', '/q'];

export interface SessionState extends ChatState {
    /** Error of the last connection attempt */
    error: ConnectError | null;
    /** Lines are being fetched for the active buffer */
    loadingLines: boolean;
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
    private hotlistTimer: ReturnType<typeof setInterval> | undefined;
    private reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    private history = new Map<number, { lines: string[]; pos: number }>();
    private readonly options: SessionOptions;

    constructor(options: SessionOptions) {
        this.options = options;
        this.store = createStore<SessionState>(() => ({
            ...initialState,
            error: null,
            loadingLines: false,
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
        this.connectOptions = options;
        this.set({ status: 'connecting', error: null, quitting: false });
        try {
            await this.open(options);
        } catch (e) {
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

    private async open(options: ConnectOptions): Promise<void> {
        const client = new RelayClient({
            onEvent: (event) => this.onEvent(event),
            onClose: (info) => {
                if (this.client === client) {
                    this.onClose(info.byClient);
                }
            },
            pingInterval: this.options.pingInterval,
        });
        await client.connect(options);
        this.client = client;
        this.api = new RelayApi(client);
        await this.initialSync();
    }

    /**
     * Load everything and enable the synchronization. Requests are processed
     * in order by WeeChat, so no event is missed between the buffer list and
     * the sync.
     */
    private async initialSync(): Promise<void> {
        const api = this.api!;
        const previous =
            this.state.activeBufferId !== null
                ? this.state.buffers[this.state.activeBufferId]?.fullName
                : undefined;
        this.set({
            ...initialState,
            status: this.state.status,
            error: null,
            options: { ...WEECHAT_OPTIONS },
        });
        this.history.clear();

        const version = api.version();
        const buffers = api.buffers({ colors: 'weechat' });
        const hotlist = api.hotlist();
        const sync = api.sync({
            sync: true,
            nicks: true,
            input: false,
            colors: 'weechat',
        });

        this.set({ version: await version });
        const buffersResult = await buffers;
        this.update((s) => applyBuffers(s, buffersResult));
        const hotlistResult = await hotlist;
        this.update((s) => applyHotlist(s, hotlistResult));
        await sync;

        this.set({ status: 'connected', upgrading: false });

        // Options and scripts are not needed right away
        for (const name of Object.keys(WEECHAT_OPTIONS)) {
            api.option(name).then(
                (option) => {
                    let value = option.value;
                    if (typeof value === 'boolean') {
                        value = value ? 'on' : 'off';
                    }
                    if (value !== null) {
                        this.set({
                            options: { ...this.state.options, [name]: String(value) },
                        });
                    }
                },
                () => undefined,
            );
        }
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
                () => this.refreshHotlist(),
                this.options.hotlistInterval ?? 60000,
            );
        }
    }

    private onClose(byClient: boolean): void {
        clearInterval(this.hotlistTimer);
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
        this.reconnectTimer = setTimeout(() => this.reconnect(delay), delay);
    }

    /** Try to reconnect now (also when the user asks for it) */
    async reconnect(delay = this.options.reconnectDelay ?? 3000): Promise<void> {
        if (!this.connectOptions || this.state.status === 'connected') {
            return;
        }
        clearTimeout(this.reconnectTimer);
        this.set({ status: 'reconnecting' });
        try {
            await this.open(this.connectOptions);
        } catch {
            const next = delay * 1.5;
            if (next >= (this.options.reconnectMaxDelay ?? 600000)) {
                this.set({ status: 'disconnected' });
            } else {
                this.scheduleReconnect(next);
            }
        }
    }

    /** Disconnect (no reconnection) */
    disconnect(): void {
        clearTimeout(this.reconnectTimer);
        clearInterval(this.hotlistTimer);
        this.set({ status: 'disconnected' });
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
            case 'resync':
                if (this.api) {
                    void this.initialSync();
                }
                break;
            case 'nicklist':
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
        if (buffer.requestedLines < linesWanted && !buffer.allLinesFetched) {
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
     * @param count number of lines (at least twice the current number)
     */
    async fetchLines(bufferId: number, count?: number, unreadHint = 0): Promise<void> {
        const buffer = this.state.buffers[bufferId];
        if (!this.api || !buffer) {
            return;
        }
        const wanted = Math.max(count ?? 0, buffer.requestedLines * 2, 1);
        this.set({ loadingLines: true });
        try {
            const lines = await this.api.lines(bufferId, -wanted, 'weechat');
            this.update((s) => applyLines(s, bufferId, lines, wanted, unreadHint));
        } finally {
            this.set({ loadingLines: false });
        }
    }

    async loadNicklist(bufferId: number): Promise<void> {
        if (!this.api) {
            return;
        }
        const root = await this.api.nicks(bufferId, 'weechat');
        this.update((s) => applyNicklist(s, bufferId, root));
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
        const firstWord = text.split(' ', 1)[0];
        if (OPEN_COMMANDS.includes(firstWord) && text.includes(' ')) {
            const name = text
                .substring(text.indexOf(' ') + 1)
                .trim()
                .split(/\s+/)[0];
            this.set({ outgoingQueries: [...this.state.outgoingQueries, name] });
        }
        for (const line of text.split(/\r?\n/)) {
            if ((line === '/quit' || line.startsWith('/quit ')) && !confirmQuit()) {
                continue;
            }
            await this.input(line, bufferId);
        }
        if (this.options.hotlistSync()) {
            this.clearHotlist(bufferId);
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
        const fullName =
            buffer.fullName.substring(0, buffer.fullName.lastIndexOf('.') + 1) + nick;
        const existing = Object.values(this.state.buffers).find(
            (b) => b.fullName === fullName,
        );
        if (existing) {
            this.activate(existing.id);
            return;
        }
        // Channel names start with #, &, + or ! (RFC 2811)
        const command = /^[#&+!]/.test(nick) ? '/join -noswitch ' : '/query -noswitch ';
        this.set({ outgoingQueries: [...this.state.outgoingQueries, nick] });
        void this.input(command + nick, bufferId).catch(() => undefined);
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
        history.pos = history.lines.length;
    }

    /** Previous line of the history (the current one is kept for coming back) */
    historyUp(bufferId: number, current: string): string {
        const history = this.historyOf(bufferId);
        if (history.pos >= history.lines.length) {
            history.lines.push(current);
        }
        if (history.pos <= 0 || history.pos >= history.lines.length) {
            return current;
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
