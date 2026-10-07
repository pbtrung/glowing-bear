/*
 * The session with WeeChat and the UI state, with hooks for components.
 */
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Session, type SessionState } from '../lib/state/session';
import type { Buffer } from '../lib/state/model';
import { getSettings, updateSettings, type Settings } from './settings';
import { notifyHighlight } from './notifications';

/** Key of the relay in the settings (buffer to resume per relay) */
export const relayKey = (s: Settings = getSettings()): string =>
    `${s.host}:${s.port}/${s.path}`;

export const isMobileUi = (): boolean =>
    typeof document !== 'undefined' && document.body.clientWidth < 968;

export const windowFocused = (): boolean =>
    typeof document === 'undefined' || document.visibilityState !== 'hidden';

/** Called when a line is added to the active buffer (scroll to the bottom) */
export const activeBufferLineListeners = new Set<() => void>();

export const session = new Session({
    hotlistSync: () => getSettings().hotlistsync,
    windowFocused,
    onHighlight: (bufferId, line) => {
        const buffer = session.state.buffers[bufferId];
        if (buffer) {
            notifyHighlight(buffer, line, () => activateBuffer(bufferId));
        }
    },
    onActiveBufferLine: () => activeBufferLineListeners.forEach((l) => l()),
    resumeBuffer: () => getSettings().currentlyViewedBuffers[relayKey()],
});

export function useChat<T>(selector: (state: SessionState) => T): T {
    return useStore(session.store, selector);
}

export function useChatShallow<T>(selector: (state: SessionState) => T): T {
    return useStore(session.store, useShallow(selector));
}

export const useActiveBuffer = (): Buffer | undefined =>
    useChat((s) =>
        s.activeBufferId !== null ? s.buffers[s.activeBufferId] : undefined,
    );

/*
 * UI state
 */

export type Modal = 'settings' | 'topic' | null;

export interface UiState {
    /** Mobile: buffer list panel open */
    sidebarOpen: boolean;
    /** Mobile: nicklist panel open */
    nicklistOpen: boolean;
    modal: Modal;
    /** Buffer list filter */
    search: string;
    /** Index of the highlighted buffer in the filtered list (keyboard) */
    searchIndex: number;
    /** Alt is pressed: show quick keys (Alt+1..0) */
    showQuickKeys: boolean;
    /** Alt+J pressed: waiting for a 2-digit buffer number */
    jumpMode: boolean;
    /** First digit typed in jump mode */
    jumpDigit: number | null;
    /** Text of the input bar */
    input: string;
}

export const uiStore = createStore<UiState>(() => ({
    sidebarOpen: true,
    nicklistOpen: false,
    modal: null,
    search: '',
    searchIndex: 0,
    showQuickKeys: false,
    jumpMode: false,
    jumpDigit: null,
    input: '',
}));

export function useUi<T>(selector: (state: UiState) => T): T {
    return useStore(uiStore, selector);
}

export const setUi = (partial: Partial<UiState>) => uiStore.setState(partial);

export const closeModal = () => setUi({ modal: null });

/*
 * Buffer list
 */

export interface ListedBuffer {
    buffer: Buffer;
    /** Alt+1..0 */
    quickKey: string;
    /** Alt+J NN */
    jumpKey: number | null;
}

const sortKey = (orderByServer: boolean) => (a: Buffer, b: Buffer) =>
    orderByServer
        ? a.serverSortKey.localeCompare(b.serverSortKey) || a.number - b.number
        : a.number - b.number;

/** Unread messages in the buffers of a server */
function serverHasUnread(buffers: Buffer[], server: Buffer): boolean {
    return buffers.some(
        (b) =>
            b.plugin === server.plugin &&
            b.server === server.server &&
            b !== server &&
            b.unread + b.notification > 0,
    );
}

/**
 * Buffers shown in the buffer list, in order, with their quick and jump keys.
 */
