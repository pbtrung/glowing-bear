import { describe, expect, it } from 'vitest';
import { applyBuffers, initialState } from '../lib/state/reducers';
import type { ApiBuffer } from '../lib/relay/types';
import { listBuffers, session, setUi, uiStore } from './chat';

const apiBuffer = (
    id: number,
    number: number,
    name: string,
    type: string,
    extra: Partial<ApiBuffer> = {},
): ApiBuffer =>
    ({
        id,
        name,
        short_name: name.split('.').pop(),
        number,
        type: 'formatted',
        hidden: false,
        title: '',
        modes: '',
        input_prompt: '',
        input: '',
        input_position: 0,
        input_multiline: false,
        nicklist: false,
        nicklist_case_sensitive: false,
        nicklist_display_groups: false,
        time_displayed: true,
        local_variables: { plugin: 'irc', server: 'libera', type },
        keys: [],
        ...extra,
    }) as ApiBuffer;

const buffers = applyBuffers(initialState, [
    apiBuffer(1, 1, 'core.weechat', 'other', { local_variables: { plugin: 'core' } }),
    apiBuffer(2, 2, 'irc.server.libera', 'server'),
    apiBuffer(3, 4, 'irc.libera.#weechat', 'channel'),
    apiBuffer(4, 3, 'irc.libera.alice', 'private'),
    apiBuffer(5, 5, 'irc.libera.#hidden', 'channel', { hidden: true }),
]).buffers;

const names = (list: ReturnType<typeof listBuffers>) =>
    list.map((l) => l.buffer.fullName);
const ui = { search: '', jumpMode: false, jumpDigit: null };

describe('buffer list', () => {
    it('sorts by number or by server, without hidden buffers', () => {
        expect(
            names(
                listBuffers(
                    buffers,
                    1,
                    { orderbyserver: false, onlyUnread: false, collapsedServers: [] },
                    ui,
                ),
            ),
        ).toEqual([
            'core.weechat',
            'irc.server.libera',
            'irc.libera.alice',
            'irc.libera.#weechat',
        ]);
        expect(
            names(
                listBuffers(
                    buffers,
                    1,
                    { orderbyserver: true, onlyUnread: false, collapsedServers: [] },
                    ui,
                ),
            ),
        ).toEqual([
            'core.weechat',
            'irc.server.libera',
            'irc.libera.#weechat',
            'irc.libera.alice',
        ]);
    });

    it('filters with the search, including hidden buffers', () => {
        const list = listBuffers(
            buffers,
            1,
            { orderbyserver: true, onlyUnread: false, collapsedServers: [] },
            { ...ui, search: 'WEE' },
        );
        expect(names(list)).toEqual(['core.weechat', 'irc.libera.#weechat']);
        // Quick keys follow the filtered list
        expect(list.map((l) => l.quickKey)).toEqual(['1', '2']);
    });

    it('shows only buffers with unread messages, the active and core buffers', () => {
        const withUnread = {
            ...buffers,
            3: { ...buffers[3], unread: 2 },
            5: { ...buffers[5], notification: 1 },
        };
        expect(
            names(
                listBuffers(
                    withUnread,
                    4,
                    { orderbyserver: true, onlyUnread: true, collapsedServers: [] },
                    ui,
                ),
            ),
        ).toEqual([
            'core.weechat',
            'irc.server.libera',
            'irc.libera.#hidden',
            'irc.libera.#weechat',
            'irc.libera.alice',
        ]);
    });

    it('keeps pinned buffers with only unread', () => {
        const pinned = { ...buffers, 3: { ...buffers[3], pinned: true } };
        expect(
            names(
                listBuffers(
                    pinned,
                    1,
                    { orderbyserver: false, onlyUnread: true, collapsedServers: [] },
                    ui,
                ),
            ),
        ).toContain('irc.libera.#weechat');
    });

    it('collapses the buffers of a server, keeping the active one', () => {
        const withUnread = {
            ...buffers,
            3: { ...buffers[3], unread: 2 },
            4: { ...buffers[4], notification: 1 },
        };
        const list = listBuffers(
            withUnread,
            1,
            {
                orderbyserver: true,
                onlyUnread: false,
                collapsedServers: ['irc.libera'],
            },
            ui,
        );
        expect(names(list)).toEqual(['core.weechat', 'irc.server.libera']);
        expect(list[1]).toMatchObject({
            group: true,
            collapsed: true,
            hiddenUnread: 2,
            hiddenNotification: 1,
        });
        const active = listBuffers(
            withUnread,
            3,
            {
                orderbyserver: true,
                onlyUnread: false,
                collapsedServers: ['irc.libera'],
            },
            ui,
        );
        expect(names(active)).toEqual([
            'core.weechat',
            'irc.server.libera',
            'irc.libera.#weechat',
        ]);
        // Searching shows everything
        const search = listBuffers(
            withUnread,
            1,
            {
                orderbyserver: true,
                onlyUnread: false,
                collapsedServers: ['irc.libera'],
            },
            { ...ui, search: 'libera' },
        );
        expect(search.length).toBe(4);
        expect(search.every((l) => !l.group)).toBe(true);
    });

    it('assigns quick keys by buffer number and jump keys', () => {
        const list = listBuffers(
            buffers,
            1,
            { orderbyserver: true, onlyUnread: false, collapsedServers: [] },
            ui,
        );
        expect(list.map((l) => [l.buffer.number, l.quickKey, l.jumpKey])).toEqual([
            [1, '1', 1],
            [2, '2', 2],
            [4, '4', 4],
            [3, '3', 3],
        ]);
        const jump = listBuffers(
            buffers,
            1,
            { orderbyserver: true, onlyUnread: false, collapsedServers: [] },
            { ...ui, jumpMode: true, jumpDigit: 0 },
        );
        expect(jump.map((l) => l.jumpKey).sort()).toEqual([1, 2, 3, 4, 5]);
    });
});

describe('input drafts', () => {
    it('keeps the text typed in each buffer', () => {
        const state = applyBuffers(initialState, [
            apiBuffer(1, 1, 'core.weechat', 'other'),
            apiBuffer(2, 2, 'irc.libera.#a', 'channel'),
        ]);
        session.store.setState({ ...state, activeBufferId: 1 });
        setUi({ input: 'draft of 1' });
        session.store.setState({ activeBufferId: 2 });
        expect(uiStore.getState().input).toBe('');
        setUi({ input: 'draft of 2' });
        session.store.setState({ activeBufferId: 1 });
        expect(uiStore.getState().input).toBe('draft of 1');
        // Reconnecting goes through no buffer
        session.store.setState({ activeBufferId: null });
        session.store.setState({ activeBufferId: 2 });
        expect(uiStore.getState().input).toBe('draft of 2');
        // Drafts of closed buffers are dropped at the next switch
        setUi({ input: '' });
        session.store.setState({ activeBufferId: 1 });
        setUi({ input: 'draft of 1' });
        session.store.setState({ activeBufferId: 2 });
        session.store.setState({
            buffers: { 2: state.buffers[2] },
            activeBufferId: null,
        });
        // (same id again only to check that the draft is gone)
        session.store.setState({ buffers: state.buffers, activeBufferId: 1 });
        expect(uiStore.getState().input).toBe('');
    });
});
