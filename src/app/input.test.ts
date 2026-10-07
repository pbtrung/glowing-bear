import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyBuffers, initialState } from '../lib/state/reducers';
import { apiBuffer } from '../lib/state/fixtures.test-helper';
import type { SessionState } from '../lib/state/session';
import { session, setUi, uiStore } from './chat';
import { flushInput } from './input';
import { updateSettings } from './settings';

let pushes: Array<[number, string]>;

/** WeeChat's input of buffers, as received in events */
function remote(id: number, input: string): void {
    const s = session.state;
    session.store.setState({
        buffers: { ...s.buffers, [id]: { ...s.buffers[id], input } },
    });
}

function connectedWith(inputs: Record<number, string> = {}): void {
    const state = applyBuffers(initialState, [
        apiBuffer(1, 1, 'irc.libera.#a', '#a', { input: inputs[1] ?? '' }),
        apiBuffer(2, 2, 'irc.libera.#b', '#b', { input: inputs[2] ?? '' }),
    ]);
    session.store.setState({
        ...state,
        status: 'connected',
        activeBufferId: null,
    } as Partial<SessionState>);
    session.store.setState({ activeBufferId: 1 });
}

beforeEach(() => {
    vi.useFakeTimers();
    updateSettings({ syncInput: true });
    pushes = [];
    vi.spyOn(session, 'setRemoteInput').mockImplementation((id, text) => {
        pushes.push([id, text]);
    });
});

afterEach(() => {
    session.store.setState({
        status: 'disconnected',
        activeBufferId: null,
        buffers: {},
    });
    setUi({ input: '' });
    vi.restoreAllMocks();
    vi.useRealTimers();
});

describe('input shared with WeeChat', () => {
    it('shows WeeChat input of a buffer, pushes what is typed after a pause', () => {
        connectedWith({ 1: 'from weechat' });
        expect(uiStore.getState().input).toBe('from weechat');
        setUi({ input: 'typed ' });
        expect(pushes).toEqual([]);
        vi.advanceTimersByTime(400);
        expect(pushes).toEqual([[1, 'typed ']]);
        // The echoes (empty input in between, then the text) change nothing
        remote(1, '');
        remote(1, 'typed ');
        expect(uiStore.getState().input).toBe('typed ');
        expect(pushes).toHaveLength(1);
    });

    it('applies changes made elsewhere, cancelling a push not sent yet', () => {
        connectedWith();
        setUi({ input: 'mine' });
        remote(1, 'theirs');
        expect(uiStore.getState().input).toBe('theirs');
        vi.advanceTimersByTime(1000);
        expect(pushes).toEqual([]);
    });

    it('keeps drafts, and restores them without pushing them again', () => {
        connectedWith();
        setUi({ input: 'draft of 1' });
        session.store.setState({ activeBufferId: 2 });
        // what was typed last was pushed when leaving
        expect(pushes).toEqual([[1, 'draft of 1']]);
        remote(1, 'draft of 1');
        session.store.setState({ activeBufferId: 1 });
        expect(uiStore.getState().input).toBe('draft of 1');
        vi.advanceTimersByTime(1000);
        expect(pushes).toHaveLength(1);
    });

    it('lets WeeChat input win after a reconnection', () => {
        connectedWith();
        setUi({ input: 'local' });
        vi.advanceTimersByTime(400);
        remote(1, 'local');
        session.store.setState({ status: 'reconnecting' });
        // changed in WeeChat meanwhile, then reloaded
        const reloaded = applyBuffers(initialState, [
            apiBuffer(1, 1, 'irc.libera.#a', '#a', { input: 'typed in weechat' }),
            apiBuffer(2, 2, 'irc.libera.#b', '#b'),
        ]);
        session.store.setState({
            ...reloaded,
            status: 'connected',
            activeBufferId: null,
        });
        session.store.setState({ activeBufferId: 1 });
        expect(uiStore.getState().input).toBe('typed in weechat');
        expect(pushes).toEqual([[1, 'local']]);
    });

    it('turned on, adopts WeeChat input or pushes the text typed', () => {
        updateSettings({ syncInput: false });
        connectedWith({ 2: 'foo' });
        setUi({ input: 'typed in 1' });
        session.store.setState({ activeBufferId: 2 });
        expect(uiStore.getState().input).toBe('');
        updateSettings({ syncInput: true });
        expect(uiStore.getState().input).toBe('foo');
        expect(pushes).toEqual([]);
        // back to 1: its draft (typed while not sharing) goes to WeeChat
        session.store.setState({ activeBufferId: 1 });
        expect(uiStore.getState().input).toBe('typed in 1');
        expect(pushes).toEqual([[1, 'typed in 1']]);
    });

    it('sends nothing when not sharing or not connected', () => {
        updateSettings({ syncInput: false });
        connectedWith();
        setUi({ input: 'x' });
        vi.advanceTimersByTime(1000);
        flushInput('y');
        session.store.setState({ status: 'reconnecting' });
        updateSettings({ syncInput: true });
        flushInput('z');
        expect(pushes).toEqual([]);
    });
});
