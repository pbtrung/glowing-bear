/*
 * Nick tab completion in the input bar (commands are completed by WeeChat,
 * see POST /api/completion).
 */

export interface NickCompletion {
    /** New text of the input */
    text: string;
    /** New caret position in the text */
    caretPos: number;
    /** Completed nick (null if none) */
    foundNick: string | null;
    /** Start of the nick being iterated (null if not iterating) */
    iterCandidate: string | null;
}

// IRC nicks, and nicks of other networks (letters of any script, dots...)
const NICK = '[\\p{L}\\p{M}\\p{N}_\\\\\\[\\]{}^`|.\\-]+';
/** Text before a nick in the middle of the input (also on another line) */
const BEFORE = '[\\s\\S]*\\s';

const regex = (source: string) => new RegExp(source, 'u');

/** First nick starting with candidate */
function completeSingleNick(
    candidate: string,
    nicks: string[],
    fold: (s: string) => string,
): string | null {
    const prefix = fold(candidate);
    return nicks.find((nick) => fold(nick).startsWith(prefix)) ?? null;
}

/** Next nick starting with iterCandidate after currentNick, cycling */
function nextNick(
    iterCandidate: string,
    currentNick: string,
    nicks: string[],
    fold: (s: string) => string,
): string {
    const prefix = fold(iterCandidate);
    const current = fold(currentNick);
    const matching = nicks.filter((nick) => fold(nick).startsWith(prefix));
    const at = matching.findIndex((nick) => fold(nick) === current);
    if (at === -1) {
        return currentNick;
    }
    return matching[(at + 1) % matching.length];
}

/**
 * Complete the nick before the caret (the rest of the word after the caret
 * is replaced).
 *
 * @param text input text
 * @param caretPos caret position (0 means before the first character)
 * @param iterCandidate current iteration candidate (null if not iterating)
 * @param nicks nicks to complete, the most likely first
 * @param suffix suffix added after a nick at the beginning of the input
 *               (weechat.completion.nick_completer)
 * @param addSpace whether to add a space after a nick in the middle of the
 *                 input (weechat.completion.nick_add_space)
 * @param caseSensitive compare nicks with their case (buffer property
 *                      nicklist_case_sensitive)
 */
export function completeNick(
    text: string,
    caretPos: number,
    iterCandidate: string | null,
    nicks: string[],
    suffix = ':',
    addSpace = true,
    caseSensitive = false,
): NickCompletion {
    const fold = caseSensitive ? (s: string) => s : (s: string) => s.toLowerCase();
    const doIterate = iterCandidate !== null;
    const addSpaceChar = addSpace ? ' ' : '';
    const nickSuffix = suffix.endsWith(' ') ? suffix : suffix + ' ';

    let beforeCaret = text.substring(0, caretPos);
    let afterCaret = text.substring(caretPos);

    // default: don't change anything
    const unchanged: NickCompletion = {
        text,
        caretPos,
        foundNick: null,
        iterCandidate: null,
    };

    // (outside a character class, "-" must not be escaped with the u flag)
    const escapedSuffix = suffix.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');

    // iterating nicks at the beginning?
    let m = beforeCaret.match(regex('^(' + NICK + ')' + escapedSuffix + ' ?$'));
    if (m && (beforeCaret.endsWith(' ') || suffix.endsWith(' '))) {
        if (!doIterate) {
            return unchanged;
        }
        const newNick = nextNick(iterCandidate, m[1], nicks, fold);
        beforeCaret = newNick + nickSuffix;
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate,
        };
    }

    // The rest of the word after the caret is replaced by the nick
    const restOfWord = afterCaret.match(regex('^' + NICK))?.[0] ?? '';

    // nick completion at the beginning?
    m = beforeCaret.match(regex('^(' + NICK + ')$'));
    if (m) {
        const newNick = completeSingleNick(m[1], nicks, fold);
        if (newNick === null) {
            return unchanged;
        }
        afterCaret = afterCaret.substring(restOfWord.length);
        beforeCaret = newNick + nickSuffix;
        if (afterCaret.startsWith(' ')) {
            // swallow first space after caret if any
            afterCaret = afterCaret.substring(1);
        }
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate: m[1],
        };
    }

    // iterating nicks in the middle?
    m = beforeCaret.match(regex('^(' + BEFORE + ')(' + NICK + ') ?$'));
    if (m && doIterate && (beforeCaret.endsWith(' ') || !addSpace)) {
        const newNick = nextNick(iterCandidate, m[2], nicks, fold);
        beforeCaret = m[1] + newNick + addSpaceChar;
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate,
        };
    }

    // nick completion elsewhere in the middle?
    m = beforeCaret.match(regex('^(' + BEFORE + ')(' + NICK + ')$'));
    if (m) {
        const newNick = completeSingleNick(m[2], nicks, fold);
        if (newNick === null) {
            return unchanged;
        }
        afterCaret = afterCaret.substring(restOfWord.length);
        beforeCaret = m[1] + newNick + addSpaceChar;
        if (afterCaret.startsWith(' ')) {
            afterCaret = afterCaret.substring(1);
        }
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate: m[2],
        };
    }

    return unchanged;
}
