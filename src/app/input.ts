/*
 * The text of the input bar, per buffer, shared with WeeChat.
 *
 * Drafts: each buffer keeps the text typed in it when another one is shown.
 *
 * Shared input (setting syncInput): what is typed here is set in WeeChat's
 * input of the buffer after a pause, and what is typed in WeeChat or its
 * other clients (input_text_changed) comes here. The events of our own
 * changes (echoes) are ignored. A buffer without a draft shows WeeChat's
 * input.
 */
import type { SessionState } from '../lib/state/session';
import { session, setUi, uiStore } from './chat';
import { getSettings, settingsStore } from './settings';

/** Local text of the buffers not shown, by buffer id */
const drafts = new Map<number, string>();

/**
 * Texts we recently set in WeeChat's input, by buffer: their events (and
 * the empty input in between) are echoes
 */
const pushed = new Map<number, { texts: Set<string>; at: number }>();
/** An echo is not expected anymore after this (ms) */
const ECHO_TIMEOUT = 3000;
const PUSH_DELAY = 400;
let pushTimer: ReturnType<typeof setTimeout> | undefined;
/** The input bar is being set by us, not typed in (not to push it) */
let applying = false;

const syncing = () => getSettings().syncInput;

function setInputBar(text: string): void {
    applying = true;
    try {
        setUi({ input: text });
    } finally {
        applying = false;
    }
}

function isEcho(bufferId: number, text: string): boolean {
    const echo = pushed.get(bufferId);
    if (!echo || Date.now() - echo.at > ECHO_TIMEOUT) {
        pushed.delete(bufferId);
        return false;
    }
    return echo.texts.has(text);
}

/**
 * Set WeeChat's input of a buffer (the one shown by default) to a text (the
 * input bar by default), now, if it differs
 */
export function flushInput(
    text = uiStore.getState().input,
    bufferId = session.state.activeBufferId,
): void {
    clearTimeout(pushTimer);
    const buffer = bufferId !== null ? session.state.buffers[bufferId] : undefined;
    if (
        !buffer ||
        !syncing() ||
        buffer.input === text ||
        session.state.status !== 'connected'
    ) {
        return;
    }
    const echo = pushed.get(buffer.id);
    const texts =
        echo && Date.now() - echo.at < ECHO_TIMEOUT ? echo.texts : new Set(['']);
    texts.add(text);
    pushed.set(buffer.id, { texts, at: Date.now() });
    session.setRemoteInput(buffer.id, text);
}

/** Show the text of a buffer in the input bar: its draft, else WeeChat's input */
function restore(state: SessionState, bufferId: number): void {
    const buffer = state.buffers[bufferId];
    const draft = drafts.get(bufferId);
    drafts.delete(bufferId);
    const remote = syncing() ? (buffer?.input ?? '') : '';
    setInputBar(draft ?? remote);
    if (draft !== undefined && draft !== remote && syncing()) {
        // typed while disconnected or not sharing: WeeChat doesn't have it
        flushInput(draft, bufferId);
    }
}

/** Buffer switches: keep the text of the buffer left, show the other one */
function onActiveBuffer(state: SessionState, previous: SessionState): void {
    const text = uiStore.getState().input;
    const left = previous.activeBufferId;
    if (left !== null && state.buffers[left]) {
        // What was typed last, unless this is a reconnection: then WeeChat's
        // input wins (it may have changed meanwhile)
        if (previous.status === 'connected' && state.status === 'connected') {
            flushInput(text, left);
        } else {
            clearTimeout(pushTimer);
        }
        const remote = syncing() ? state.buffers[left].input : '';
        if (text !== remote) {
            drafts.set(left, text);
        } else {
            drafts.delete(left);
        }
    }
    if (state.activeBufferId !== null) {
        restore(state, state.activeBufferId);
    }
}

/** Changes of WeeChat's input made in WeeChat or its other clients */
function onRemoteInput(state: SessionState, previous: SessionState): void {
    for (const buffer of Object.values(state.buffers)) {
        const before = previous.buffers[buffer.id];
        if (before === undefined || before.input === buffer.input) {
            continue;
        }
        if (isEcho(buffer.id, buffer.input)) {
            continue;
        }
        pushed.delete(buffer.id);
        if (buffer.id === state.activeBufferId) {
            // (newer than what we were about to push)
            clearTimeout(pushTimer);
            if (uiStore.getState().input !== buffer.input) {
                setInputBar(buffer.input);
            }
        } else {
            // the buffer shows WeeChat's input when it comes back
            drafts.delete(buffer.id);
        }
    }
}

/** Forget what belongs to closed buffers */
function cleanUp(state: SessionState): void {
    for (const map of [drafts, pushed]) {
        for (const id of map.keys()) {
            if (!state.buffers[id]) {
                map.delete(id);
            }
        }
    }
}

session.store.subscribe((state, previous) => {
    if (state.activeBufferId !== previous.activeBufferId) {
        onActiveBuffer(state, previous);
    }
    if (state.buffers !== previous.buffers) {
        if (syncing()) {
            onRemoteInput(state, previous);
        }
        // (buffers are kept while reconnecting)
        if (Object.keys(state.buffers).length > 0) {
            cleanUp(state);
        }
    }
    if (state.status === 'disconnected' && previous.status !== 'disconnected') {
        clearTimeout(pushTimer);
        pushed.clear();
    }
});

// Typing: set WeeChat's input after a pause
uiStore.subscribe((state, previous) => {
    if (state.input !== previous.input && !applying && syncing()) {
        clearTimeout(pushTimer);
        const bufferId = session.state.activeBufferId;
        pushTimer = setTimeout(
            () => flushInput(uiStore.getState().input, bufferId),
            PUSH_DELAY,
        );
    }
});

// Sharing turned on: WeeChat gets the text typed here, else it's shown here
settingsStore.subscribe((settings, previous) => {
    if (!settings.syncInput || previous.syncInput) {
        return;
    }
    const id = session.state.activeBufferId;
    const buffer = id !== null ? session.state.buffers[id] : undefined;
    const text = uiStore.getState().input;
    if (!buffer) {
        return;
    }
    if (text) {
        flushInput(text, buffer.id);
    } else if (buffer.input) {
        setInputBar(buffer.input);
    }
});
