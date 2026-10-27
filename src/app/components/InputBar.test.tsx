import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { applyBuffers, initialState } from '../../lib/state/reducers';
import { apiBuffer } from '../../lib/state/fixtures.test-helper';
import type { ApiCompletion } from '../../lib/relay/types';
import { session, setUi, uiStore, useActiveBuffer } from '../chat';
import { settingsStore } from '../settings';
import { InputBar } from './InputBar';

function ActiveInput() {
    const buffer = useActiveBuffer();
    return buffer && <InputBar key={buffer.id} buffer={buffer} />;
}

beforeEach(() => {
    settingsStore.setState({ syncInput: false });
    const state = applyBuffers(initialState, [
        apiBuffer(1, 1, 'irc.libera.#a', '#a'),
        apiBuffer(2, 2, 'irc.libera.#b', '#b'),
    ]);
    session.store.setState({ ...state, status: 'connected', activeBufferId: 1 });
    setUi({ input: '/he' });
});

afterEach(() => {
    cleanup();
    session.store.setState({ ...initialState });
    setUi({ input: '' });
    settingsStore.setState({ syncInput: true });
    vi.restoreAllMocks();
});

it('ignores a completion reply after switching to another buffer with the same text', async () => {
    const pending = Promise.withResolvers<ApiCompletion>();
    vi.spyOn(session, 'completion').mockReturnValue(pending.promise);
    const { getByRole } = render(<ActiveInput />);
    fireEvent.keyDown(getByRole('textbox'), { key: 'Tab' });
    act(() => {
        session.store.setState({ activeBufferId: 2 });
        setUi({ input: '/he' });
    });
    await act(async () => {
        pending.resolve({
            context: 'command',
            base_word: '/he',
            position_replace: 0,
            add_space: true,
            list: ['/help'],
        });
        await pending.promise;
    });
    expect(uiStore.getState().input).toBe('/he');
});

it('keeps completion working in the active buffer', async () => {
    vi.spyOn(session, 'completion').mockResolvedValue({
        context: 'command',
        base_word: '/he',
        position_replace: 0,
        add_space: true,
        list: ['/help'],
    });
    const { getByRole } = render(<ActiveInput />);
    const input = getByRole('textbox') as HTMLTextAreaElement;
    input.setSelectionRange(3, 3);
    await act(async () => fireEvent.keyDown(input, { key: 'Tab' }));
    expect(uiStore.getState().input).toBe('/help ');
});
