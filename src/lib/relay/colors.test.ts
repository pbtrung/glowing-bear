import { describe, expect, it } from 'vitest';
import { COLOR_OPTION_NAMES, parseRichText, plainText, stripColors } from './colors';

const classesOf = (text: string) => parseRichText(text).map((p) => [p.text, p.classes]);
/** Attributes set on the first part */
const attrsOf = (text: string) =>
    parseRichText(text)[0].classes.filter(
        (c) => c.startsWith('a-') && !c.startsWith('a-no-'),
    );

describe('WeeChat color codes', () => {
    it('returns plain text with default colors', () => {
        expect(classesOf('hello')).toEqual([['hello', ['cwf-default', 'cwb-default']]]);
        expect(parseRichText('')).toEqual([{ text: '', classes: [] }]);
        expect(parseRichText(null)).toEqual([{ text: '', classes: [] }]);
    });

    it('parses color options (\\x19 + STD)', () => {
        // option 1 is "chat"
        expect(classesOf('\x1901hello')).toEqual([
            ['hello', ['cof-chat', 'cob-chat', 'coa-chat']],
        ]);
    });

    it('knows the color options of recent WeeChat versions', () => {
        expect(COLOR_OPTION_NAMES.slice(-4)).toEqual([
            'chat_day_change',
            'chat_value_null',
            'chat_status_disabled',
            'chat_status_enabled',
        ]);
        const index = COLOR_OPTION_NAMES.indexOf('chat_status_enabled');
        expect(
            classesOf('\x19' + String(index).padStart(2, '0') + 'on')[0][1],
        ).toContain('cof-chat_status_enabled');
    });

    it('ignores unknown color options', () => {
        expect(classesOf('\x1999x')).toEqual([['x', ['cwf-default', 'cwb-default']]]);
    });

    it('parses foreground colors with attributes (F + (A)STD / (A)EXT)', () => {
        expect(classesOf('\x19F05green')).toEqual([
            ['green', ['cwf-green', 'cwb-default']],
        ]);
        const bold = classesOf('\x19F*05bold')[0][1];
        expect(bold).toContain('cwf-green');
        expect(bold).toContain('a-b');
        expect(classesOf('\x19F@00214ext')[0][1]).toContain('cef-214');
    });

    it('parses background colors (B + STD / EXT)', () => {
        expect(classesOf('\x19B03x')[0][1]).toEqual(['cwf-default', 'cwb-red']);
        expect(classesOf('\x19B@00100x')[0][1]).toEqual(['cwf-default', 'ceb-100']);
    });

    it('parses foreground and background (* + STD/EXT , or ~ STD/EXT)', () => {
        expect(classesOf('\x19*04,02x')[0][1].slice(0, 2)).toEqual([
            'cwf-lightred',
            'cwb-darkgray',
        ]);
        // WeeChat >= 2.6 uses a tilde
        expect(classesOf('\x19*04~@00020x')[0][1].slice(0, 2)).toEqual([
            'cwf-lightred',
            'ceb-20',
        ]);
        expect(classesOf('\x19*_09x')[0][1]).toContain('a-u');
    });

    it('parses emphasis', () => {
        expect(classesOf('\x19Ex')[0][1]).toEqual([
            'cof-emphasis',
            'cob-emphasis',
            'coa-emphasis',
        ]);
    });

    it('ignores bar codes (b + F, D, B, _, -, #, i, l, s)', () => {
        // The input prompt of an IRC channel: prefix, nick, then (modes) in
        // the bar delimiter color
        const prompt = '\x19F05@\x1c\x19F03ukx8\x19bD(\x19bF+i\x19bD)';
        expect(stripColors(prompt)).toBe('@ukx8(+i)');
        expect(stripColors('\x19bBa\x19b_b\x19b-c\x19b#d\x19bie\x19blf\x19bsg')).toBe(
            'abcdefg',
        );
    });

    it('sets and removes attributes (\\x1a / \\x1b)', () => {
        const parts = parseRichText('a\x1a*b\x1b*c');
        expect(parts.map((p) => p.text)).toEqual(['a', 'b', 'c']);
        expect(parts[1].classes).toContain('a-b');
        expect(parts[2].classes).toContain('a-no-b');
    });

    it('parses the blink (%) and dim (.) attributes (WeeChat >= 3.8)', () => {
        expect(classesOf('\x19F%05x')[0][1]).toEqual([
            'cwf-green',
            'cwb-default',
            'a-no-b',
            'a-no-r',
            'a-no-i',
            'a-no-u',
            'a-k',
            'a-no-d',
        ]);
        expect(attrsOf('\x19F@.00214x')).toEqual(['a-d']);
        expect(attrsOf('\x19*%.05~03x')).toEqual(['a-k', 'a-d']);
        expect(stripColors('a\x1a\x05b\x1b\x05c\x1a\x06d\x1b\x06e')).toBe('abcde');
        expect(parseRichText('a\x1a\x06b')[1].classes).toContain('a-d');
    });

    it('resets the attributes with a color, unless | keeps them', () => {
        const parts = parseRichText('\x19F*05a\x19F03b\x19F*05c\x19F|03d');
        expect(parts[1].classes).toContain('a-no-b');
        expect(parts[3].classes).toContain('a-b');
        expect(parts[3].classes[0]).toBe('cwf-red');
    });

    it('swaps the colors in reverse video', () => {
        // default colors
        expect(classesOf('\x1a\x02x')[0][1].slice(0, 2)).toEqual(['a-r-fg', 'a-r-bg']);
        // red on blue -> blue on red
        expect(classesOf('\x19*!03~09x')[0][1].slice(0, 2)).toEqual([
            'cwf-blue',
            'cwb-red',
        ]);
        // extended
        expect(classesOf('\x19F@!00214x')[0][1].slice(0, 2)).toEqual([
            'a-r-fg',
            'ceb-214',
        ]);
        // back to normal
        const parts = parseRichText('\x1a\x02a\x1b\x02b');
        expect(parts[1].classes.slice(0, 2)).toEqual(['cwf-default', 'cwb-default']);
    });

    it('resets colors and attributes (\\x1c)', () => {
        const parts = parseRichText('\x19F03red\x1cnormal');
        expect(parts[0].classes[0]).toBe('cwf-red');
        expect(parts[1].classes.slice(0, 2)).toEqual(['cwf-default', 'cwb-default']);
    });

    it('extracts the plain text', () => {
        const text = '\x19F03red \x19*04~02both\x1c \x1a*bold';
        expect(plainText(parseRichText(text))).toBe('red both bold');
        expect(stripColors(text)).toBe('red both bold');
    });
});
