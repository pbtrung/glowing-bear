import { describe, expect, it } from 'vitest';
import { applyBuffers, applyNicklist, initialState } from '../lib/state/reducers';
import { parseRichText, plainText } from '../lib/relay/colors';
import type { ApiBuffer, ApiNick, ApiNickGroup } from '../lib/relay/types';
import {
    groupTitle,
    initial,
    nameHue,
    nickSections,
    promptNick,
    showGroupTitles,
} from './nicks';

const nick = (id: number, groupId: number, name: string, visible = true): ApiNick => ({
    id,
    parent_group_id: groupId,
    prefix: '',
    prefix_color_name: '',
    prefix_color: '',
    name,
    color_name: '',
    color: '',
    visible,
});

const group = (id: number, name: string, nicks: ApiNick[]): ApiNickGroup => ({
    id,
    parent_group_id: 0,
    name,
    color_name: '',
    color: '',
    visible: true,
    groups: [],
    nicks,
});

function buffer() {
    const state = applyBuffers(initialState, [
        {
            id: 1,
            name: 'irc.libera.#test',
            short_name: '#test',
            number: 1,
            type: 'formatted',
            local_variables: { type: 'channel' },
        } as unknown as ApiBuffer,
    ]);
    return applyNicklist(state, 1, {
        ...group(0, 'root', [nick(9, 0, 'rootnick')]),
        parent_group_id: -1,
        groups: [
            group(10, '999|...', [
                nick(11, 10, 'zoe'),
                nick(12, 10, 'Bob'),
                nick(13, 10, 'alice'),
            ]),
            group(20, '000|o', [nick(21, 20, 'Carol'), nick(22, 20, 'ghost', false)]),
        ],
    }).buffers[1];
}

describe('nicklist display', () => {
    it('names IRC mode groups', () => {
        expect(groupTitle('000|o')).toBe('Operators');
        expect(groupTitle('001|h')).toBe('Half-operators');
        expect(groupTitle('002|v')).toBe('Voiced');
        expect(groupTitle('999|...')).toBe('Users');
        expect(groupTitle('010|friends')).toBe('friends');
    });

    it('lists visible nicks by group, sorted by name', () => {
        const sections = nickSections(buffer());
        expect(sections.map((s) => [s.title, s.nicks.map((n) => n.name)])).toEqual([
            ['Operators', ['Carol']],
            ['Users', ['alice', 'Bob', 'zoe']],
            ['Users', ['rootnick']],
        ]);
    });

    it('titles IRC mode groups, and the groups of buffers displaying them', () => {
        const irc = buffer();
        const visible = Object.values(irc.nicks).filter((n) => n.visible);
        expect(showGroupTitles(irc, visible)).toBe(true);
        const other = {
            ...irc,
            nickGroups: {
                ...irc.nickGroups,
                10: { ...irc.nickGroups[10], name: 'friends' },
            },
        };
        expect(showGroupTitles(other, visible)).toBe(false);
        expect(
            showGroupTitles({ ...other, nicklistDisplayGroups: true }, visible),
        ).toBe(true);
        // Not with one group
        expect(
            showGroupTitles(
                { ...other, nicklistDisplayGroups: true },
                visible.filter((n) => n.groupId === 10),
            ),
        ).toBe(false);
    });

    it('filters nicks', () => {
        const sections = nickSections(buffer(), ' O');
        expect(sections.flatMap((s) => s.nicks.map((n) => n.name))).toEqual([
            'Carol',
            'Bob',
            'zoe',
            'rootnick',
        ]);
        expect(nickSections(buffer(), 'nobody')).toEqual([]);
    });

    it('gives names an initial and a stable color', () => {
        expect(initial('alice')).toBe('A');
        expect(initial('_[xavier]')).toBe('X');
        expect(initial('élodie')).toBe('É');
        expect(initial('')).toBe('?');
        expect(initial('___')).toBe('_');
        expect(nameHue('alice')).toBe(nameHue('ALICE'));
        expect(nameHue('alice')).toBeGreaterThanOrEqual(0);
        expect(nameHue('alice')).toBeLessThan(360);
        expect(nameHue('alice')).not.toBe(nameHue('bob'));
    });

    it('keeps only the nick of the input prompt', () => {
        const part = (text: string, classes: string[] = []) => ({ text, classes });
        const texts = (parts: { text: string }[]) => parts.map((p) => p.text);
        // The prefix in its own color, then the nick and the modes
        expect(
            texts(
                promptNick([
                    part(''),
                    part('@', ['cwf-lightgreen']),
                    part('gbuser', ['cwf-cyan']),
                    part('('),
                    part('+i'),
                    part(')'),
                ]),
            ),
        ).toEqual(['gbuser']);
        expect(promptNick([part('+v(+Zi)', ['cwf-yellow'])])).toEqual([
            part('v', ['cwf-yellow']),
        ]);
        expect(texts(promptNick([part('~&gbuser')]))).toEqual(['gbuser']);
        // As WeeChat sends it for an IRC channel, colors and bar codes included
        expect(
            plainText(
                promptNick(
                    parseRichText('\x19F05@\x1c\x19F03ukx8\x19bD(\x19bF+i\x19bD)'),
                ),
            ),
        ).toBe('ukx8');
        expect(texts(promptNick([part('gbuser (+i)')]))).toEqual(['gbuser']);
        // Nick characters that look like symbols stay
        expect(texts(promptNick([part('[yasmin]')]))).toEqual(['[yasmin]']);
        expect(texts(promptNick([part('_xavier')]))).toEqual(['_xavier']);
        expect(promptNick([])).toEqual([]);
    });
});

describe('nested nick groups', () => {
    it('lists subgroups after their group, with their depth and visibility', () => {
        const state = applyBuffers(initialState, [
            {
                id: 1,
                name: 'matrix.room',
                short_name: 'room',
                number: 1,
                type: 'formatted',
                nicklist_display_groups: true,
                local_variables: { type: 'channel' },
            } as unknown as ApiBuffer,
        ]);
        const sub = {
            ...group(11, 'admins', [nick(12, 11, 'ann')]),
            parent_group_id: 10,
        };
        const buffer = applyNicklist(state, 1, {
            ...group(0, 'root', []),
            parent_group_id: -1,
            groups: [
                { ...group(10, 'staff', [nick(13, 10, 'bob')]), groups: [sub] },
                { ...group(20, 'guests', [nick(21, 20, 'carl')]), visible: false },
            ],
        }).buffers[1];
        expect(
            nickSections(buffer).map((s) => [
                s.title,
                s.depth,
                s.visible,
                s.nicks[0].name,
            ]),
        ).toEqual([
            ['guests', 0, false, 'carl'],
            ['staff', 0, true, 'bob'],
            ['admins', 1, true, 'ann'],
        ]);
    });
});
