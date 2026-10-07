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

const NICK = '[a-zA-Z0-9_\\\\\\[\\]{}^`|-]+';

/** First nick starting with candidate (case insensitive) */
function completeSingleNick(candidate: string, nicks: string[]): string | null {
    const lc = candidate.toLowerCase();
    return nicks.find((nick) => nick.toLowerCase().startsWith(lc)) ?? null;
}

/** Next nick starting with iterCandidate after currentNick, cycling */
function nextNick(iterCandidate: string, currentNick: string, nicks: string[]): string {
    const lcCandidate = iterCandidate.toLowerCase();
    const lcCurrent = currentNick.toLowerCase();
    const matching = nicks.filter((nick) => nick.toLowerCase().startsWith(lcCandidate));
    const at = matching.findIndex((nick) => nick.toLowerCase() === lcCurrent);
    if (at === -1) {
        return currentNick;
    }
    return matching[(at + 1) % matching.length];
}

/**
 * Complete the nick before the caret.
 *
 * @param text input text
 * @param caretPos caret position (0 means before the first character)
 * @param iterCandidate current iteration candidate (null if not iterating)
 * @param nicks nicks to complete, the most likely first
 * @param suffix suffix added after a nick at the beginning of the input
 *               (weechat.completion.nick_completer)
 * @param addSpace whether to add a space after a nick in the middle of the
 *                 input (weechat.completion.nick_add_space)
 */
export function completeNick(
    text: string,
    caretPos: number,
    iterCandidate: string | null,
    nicks: string[],
    suffix = ':',
    addSpace = true,
): NickCompletion {
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

    const escapedSuffix = suffix.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

    // iterating nicks at the beginning?
    let m = beforeCaret.match(new RegExp('^(' + NICK + ')' + escapedSuffix + ' ?$'));
    if (m && (beforeCaret.endsWith(' ') || suffix.endsWith(' '))) {
        if (!doIterate) {
            return unchanged;
        }
        const newNick = nextNick(iterCandidate, m[1], nicks);
        beforeCaret = newNick + nickSuffix;
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate,
        };
    }

    // nick completion at the beginning?
    m = beforeCaret.match(new RegExp('^(' + NICK + ')$'));
    if (m) {
        const newNick = completeSingleNick(m[1], nicks);
        if (newNick === null) {
            return unchanged;
        }
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
    m = beforeCaret.match(new RegExp('^(.* )(' + NICK + ') ?$'));
    if (m && doIterate && (beforeCaret.endsWith(' ') || !addSpace)) {
        const newNick = nextNick(iterCandidate, m[2], nicks);
        beforeCaret = m[1] + newNick + addSpaceChar;
        return {
            text: beforeCaret + afterCaret,
            caretPos: beforeCaret.length,
            foundNick: newNick,
            iterCandidate,
        };
    }

    // nick completion elsewhere in the middle?
    m = beforeCaret.match(new RegExp('^(.* )(' + NICK + ')$'));
    if (m) {
        const newNick = completeSingleNick(m[2], nicks);
        if (newNick === null) {
            return unchanged;
        }
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
