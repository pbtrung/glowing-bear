import { describe, expect, it } from 'vitest';
import github from 'emojibase-data/en/shortcodes/github.json';
import { buildShortcodes, emojifyWord, fromHexcode } from './emoji';

const codes = buildShortcodes(github as Record<string, string | string[]>);

describe('emoji shortcodes', () => {
    it('converts hexcodes, with the emoji presentation', () => {
        expect(fromHexcode('1F44D')).toBe('👍');
        expect(fromHexcode('2764')).toBe('❤️');
        expect(fromHexcode('1F468-200D-1F469-200D-1F467')).toBe('👨‍👩‍👧');
    });

    it('knows the GitHub shortcodes', () => {
        expect(emojifyWord(':tada:', codes)).toBe('🎉');
        expect(emojifyWord(':+1:', codes)).toBe('👍');
        expect(emojifyWord(':thumbsup:', codes)).toBe('👍');
        expect(emojifyWord(':heart:', codes)).toBe('❤️');
        expect(emojifyWord(':smile::tada:', codes)).toBe('😄🎉');
    });

    it('leaves other words', () => {
        expect(emojifyWord(':nope_not_an_emoji:', codes)).toBeNull();
        expect(emojifyWord('10:30', codes)).toBeNull();
        expect(emojifyWord('a:tada:', codes)).toBeNull();
        expect(emojifyWord(':tada:x', codes)).toBeNull();
        expect(emojifyWord('::', codes)).toBeNull();
    });
});
