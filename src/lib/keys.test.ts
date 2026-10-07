import { describe, expect, it } from 'vitest';
import {
    bindingCommands,
    comboOf,
    matchKey,
    parseKeyName,
    type KeyInput,
} from './keys';

const key = (k: string, mods: Partial<KeyInput> = {}): KeyInput => ({
    key: k,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    ...mods,
});

// Keys of /fset (WeeChat 4.10)
const FSET = [
    { key: 'ctrl-l', command: '/fset -refresh' },
    { key: 'down', command: '/fset -down' },
    { key: 'f11', command: '/fset -left' },
    { key: 'meta-+', command: '/fset -add 1' },
    { key: 'meta--', command: '/fset -add -1' },
    { key: 'meta-comma', command: '/fset -mark' },
    { key: 'meta-f,meta-a', command: '/fset -append' },
    { key: 'meta-return', command: '/fset -set' },
    { key: 'meta-space', command: '/fset -toggle' },
    { key: 'shift-down', command: '/fset -mark; /fset -down' },
    { key: 'meta-A', command: 'upper' },
];

describe('WeeChat keys', () => {
    it('reads key names', () => {
        expect(parseKeyName('meta--')).toEqual(parseKeyName('meta--'));
        expect(parseKeyName('meta-f,meta-a')).toHaveLength(2);
        expect(parseKeyName('ctrl-meta-x')).toEqual(parseKeyName('meta-ctrl-x'));
    });

    it('matches browser keys with bindings', () => {
        const command = (k: KeyInput) => {
            const m = matchKey(FSET, k);
            return m.type === 'command' ? m.command : m.type;
        };
        expect(command(key('l', { ctrlKey: true }))).toBe('/fset -refresh');
        expect(command(key('ArrowDown'))).toBe('/fset -down');
        expect(command(key('ArrowDown', { shiftKey: true }))).toBe(
            '/fset -mark; /fset -down',
        );
        expect(command(key('F11'))).toBe('/fset -left');
        expect(command(key('+', { altKey: true, shiftKey: true }))).toBe(
            '/fset -add 1',
        );
        expect(command(key('-', { altKey: true }))).toBe('/fset -add -1');
        expect(command(key(',', { altKey: true }))).toBe('/fset -mark');
        expect(command(key('Enter', { altKey: true }))).toBe('/fset -set');
        expect(command(key(' ', { altKey: true }))).toBe('/fset -toggle');
        expect(command(key('A', { altKey: true, shiftKey: true }))).toBe('upper');
        // macOS: Option+Space gives a non-breaking space, Option+Shift+A "Å"
        expect(command(key('Å', { altKey: true, shiftKey: true, code: 'KeyA' }))).toBe(
            'upper',
        );
        expect(command(key('\u00a0', { altKey: true, code: 'Space' }))).toBe(
            '/fset -toggle',
        );
        expect(command(key('x'))).toBe('none');
        expect(command(key('l', { metaKey: true }))).toBe('none');
        expect(comboOf(key('Control', { ctrlKey: true }))).toBeNull();
    });

    it('matches key sequences', () => {
        const first = matchKey(FSET, key('f', { altKey: true }));
        expect(first.type).toBe('prefix');
        const prefix = first.type === 'prefix' ? first.prefix : [];
        expect(matchKey(FSET, key('a', { altKey: true }), prefix)).toEqual({
            type: 'command',
            command: '/fset -append',
        });
        expect(matchKey(FSET, key('z', { altKey: true }), prefix).type).toBe('none');
    });

    it('splits the commands of a binding', () => {
        expect(bindingCommands('/fset -mark; /fset -down')).toEqual([
            '/fset -mark',
            '/fset -down',
        ]);
        expect(bindingCommands('/mute /set x "a;b"')).toEqual(['/mute /set x "a;b"']);
    });
});
