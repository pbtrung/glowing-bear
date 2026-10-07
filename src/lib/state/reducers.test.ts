import { describe, expect, it } from 'vitest';
import type { ApiBuffer, ApiEvent, ApiNickGroup } from '../relay/types';
import {
    applyBuffers,
    applyEvent,
    applyHotlist,
    applyLines,
    applyNicklist,
    HANDLED_EVENTS,
    initialState,
    markAllRead,
    setActiveBuffer,
    type ChatState,
} from './reducers';
import { apiBuffer, apiLine, apiNick } from './fixtures.test-helper';

const root: ApiNickGroup = {
    id: 0,
    parent_group_id: -1,
    name: 'root',
    color_name: '',
    color: '',
    visible: false,
    nicks: [],
    groups: [
        {
            id: 100,
            parent_group_id: 0,
            name: '000|o',
            color_name: 'weechat.color.nicklist_group',
            color: '',
            visible: true,
            groups: [],
            nicks: [apiNick(101, 100, 'alice')],
        },
    ],
};

const event = (name: string, bufferId: number, body: unknown = null): ApiEvent => ({
    code: 0,
    message: 'Event',
    event_name: name,
    buffer_id: bufferId,
    body_type: null,
    body: body as ApiEvent['body'],
});

const focused = { windowFocused: true };

function setup(): ChatState {
    let state = applyBuffers(initialState, [
        apiBuffer(1, 1, 'core.weechat', 'weechat', {
            nicklist: false,
            local_variables: { plugin: 'core', name: 'weechat' },
        }),
        apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
        apiBuffer(3, 3, 'irc.libera.#test', '#test', { notify: 'all' }),
    ]);
    state = setActiveBuffer(state, 1);
    return state;
}

function send(
    state: ChatState,
    name: string,
    bufferId: number,
    body: unknown = null,
    ctx = focused,
) {
    return applyEvent(state, event(name, bufferId, body), ctx);
}

describe('buffers', () => {
    it('loads buffers from the relay', () => {
        const state = setup();
        const buffer = state.buffers[2];
        expect(buffer.fullName).toBe('irc.libera.#weechat');
        expect(buffer.shortName).toBe('#weechat');
        expect(buffer.trimmedName).toBe('weechat');
        expect(buffer.channelPrefix).toBe('#');
        expect(buffer.titleText).toBe('Title of irc.libera.#weechat');
        expect(buffer.serverSortKey).toBe('irc.libera.#weechat');
        expect(state.buffers[3].notify).toBe(3);
        expect(state.activeBufferId).toBe(1);
    });

    it('removes buffers missing from a new list', () => {
        const state = applyBuffers(setup(), [
            apiBuffer(2, 1, 'irc.libera.#weechat', '#weechat'),
        ]);
        expect(Object.keys(state.buffers)).toEqual(['2']);
        expect(state.activeBufferId).toBeNull();
    });

    it('maps buffer properties', () => {
        const state = applyBuffers(initialState, [
            apiBuffer(5, 5, 'fset.fset', '', {
                type: 'free',
                notify: 'highlight',
                time_displayed: false,
                prefix_displayed: false,
                day_change: false,
                hidden: true,
                modes: '+nt',
                input_prompt: '\x19F05@nick',
                local_variables: { plugin: 'fset', type: 'option', pinned: 'true' },
            }),
        ]);
        const b = state.buffers[5];
        expect(b.free).toBe(true);
        expect(b.notify).toBe(1);
        expect(b.hideTime).toBe(true);
        expect(b.hidePrefix).toBe(true);
        expect(b.dayChange).toBe(false);
        expect(b.hidden).toBe(true);
        expect(b.pinned).toBe(true);
        expect(b.modes).toBe('+nt');
        expect(b.inputPrompt[0]).toEqual({
            text: '@nick',
            classes: ['cwf-green', 'cwb-default'],
        });
    });

    it('switches buffers and remembers what was read', () => {
        let state = applyLines(setup(), 1, [apiLine(1, 'one'), apiLine(2, 'two')], 100);
        state = setActiveBuffer(state, 2);
        expect(state.buffers[1].lastReadKey).toBe('l2');
        expect(state.previousBufferId).toBe(1);
        expect(state.activeBufferId).toBe(2);
    });
});

