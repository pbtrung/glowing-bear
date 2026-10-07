import { describe, expect, it } from 'vitest';
import { tokenize } from './text';

describe('tokenize', () => {
    it('keeps plain text', () => {
        expect(tokenize('hello world')).toEqual([
            { type: 'text', text: 'hello world' },
        ]);
        expect(tokenize('')).toEqual([]);
    });

    it('finds links', () => {
        expect(tokenize('see https://weechat.org/doc now')).toEqual([
            { type: 'text', text: 'see ' },
            {
                type: 'url',
                text: 'https://weechat.org/doc',
                href: 'https://weechat.org/doc',
            },
            { type: 'text', text: ' now' },
        ]);
        expect(tokenize('www.example.com')[0]).toMatchObject({
            type: 'url',
            href: 'http://www.example.com',
        });
    });

    it('does not link emails nor when disabled', () => {
        expect(tokenize('~alice@example.com')).toEqual([
            { type: 'text', text: '~alice@example.com' },
        ]);
        expect(tokenize('https://weechat.org', false)).toEqual([
            { type: 'text', text: 'https://weechat.org' },
        ]);
    });

    it('finds channels with a letter', () => {
        expect(tokenize('join #weechat, not #1')).toEqual([
            { type: 'text', text: 'join ' },
            { type: 'channel', text: '#weechat' },
            { type: 'text', text: ', not #1' },
        ]);
        expect(tokenize('##chat')).toEqual([{ type: 'channel', text: '##chat' }]);
    });

    it('leaves the punctuation ending a sentence out of channels', () => {
        expect(tokenize('join #foo. or (see #bar) now!')).toEqual([
            { type: 'text', text: 'join ' },
            { type: 'channel', text: '#foo' },
            { type: 'text', text: '. or (see ' },
            { type: 'channel', text: '#bar' },
            { type: 'text', text: ') now!' },
        ]);
        expect(tokenize('#c++')).toEqual([{ type: 'channel', text: '#c++' }]);
        expect(tokenize('#café')).toEqual([{ type: 'channel', text: '#café' }]);
    });

    it('scans long texts in linear time', () => {
        const start = performance.now();
        tokenize('#-'.repeat(50000));
        expect(performance.now() - start).toBeLessThan(500);
    });

    it('links only URLs with a scheme when asked (free buffers)', () => {
        const urls = (text: string) =>
            tokenize(text, 'scheme')
                .filter((t) => t.type === 'url')
                .map((t) => t.text);
        expect(urls('weechat.look.bar_more_up string')).toEqual([]);
        expect(urls('see www.weechat.org or weechat.org')).toEqual([]);
        expect(urls('home: https://weechat.org/doc and ftp://x.org')).toEqual([
            'https://weechat.org/doc',
            'ftp://x.org',
        ]);
        // All of them otherwise
        expect(tokenize('weechat.org').map((t) => t.type)).toEqual(['url']);
    });

    it('never links javascript: or data: URLs', () => {
        for (const text of ['javascript:alert(1)', 'data:text/html,<b>x</b>']) {
            expect(tokenize(text).some((t) => t.type === 'url')).toBe(false);
        }
    });

    it('does not find channels in links', () => {
        expect(tokenize('https://example.com/#anchor')).toEqual([
            {
                type: 'url',
                text: 'https://example.com/#anchor',
                href: 'https://example.com/#anchor',
            },
        ]);
    });

    it('finds colors', () => {
        expect(tokenize('red is #ff0000 or rgb(255, 0, 0)')).toEqual([
            { type: 'text', text: 'red is ' },
            { type: 'color', text: '#ff0000', color: '#ff0000' },
            { type: 'text', text: ' or ' },
            { type: 'color', text: 'rgb(255, 0, 0)', color: 'rgb(255, 0, 0)' },
        ]);
        // 3 digits and HTML entities are not colors
        expect(tokenize('issue #123 &#123456;').some((t) => t.type === 'color')).toBe(
            false,
        );
    });

    it('finds code', () => {
        expect(tokenize('run `make test` or ```npm test```')).toEqual([
            { type: 'text', text: 'run ' },
            { type: 'code', text: 'make test', fence: '`' },
            { type: 'text', text: ' or ' },
            { type: 'code', text: 'npm test', fence: '```' },
        ]);
        // not in the middle of a word
        expect(tokenize('weird`stuff`').some((t) => t.type === 'code')).toBe(false);
    });

    it('never produces HTML', () => {
        const tokens = tokenize(
            '<img src=x onerror=alert(1)> https://e.com/"><script>',
        );
        expect(tokens.map((t) => t.text).join('')).toBe(
            '<img src=x onerror=alert(1)> https://e.com/"><script>',
        );
    });
});
