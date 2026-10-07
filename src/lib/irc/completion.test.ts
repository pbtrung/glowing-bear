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

    it('does nothing without a match', () => {
        expect(completeNick('zz', 2, null, nicks)).toEqual({
            text: 'zz',
            caretPos: 2,
            foundNick: null,
            iterCandidate: null,
        });
    });
});
