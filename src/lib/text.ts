/*
 * Split message text into tokens rendered differently: links, IRC channels,
 * color codes (shown with a swatch) and `code`. Rendering tokens as elements
 * (instead of building HTML) keeps message text from ever being parsed as HTML.
 */
import { find } from 'linkifyjs';

export type Token =
    | { type: 'text'; text: string }
    | { type: 'url'; text: string; href: string }
    | { type: 'channel'; text: string }
    | { type: 'color'; text: string; color: string }
    | { type: 'code'; text: string; fence: string };

// Channels starting with # and with at least one letter: "#1" is more likely
// "number 1" than a channel
const CHANNEL =
    /(^|[\s,.:;?!"'()+@~%-])(#+[^\x00\x07\r\n\s,:]*[a-z][^\x00\x07\r\n\s,:]*)/gi; // eslint-disable-line no-control-regex

// 6-digit hex colors (3 digits give too many false positives) and rgb()
const COLOR =
    /(^|[^&\w])(#[0-9a-f]{6})(?!\w)|(rgba?\((?:\s*\d+\s*,){2}\s*\d+\s*(?:,\s*[\d.]+\s*)?\))/gi;

// `code` or ```code```, starting at the beginning or after a space
const CODE = /(^|\s)(```|`)([^`].*?)\2/g;

interface Match {
    start: number;
    end: number;
    token: Token;
}

/** Colors and channels in a text without links (colors first: #ff0000 is not a channel) */
function scanPlain(text: string): Match[] {
    const matches: Match[] = [];
    for (const m of text.matchAll(COLOR)) {
        const value = m[2] ?? m[3];
        const start = m.index + (m[2] ? m[1].length : 0);
        matches.push({
            start,
            end: start + value.length,
            token: { type: 'color', text: value, color: value },
        });
    }
    for (const m of text.matchAll(CHANNEL)) {
        const start = m.index + m[1].length;
        const end = start + m[2].length;
        if (!matches.some((x) => start < x.end && end > x.start)) {
            matches.push({ start, end, token: { type: 'channel', text: m[2] } });
        }
    }
    return matches;
}

function toTokens(text: string, matches: Match[]): Token[] {
    matches.sort((a, b) => a.start - b.start);
    const tokens: Token[] = [];
    let pos = 0;
    for (const match of matches) {
        if (match.start < pos) {
            continue;
        }
        if (match.start > pos) {
            tokens.push({ type: 'text', text: text.substring(pos, match.start) });
        }
        tokens.push(match.token);
        pos = match.end;
    }
    if (pos < text.length) {
        tokens.push({ type: 'text', text: text.substring(pos) });
    }
    return tokens;
}

/** Tokens of a text without code */
function tokenizeInline(text: string, links: boolean): Token[] {
    const matches: Match[] = [];
    if (links) {
        for (const link of find(text)) {
            // Don't link emails (e.g. in hostmasks)
            if (link.type === 'url') {
                matches.push({
                    start: link.start,
                    end: link.end,
                    token: { type: 'url', text: link.value, href: link.href },
                });
            }
        }
    }
    // Channels and colors outside links
    let pos = 0;
    const linkMatches = [...matches].sort((a, b) => a.start - b.start);
    for (const link of [...linkMatches, { start: text.length, end: text.length }]) {
        const segment = text.substring(pos, link.start);
        for (const m of scanPlain(segment)) {
            matches.push({ ...m, start: m.start + pos, end: m.end + pos });
        }
        pos = link.end;
    }
    return toTokens(text, matches);
}

/**
 * Tokenize a message text.
 *
 * @param links whether to detect links (disabled e.g. for hostmasks)
 */
export function tokenize(text: string, links = true): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    for (const m of text.matchAll(CODE)) {
        const start = m.index + m[1].length;
        if (start > pos) {
            tokens.push(...tokenizeInline(text.substring(pos, start), links));
        }
        tokens.push({ type: 'code', text: m[3], fence: m[2] });
        pos = start + m[2].length * 2 + m[3].length;
    }
    if (pos < text.length) {
        tokens.push(...tokenizeInline(text.substring(pos), links));
    }
    return tokens;
}