describe('lines', () => {
    it('loads lines, oldest first', () => {
        const state = applyLines(
            setup(),
            2,
            [apiLine(1, 'one'), apiLine(2, 'two')],
            100,
        );
        const b = state.buffers[2];
        expect(b.lines.filter((l) => !l.isDateChange).map((l) => l.text)).toEqual([
            'one',
            'two',
        ]);
        expect(b.requestedLines).toBe(2);
        expect(b.allLinesFetched).toBe(true);
    });

    it('knows when there may be more lines', () => {
        const lines = [apiLine(1, 'one'), apiLine(2, 'two')];
        expect(applyLines(setup(), 2, lines, 2).buffers[2].allLinesFetched).toBe(false);
    });

    it('places the read marker with the last read line of WeeChat', () => {
        let state = applyBuffers(setup(), [
            apiBuffer(1, 1, 'core.weechat', 'weechat'),
            apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat', {
                last_read_line_id: 1,
            }),
        ]);
        state = applyLines(state, 2, [apiLine(1, 'one'), apiLine(2, 'two')], 100);
        expect(state.buffers[2].lastReadKey).toBe('l1');
    });

    it('guesses the read marker from the unread count', () => {
        const lines = [apiLine(1, 'a'), apiLine(2, 'b'), apiLine(3, 'c')];
        expect(applyLines(setup(), 2, lines, 100, 2).buffers[2].lastReadKey).toBe('l1');
    });

    it('skips lines that are not displayed', () => {
        const state = applyLines(
            setup(),
            2,
            [apiLine(1, 'hidden', { displayed: false })],
            100,
        );
        expect(state.buffers[2].lines.filter((l) => !l.isDateChange)).toEqual([]);
    });

    it('adds date change lines', () => {
        const state = applyLines(
            setup(),
            2,
            [
                apiLine(1, 'one', { date: '2024-01-07T12:00:00Z' }),
                apiLine(2, 'two', { date: '2024-01-09T12:00:00Z' }),
            ],
            100,
        );
        const lines = state.buffers[2].lines;
        expect(lines[1].isDateChange).toBe(true);
        expect(lines[1].text).toContain('2 days later');
        expect(lines[2].text).toBe('two');
    });

    it('marks highlights in the prefix', () => {
        const state = applyLines(
            setup(),
            2,
            [apiLine(1, 'hi', { highlight: true })],
            100,
        );
        expect(state.buffers[2].lines[0].prefix[0].classes).toContain('highlight');
    });
});

