import { describe, expect, it } from 'vitest';
import { COLOR_OPTION_NAMES, parseRichText, plainText, stripColors } from './colors';

const classesOf = (text: string) => parseRichText(text).map((p) => [p.text, p.classes]);

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

    it('sets and removes attributes (\\x1a / \\x1b)', () => {
        const parts = parseRichText('a\x1a*b\x1b*c');
        expect(parts.map((p) => p.text)).toEqual(['a', 'b', 'c']);
        expect(parts[1].classes).toContain('a-b');
        expect(parts[2].classes).toContain('a-no-b');
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
