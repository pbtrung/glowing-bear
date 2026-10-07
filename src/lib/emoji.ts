/*
 * Emoji shortcodes typed in the input bar (":tada:" -> 🎉), with the GitHub
 * shortcodes of Emojibase (loaded on first use).
 */

/** Emoji of a shortcode (without colons) */
export type Shortcodes = Map<string, string>;

/** Emoji of an Emojibase hexcode ("1F44D", "1F468-200D-1F469") */
export function fromHexcode(hexcode: string): string {
    const emoji = String.fromCodePoint(
        ...hexcode.split('-').map((h) => parseInt(h, 16)),
    );
    // A lone character shown as text by default (e.g. ❤) needs the emoji
    // variation selector
    return [...emoji].length === 1 && !/\p{Emoji_Presentation}/u.test(emoji)
        ? emoji + '️'
        : emoji;
}

/** Shortcodes from Emojibase data (hexcode -> shortcode or shortcodes) */
export function buildShortcodes(data: Record<string, string | string[]>): Shortcodes {
    const shortcodes: Shortcodes = new Map();
    for (const [hexcode, names] of Object.entries(data)) {
        const emoji = fromHexcode(hexcode);
        for (const name of Array.isArray(names) ? names : [names]) {
            shortcodes.set(name, emoji);
        }
    }
    return shortcodes;
}

let shortcodes: Shortcodes | null = null;
let loading: Promise<Shortcodes | null> | null = null;

/** Load the shortcodes (once); null until they are loaded */
export function loadShortcodes(): Shortcodes | null {
    loading ??= import('emojibase-data/en/shortcodes/github.json').then(
        (m) => {
            shortcodes = buildShortcodes(
                m.default as Record<string, string | string[]>,
            );
            return shortcodes;
        },
        () => {
            // e.g. offline, or a new version deployed: try again next time
            loading = null;
            return null;
        },
    );
    return shortcodes;
}

/**
 * Emoji of a word made of shortcodes (":tada:", ":+1::tada:"), or null if it
 * isn't (unknown shortcodes, other text).
 */
export function emojifyWord(word: string, codes: Shortcodes): string | null {
    if (!/^(:[\w+-]+:)+$/.test(word)) {
        return null;
    }
    let result = '';
    for (const [, name] of word.matchAll(/:([\w+-]+):/g)) {
        const emoji = codes.get(name);
        if (emoji === undefined) {
            return null;
        }
        result += emoji;
    }
    return result;
}