describe('events', () => {
    it('handles every event of the protocol', () => {
        expect(HANDLED_EVENTS.sort()).toEqual(
            [
                'buffer_opened',
                'buffer_type_changed',
                'buffer_moved',
                'buffer_merged',
                'buffer_unmerged',
                'buffer_hidden',
                'buffer_unhidden',
                'buffer_renamed',
                'buffer_title_changed',
                'buffer_modes_changed',
                'buffer_notify_changed',
                'buffer_time_for_each_line_changed',
                'buffer_prefix_for_each_line_changed',
                'buffer_day_change_changed',
                'buffer_localvar_added',
                'buffer_localvar_changed',
                'buffer_localvar_removed',
                'buffer_cleared',
                'buffer_closing',
                'buffer_closed',
                'buffer_line_added',
                'buffer_line_data_changed',
                'input_prompt_changed',
                'input_text_changed',
                'input_text_cursor_moved',
                'nicklist_group_added',
                'nicklist_group_changed',
                'nicklist_group_removing',
                'nicklist_nick_added',
                'nicklist_nick_changed',
                'nicklist_nick_removing',
                'upgrade',
                'upgrade_ended',
                'quit',
                'day_changed',
            ].sort(),
        );
    });

    it('ignores unknown events', () => {
        const state = setup();
        expect(send(state, 'something_new', 2)).toEqual({ state, effects: [] });
    });

    it('counts unread lines and highlights in other buffers', () => {
        let { state } = send(setup(), 'buffer_line_added', 3, apiLine(10, 'hello'));
        const r = send(
            state,
            'buffer_line_added',
            3,
            apiLine(11, 'hi alice', { highlight: true }),
        );
        state = r.state;
        expect(r.effects).toEqual([
            {
                type: 'highlight',
                bufferId: 3,
                line: expect.objectContaining({ text: 'hi alice' }),
            },
        ]);
        state = send(
            state,
            'buffer_line_added',
            3,
            apiLine(12, 'join', { notify_level: 0 }),
        ).state;
        state = send(
            state,
            'buffer_line_added',
            3,
            apiLine(13, 'pm', { notify_level: 2 }),
        ).state;
        const buffer = state.buffers[3];
        expect(buffer.lines.map((l) => l.text)).toEqual([
            'hello',
            'hi alice',
            'join',
            'pm',
        ]);
        expect(buffer.unread).toBe(1);
        expect(buffer.notification).toBe(2);
    });

    it('follows the notify level of the buffer', () => {
        let state = applyBuffers(setup(), [
            apiBuffer(1, 1, 'core.weechat', 'weechat'),
            apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat', { notify: 'highlight' }),
            apiBuffer(3, 3, 'irc.libera.#test', '#test', { notify: 'none' }),
        ]);
        state = send(state, 'buffer_line_added', 2, apiLine(1, 'msg')).state;
        state = send(
            state,
            'buffer_line_added',
            3,
            apiLine(2, 'hi', { highlight: true }),
        ).state;
        expect(state.buffers[2].unread).toBe(0);
        expect(state.buffers[3].notification).toBe(0);
    });

    it('counts lines of the active buffer only when the window is not focused', () => {
        let state = setActiveBuffer(setup(), 3);
        let r = send(state, 'buffer_line_added', 3, apiLine(1, 'seen'));
        expect(r.effects).toEqual([{ type: 'activeBufferLine', bufferId: 3 }]);
        state = r.state;
        r = send(state, 'buffer_line_added', 3, apiLine(2, 'missed'), {
            windowFocused: false,
        });
        expect(r.state.buffers[3].unread).toBe(1);
    });

    it('replaces changed lines', () => {
        let { state } = send(setup(), 'buffer_line_added', 2, apiLine(5, 'typo'));
        state = send(state, 'buffer_line_data_changed', 2, apiLine(5, 'fixed')).state;
        expect(state.buffers[2].lines.map((l) => l.text)).toEqual(['fixed']);
    });

    it('stores free buffer lines by index', () => {
        let { state } = send(
            setup(),
            'buffer_opened',
            5,
            apiBuffer(5, 5, 'fset.fset', '', { type: 'free' }),
        );
        state = send(
            state,
            'buffer_line_added',
            5,
            apiLine(0, 'second', { y: 1 }),
        ).state;
        state = send(
            state,
            'buffer_line_added',
            5,
            apiLine(1, 'first', { y: 0 }),
        ).state;
        state = send(
            state,
            'buffer_line_data_changed',
            5,
            apiLine(0, 'changed', { y: 1 }),
        ).state;
        expect(state.buffers[5].lines.map((l) => l.text)).toEqual(['first', 'changed']);
        expect(state.buffers[5].unread).toBe(0);
    });

    it('opens buffers with their lines and nicks', () => {
        const body = apiBuffer(4, 4, 'irc.libera.#new', '#new', {
            lines: [apiLine(1, 'topic set')],
            nicklist_root: root,
        });
        const { state } = send(setup(), 'buffer_opened', 4, body);
        expect(state.buffers[4].lines.map((l) => l.text)).toEqual(['topic set']);
        expect(state.buffers[4].nicklistLoaded).toBe(true);
        expect(Object.values(state.buffers[4].nicks).map((n) => n.name)).toEqual([
            'alice',
        ]);
    });

    it('switches to queries we opened', () => {
        const state = { ...setup(), outgoingQueries: ['bob'] };
        let r = send(state, 'buffer_opened', 4, apiBuffer(4, 4, 'irc.libera.bob', ''));
        expect(r.effects).toEqual([]);
        r = send(
            r.state,
            'buffer_renamed',
            4,
            apiBuffer(4, 4, 'irc.libera.bob', 'bob'),
        );
        expect(r.effects).toEqual([{ type: 'activate', bufferId: 4 }]);
        expect(r.state.outgoingQueries).toEqual([]);
    });

    it('renumbers buffers like WeeChat (one event per buffer whose number changed)', () => {
        let { state } = send(
            setup(),
            'buffer_opened',
            4,
            apiBuffer(4, 4, 'irc.libera.bob', 'bob'),
        );
        // /buffer move 2: the moved buffer first
        state = send(
            state,
            'buffer_moved',
            4,
            apiBuffer(4, 2, 'irc.libera.bob', 'bob'),
        ).state;
        state = send(
            state,
            'buffer_moved',
            2,
            apiBuffer(2, 3, 'irc.libera.#weechat', '#weechat'),
        ).state;
        state = send(
            state,
            'buffer_moved',
            3,
            apiBuffer(3, 4, 'irc.libera.#test', '#test'),
        ).state;
        expect([1, 2, 3, 4].map((id) => state.buffers[id].number)).toEqual([
            1, 3, 4, 2,
        ]);
        // /buffer move +: the moved buffer last
        state = send(
            state,
            'buffer_moved',
            2,
            apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
        ).state;
        state = send(
            state,
            'buffer_moved',
            3,
            apiBuffer(3, 3, 'irc.libera.#test', '#test'),
        ).state;
        state = send(
            state,
            'buffer_moved',
            4,
            apiBuffer(4, 4, 'irc.libera.bob', 'bob'),
        ).state;
        expect([1, 2, 3, 4].map((id) => state.buffers[id].number)).toEqual([
            1, 2, 3, 4,
        ]);
    });

    it('updates buffers from property events', () => {
        const events: Array<
            [string, Partial<ApiBuffer>, (s: ChatState) => unknown, unknown]
        > = [
            [
                'buffer_title_changed',
                { title: 'New topic' },
                (s) => s.buffers[2].titleText,
                'New topic',
            ],
            [
                'buffer_renamed',
                { short_name: '#renamed' },
                (s) => s.buffers[2].shortName,
                '#renamed',
            ],
            ['buffer_hidden', { hidden: true }, (s) => s.buffers[2].hidden, true],
            ['buffer_unhidden', { hidden: false }, (s) => s.buffers[2].hidden, false],
            ['buffer_modes_changed', { modes: '+s' }, (s) => s.buffers[2].modes, '+s'],
            [
                'buffer_notify_changed',
                { notify: 'none' },
                (s) => s.buffers[2].notify,
                0,
            ],
            ['buffer_type_changed', { type: 'free' }, (s) => s.buffers[2].free, true],
            [
                'buffer_time_for_each_line_changed',
                { time_displayed: false },
                (s) => s.buffers[2].hideTime,
                true,
            ],
            [
                'buffer_prefix_for_each_line_changed',
                { prefix_displayed: false },
                (s) => s.buffers[2].hidePrefix,
                true,
            ],
            [
                'buffer_day_change_changed',
                { day_change: false },
                (s) => s.buffers[2].dayChange,
                false,
            ],
            [
                'buffer_localvar_added',
                {
                    local_variables: {
                        plugin: 'irc',
                        type: 'channel',
                        server: 'libera',
                        pinned: 'true',
                    },
                },
                (s) => s.buffers[2].pinned,
                true,
            ],
            [
                'buffer_localvar_changed',
                { local_variables: { type: 'private' } },
                (s) => s.buffers[2].type,
                'private',
            ],
            [
                'buffer_localvar_removed',
                { local_variables: {} },
                (s) => s.buffers[2].type,
                'other',
            ],
            ['buffer_merged', { number: 1 }, (s) => s.buffers[2].number, 1],
            ['buffer_unmerged', { number: 2 }, (s) => s.buffers[2].number, 2],
            [
                'buffer_closing',
                { title: 'closing' },
                (s) => s.buffers[2].titleText,
                'closing',
            ],
            [
                'input_prompt_changed',
                { input_prompt: '@me' },
                (s) => s.buffers[2].inputPrompt[0].text,
                '@me',
            ],
            [
                'input_text_changed',
                { input: 'draft' },
                (s) => s.buffers[2].input,
                'draft',
            ],
            [
                'input_text_cursor_moved',
                { input_position: 3 },
                (s) => s.buffers[2].inputPosition,
                3,
            ],
        ];
        for (const [name, props, get, expected] of events) {
            const { state } = send(
                setup(),
                name,
                2,
                apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat', props),
            );
            expect([name, get(state)]).toEqual([name, expected]);
        }
    });

    it('clears buffers', () => {
        let { state } = send(setup(), 'buffer_line_added', 2, apiLine(1, 'x'));
        state = send(
            state,
            'buffer_cleared',
            2,
            apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
        ).state;
        expect(state.buffers[2].lines).toEqual([]);
    });

    it('closes buffers and switches away from the active one', () => {
        let state = setActiveBuffer(setup(), 2);
        state = send(state, 'buffer_closed', 2).state;
        expect(state.buffers[2]).toBeUndefined();
        expect(state.activeBufferId).toBe(1);
    });

    it('maintains the nicklist', () => {
        let state = applyNicklist(setup(), 2, root);
        const nicks = (s: ChatState) =>
            Object.values(s.buffers[2].nicks)
                .map((n) => n.name)
                .sort();
        expect(nicks(state)).toEqual(['alice']);
        expect(state.buffers[2].nicks[101].prefixClasses).toEqual(['cwf-lightgreen']);
        expect(state.buffers[2].nickGroups[100].name).toBe('000|o');

        state = send(state, 'nicklist_nick_added', 2, apiNick(102, 100, 'bob')).state;
        expect(nicks(state)).toEqual(['alice', 'bob']);
        state = send(state, 'nicklist_nick_changed', 2, {
            ...apiNick(102, 100, 'bob'),
            prefix: '+',
        }).state;
        expect(state.buffers[2].nicks[102].prefix).toBe('+');
        state = send(
            state,
            'nicklist_nick_removing',
            2,
            apiNick(102, 100, 'bob'),
        ).state;
        expect(nicks(state)).toEqual(['alice']);

        const group: ApiNickGroup = {
            ...root.groups[0],
            id: 200,
            name: '001|v',
            nicks: [],
            groups: [],
        };
        state = send(state, 'nicklist_group_added', 2, group).state;
        state = send(state, 'nicklist_nick_added', 2, apiNick(201, 200, 'carol')).state;
        state = send(state, 'nicklist_group_changed', 2, {
            ...group,
            visible: false,
        }).state;
        expect(state.buffers[2].nickGroups[200].visible).toBe(false);
        state = send(state, 'nicklist_group_removing', 2, group).state;
        expect(state.buffers[2].nickGroups[200]).toBeUndefined();
        expect(nicks(state)).toEqual(['alice']);
    });

    it('ignores nick events of buffers whose nicklist is not loaded', () => {
        const { state } = send(setup(), 'nicklist_nick_added', 3, apiNick(1, 0, 'bob'));
        expect(state.buffers[3].nicks).toEqual({});
    });

    it('handles upgrades and quit', () => {
        let r = send(setup(), 'upgrade', -1);
        expect(r.state.upgrading).toBe(true);
        expect(r.effects).toEqual([{ type: 'upgrade' }]);
        r = send(r.state, 'upgrade_ended', -1);
        expect(r.state.upgrading).toBe(false);
        expect(r.effects).toEqual([]);
        expect(send(setup(), 'quit', -1).state.quitting).toBe(true);
        const state = setup();
        expect(send(state, 'day_changed', -1).state).toBe(state);
    });
});

describe('hotlist', () => {
    it('applies the hotlist, except to the active buffer', () => {
        let state = setActiveBuffer(setup(), 2);
        state = applyHotlist(state, [
            {
                priority: 3,
                date: '2024-03-17T16:38:51Z',
                buffer_id: 3,
                count: [2, 5, 1, 2],
            },
            {
                priority: 1,
                date: '2024-03-17T16:38:51Z',
                buffer_id: 2,
                count: [0, 9, 0, 0],
            },
        ]);
        expect(state.buffers[3].unread).toBe(5);
        expect(state.buffers[3].notification).toBe(3);
        expect(state.buffers[2].unread).toBe(0);
    });

    it('marks everything read', () => {
        let state = applyHotlist(setup(), [
            {
                priority: 3,
                date: '2024-03-17T16:38:51Z',
                buffer_id: 3,
                count: [2, 5, 1, 2],
            },
        ]);
        state = markAllRead(state);
        expect(state.buffers[3].unread + state.buffers[3].notification).toBe(0);
    });
});