export function listBuffers(
    buffersById: Record<number, Buffer>,
    activeId: number | null,
    settings: Pick<Settings, 'orderbyserver' | 'onlyUnread'>,
    ui: Pick<UiState, 'search' | 'jumpMode' | 'jumpDigit'>,
): ListedBuffer[] {
    const all = Object.values(buffersById);
    const sorted = [...all].sort(sortKey(settings.orderbyserver));

    // Jump keys follow the buffer numbers
    const byNumber = [...all].sort((a, b) => a.number - b.number);
    const jumpKeys = new Map(byNumber.map((b, i) => [b.id, i < 99 ? i + 1 : null]));

    const search = ui.search.toLowerCase();
    const visible = sorted.filter((buffer) => {
        if (ui.jumpMode) {
            const key = jumpKeys.get(buffer.id) ?? null;
            return (
                ui.jumpDigit === null ||
                (key !== null && Math.floor(key / 10) === ui.jumpDigit)
            );
        }
        if (search) {
            return buffer.fullName.toLowerCase().includes(search);
        }
        if (settings.onlyUnread) {
            if (
                buffer.id === activeId ||
                buffer.fullName === 'core.weechat' ||
                buffer.pinned
            ) {
                return true;
            }
            if (settings.orderbyserver && buffer.type === 'server') {
                return serverHasUnread(all, buffer);
            }
            return (buffer.unread > 0 && !buffer.hidden) || buffer.notification > 0;
        }
        return !buffer.hidden;
    });

    // Quick keys: in the list order when filtering, else by number
    const filtered = Boolean(search) || settings.onlyUnread;
    const quickOrder = filtered
        ? visible
        : [...visible].sort((a, b) => a.number - b.number);
    const quickKeys = new Map(
        quickOrder.slice(0, 10).map((b, i) => [b.id, String((i + 1) % 10)]),
    );

    return visible.map((buffer) => ({
        buffer,
        quickKey: quickKeys.get(buffer.id) ?? '',
        jumpKey: jumpKeys.get(buffer.id) ?? null,
    }));
}

export function currentBufferList(): ListedBuffer[] {
    const state = session.state;
    return listBuffers(
        state.buffers,
        state.activeBufferId,
        getSettings(),
        uiStore.getState(),
    );
}

/*
 * Actions
 */

/** Switch to a buffer (and close the buffer list on mobile) */
export function activateBuffer(bufferId: number): void {
    session.activate(bufferId);
    const buffer = session.state.buffers[bufferId];
    if (buffer) {
        updateSettings({
            currentlyViewedBuffers: {
                ...getSettings().currentlyViewedBuffers,
                [relayKey()]: buffer.fullName,
            },
        });
    }
    if (isMobileUi()) {
        setUi({ sidebarOpen: false, nicklistOpen: false });
    }
    setUi({ search: '', searchIndex: 0 });
}

/** Next/previous visible buffer in the list order */
export function switchToAdjacentBuffer(direction: 1 | -1): void {
    const settings = getSettings();
    const state = session.state;
    const sorted = Object.values(state.buffers)
        .filter((b) => !b.hidden || b.id === state.activeBufferId)
        .sort(sortKey(settings.orderbyserver));
    const index = sorted.findIndex((b) => b.id === state.activeBufferId);
    const next = sorted[index + direction];
    if (next) {
        activateBuffer(next.id);
    }
}

/** Next buffer with a highlight, else with unread messages */
export function switchToActivityBuffer(): void {
    const sorted = Object.values(session.state.buffers).sort(
        (a, b) => a.number - b.number,
    );
    const target =
        sorted.find((b) => b.notification > 0) ??
        sorted.find((b) => b.unread > 0 && !b.hidden);
    if (target) {
        activateBuffer(target.id);
    }
}

export function toggleNicklistPanel(): void {
    if (!isMobileUi()) {
        updateSettings({ nonicklist: !getSettings().nonicklist });
        return;
    }
    const open = !uiStore.getState().nicklistOpen;
    setUi({ nicklistOpen: open, sidebarOpen: false });
}

/** Add a mention of the author of a line to the input */
export function addMention(nick: string): void {
    let value = uiStore.getState().input;
    let addColon = value.length === 0;
    if (value.length > 0) {
        // A list of nicks "nick1: " -> "nick1 nick2: "
        const trimmed = value.trim();
        if (trimmed.endsWith(':')) {
            const lastWord = trimmed.slice(trimmed.lastIndexOf(' ') + 1, -1);
            const buffer =
                session.state.activeBufferId !== null
                    ? session.state.buffers[session.state.activeBufferId]
                    : undefined;
            if (
                buffer &&
                Object.values(buffer.nicks).some((n) => n.name === lastWord)
            ) {
                value = value.slice(0, value.lastIndexOf(':')) + ' ';
                addColon = true;
            }
        }
        if (!value.endsWith(' ')) {
            value += ' ';
        }
    }
    value += nick;
    if (addColon) {
        value += ': ';
    }
    setUi({ input: value });
    document.getElementById('sendMessage')?.focus();
}
