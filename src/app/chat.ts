/*
 * The session with WeeChat and the UI state, with hooks for components.
 */
import { useSyncExternalStore } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { activeBuffer } from '../lib/state/reducers';
import { Session, type SessionState } from '../lib/state/session';
import type { Buffer } from '../lib/state/model';
import { getSettings, updateSettings, type Settings } from './settings';
import { notifyHighlight } from './notifications';

/** Key of the relay in the settings (buffer to resume per relay) */
export const relayKey = (s: Settings = getSettings()): string =>
    `${s.host}:${s.port}/${s.path}`;

/** The media query of the mobile layout in glowingbear.css */
const MOBILE_QUERY = '(max-width: 967.98px)';

const mobileQuery = (): MediaQueryList | null =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(MOBILE_QUERY)
        : null;

export const isMobileUi = (): boolean => mobileQuery()?.matches ?? false;

/** isMobileUi(), updated when the window is resized or rotated */
export function useMobileUi(): boolean {
    return useSyncExternalStore((onChange) => {
        const query = mobileQuery();
        query?.addEventListener('change', onChange);
        return () => query?.removeEventListener('change', onChange);
    }, isMobileUi);
}

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

/** Unread lines and notifications (highlights, private messages) of all buffers */
export const useUnreadTotals = (): { unread: number; notifications: number } =>
    useChatShallow((s) => {
        let unread = 0;
        let notifications = 0;
        for (const b of Object.values(s.buffers)) {
            unread += b.unread;
            notifications += b.notification;
        }
        return { unread, notifications };
    });

export const useActiveBuffer = (): Buffer | undefined => useChat(activeBuffer);

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
    /** Text of the input bar (of the buffer shown; the others keep drafts) */
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
    /** Server with buffers under it (when grouped by server) */
    group: boolean;
    /** Its buffers are collapsed */
    collapsed: boolean;
    /** Unread messages and highlights in the collapsed buffers */
    hiddenUnread: number;
    hiddenNotification: number;
    /** Short names of the buffers merged with it (same number in WeeChat) */
    mergedWith: string[];
}

/** Key of the server of a buffer ("irc.libera") */
export const serverKeyOf = (buffer: Buffer): string =>
    `${buffer.plugin}.${buffer.server}`;

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
    settings: Pick<Settings, 'orderbyserver' | 'onlyUnread' | 'collapsedServers'>,
    ui: Pick<UiState, 'search' | 'jumpMode' | 'jumpDigit'>,
): ListedBuffer[] {
    const all = Object.values(buffersById);
    const sorted = [...all].sort(sortKey(settings.orderbyserver));

    // Jump keys follow the buffer numbers
    const byNumber = [...all].sort((a, b) => a.number - b.number);
    const jumpKeys = new Map(byNumber.map((b, i) => [b.id, i < 99 ? i + 1 : null]));

    const search = ui.search.toLowerCase();
    const shown = sorted.filter((buffer) => {
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

    // Group by server: buffers of collapsed servers are hidden (except the
    // active one), their unread counts shown on the server
    const grouped = settings.orderbyserver && !search && !ui.jumpMode;
    const servers = new Map(
        all.filter((b) => b.type === 'server').map((b) => [serverKeyOf(b), b]),
    );
    const collapsed = new Set(grouped ? settings.collapsedServers : []);
    const children = new Map<string, number>();
    const hidden = new Map<string, { unread: number; notification: number }>();
    const visible = shown.filter((buffer) => {
        const key = serverKeyOf(buffer);
        if (buffer.type === 'server' || !servers.has(key)) {
            return true;
        }
        children.set(key, (children.get(key) ?? 0) + 1);
        if (!collapsed.has(key) || buffer.id === activeId) {
            return true;
        }
        const counts = hidden.get(key) ?? { unread: 0, notification: 0 };
        counts.unread += buffer.unread;
        counts.notification += buffer.notification;
        hidden.set(key, counts);
        return false;
    });

    // Quick keys: in the list order when filtering, else by number
    const filtered = Boolean(search) || settings.onlyUnread;
    const quickOrder = filtered
        ? visible
        : [...visible].sort((a, b) => a.number - b.number);
    const quickKeys = new Map(
        quickOrder.slice(0, 10).map((b, i) => [b.id, String((i + 1) % 10)]),
    );

    // Merged buffers share their number
    const sameNumber = new Map<number, Buffer[]>();
    for (const buffer of all) {
        const list = sameNumber.get(buffer.number);
        if (list) {
            list.push(buffer);
        } else {
            sameNumber.set(buffer.number, [buffer]);
        }
    }

    return visible.map((buffer) => {
        const key = serverKeyOf(buffer);
        const group = grouped && buffer.type === 'server' && children.has(key);
        return {
            buffer,
            quickKey: quickKeys.get(buffer.id) ?? '',
            jumpKey: jumpKeys.get(buffer.id) ?? null,
            group,
            collapsed: group && collapsed.has(key),
            hiddenUnread: group ? (hidden.get(key)?.unread ?? 0) : 0,
            hiddenNotification: group ? (hidden.get(key)?.notification ?? 0) : 0,
            mergedWith: (sameNumber.get(buffer.number) ?? [])
                .filter((b) => b.id !== buffer.id)
                .map((b) => b.shortName || b.fullName),
        };
    });
}

/** Collapse or expand the buffers of a server in the buffer list */
export function toggleServerCollapsed(buffer: Buffer): void {
    const key = serverKeyOf(buffer);
    const collapsed = getSettings().collapsedServers;
    updateSettings({
        collapsedServers: collapsed.includes(key)
            ? collapsed.filter((k) => k !== key)
            : [...collapsed, key],
    });
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

/** Next/previous buffer shown in the buffer list */
export function switchToAdjacentBuffer(direction: 1 | -1): void {
    const listed = currentBufferList();
    const index = listed.findIndex((l) => l.buffer.id === session.state.activeBufferId);
    const next = listed[index + direction];
    if (next) {
        activateBuffer(next.buffer.id);
    }
}

/** Next buffer with a highlight, else with unread messages */
export function switchToActivityBuffer(): void {
    const target = activityOrder(
        Object.values(session.state.buffers),
        session.state.activeBufferId,
    )[0];
    if (target) {
        activateBuffer(target.id);
    }
}

/**
 * Buffers with activity in the order of WeeChat's hotlist: highlights and
 * private messages first, then messages; the most recent first.
 */
export function activityOrder(buffers: Buffer[], activeId: number | null): Buffer[] {
    const priority = (b: Buffer) =>
        b.notification > 0 ? 2 : b.unread > 0 && !b.hidden ? 1 : 0;
    return buffers
        .filter((b) => b.id !== activeId && priority(b) > 0)
        .sort((a, b) => priority(b) - priority(a) || b.activityAt - a.activityAt);
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
            const buffer = activeBuffer(session.state);
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
    focusInput();
}

/** Focus the input bar, with the caret at the end */
export function focusInput(): void {
    const input = document.getElementById('sendMessage') as HTMLTextAreaElement | null;
    if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}
