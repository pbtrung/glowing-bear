import { describe, expect, it } from 'vitest';
import { completeNick } from './completion';

const nicks = ['alice', 'albert', 'bob', 'Carol'];

describe('nick completion', () => {
    it('completes a nick at the beginning with the suffix', () => {
        const r = completeNick('al', 2, null, nicks);
        expect(r).toEqual({
            text: 'alice: ',
            caretPos: 7,
            foundNick: 'alice',
            iterCandidate: 'al',
        });
    });

    it('is case insensitive', () => {
        expect(completeNick('car', 3, null, nicks).text).toBe('Carol: ');
    });

    it('iterates over matching nicks at the beginning', () => {
        let r = completeNick('al', 2, null, nicks);
        r = completeNick(r.text, r.caretPos, r.iterCandidate, nicks);
        expect(r.text).toBe('albert: ');
        r = completeNick(r.text, r.caretPos, r.iterCandidate, nicks);
        expect(r.text).toBe('alice: ');
    });

    it('completes and iterates in the middle of the text', () => {
        let r = completeNick('hello al', 8, null, nicks);
        expect(r.text).toBe('hello alice ');
        r = completeNick(r.text, r.caretPos, r.iterCandidate, nicks);
        expect(r.text).toBe('hello albert ');
    });

    it('keeps the text after the caret', () => {
        const r = completeNick('hello bo how are you', 8, null, nicks);
        expect(r.text).toBe('hello bob how are you');
        expect(r.caretPos).toBe(10);
    });

    it('uses the nick completer and add space options of WeeChat', () => {
        expect(completeNick('bo', 2, null, nicks, ',').text).toBe('bob, ');
        expect(completeNick('bo', 2, null, nicks, ': ').text).toBe('bob: ');
        expect(completeNick('hi bo', 5, null, nicks, ':', false).text).toBe('hi bob');
    });

    it('iterates with a suffix ending with a space', () => {
        let r = completeNick('al', 2, null, nicks, ': ');
        r = completeNick(r.text, r.caretPos, r.iterCandidate, nicks, ': ');
        expect(r.text).toBe('albert: ');
    });

    it('completes nicks of any script and with dots', () => {
        const others = ['Élodie', 'José', 'nick.name', '[yasmin]'];
        expect(completeNick('él', 2, null, others).text).toBe('Élodie: ');
        expect(completeNick('hi jo', 5, null, others).text).toBe('hi José ');
        expect(completeNick('nick.n', 6, null, others).text).toBe('nick.name: ');
        expect(completeNick('[ya', 3, null, others).text).toBe('[yasmin]: ');
    });

    it('completes on other lines of a multi-line input', () => {
        let r = completeNick('first line\nal', 13, null, nicks);
        expect(r.text).toBe('first line\nalice ');
        r = completeNick(r.text, r.caretPos, r.iterCandidate, nicks);
        expect(r.text).toBe('first line\nalbert ');
    });

    it('replaces the rest of the word after the caret', () => {
        expect(completeNick('alxx', 2, null, nicks)).toMatchObject({
            text: 'alice: ',
            caretPos: 7,
        });
        expect(completeNick('hi boxx there', 5, null, nicks).text).toBe('hi bob there');
    });

    it('compares case when the nicklist is case sensitive', () => {
        const both = ['Alice', 'alice'];
        expect(completeNick('al', 2, null, both, ':', true, true).text).toBe('alice: ');
        expect(completeNick('al', 2, null, both).text).toBe('Alice: ');
        expect(
            completeNick('car', 3, null, nicks, ':', true, true).foundNick,
        ).toBeNull();
    });

    it('does nothing without a match', () => {
        expect(completeNick('zz', 2, null, nicks)).toEqual({
            text: 'zz',
            caretPos: 2,
            foundNick: null,
            iterCandidate: null,
        });
    });
});
