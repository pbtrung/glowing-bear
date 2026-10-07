/*
 * Nicklist display: groups with readable titles, filtering, avatar colors.
 */
import type { RichText } from '../lib/relay/colors';
import type { Buffer, Nick } from '../lib/state/model';

/** Titles of IRC mode groups ("000|o" -> "o") */
const MODE_TITLES: Record<string, string> = {
    q: 'Owners',
    a: 'Admins',
    o: 'Operators',
    h: 'Half-operators',
    v: 'Voiced',
    '...': 'Users',
};

/**
 * Title of a nick group: WeeChat sorts groups with a "NNN|" prefix, which is
 * removed; IRC mode groups get a name.
 */
export function groupTitle(name: string): string {
    const bare = name.replace(/^\d+\|/, '');
    return MODE_TITLES[bare] ?? bare;
}

export interface NickSection {
    id: number;
    title: string;
    nicks: Nick[];
}

/**
 * Visible nicks by group (in WeeChat's group order), sorted by name, keeping
 * nicks matching the filter (case insensitive).
 */
export function nickSections(buffer: Buffer, filter = ''): NickSection[] {
    const needle = filter.trim().toLowerCase();
    const byGroup = new Map<number, Nick[]>();
    for (const nick of Object.values(buffer.nicks)) {
        if (!nick.visible || (needle && !nick.name.toLowerCase().includes(needle))) {
            continue;
        }
        const list = byGroup.get(nick.groupId) ?? [];
        list.push(nick);
        byGroup.set(nick.groupId, list);
    }
    const groupName = (id: number) => buffer.nickGroups[id]?.name ?? '';
    return [...byGroup.entries()]
        .sort(([a], [b]) => groupName(a).localeCompare(groupName(b)))
        .map(([id, nicks]) => ({
            id,
            // Nicks in the root group are plain users
            title:
                id === 0 || groupName(id) === 'root'
                    ? 'Users'
                    : groupTitle(groupName(id)),
            nicks: nicks.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
            ),
        }));
}

/** A stable hue (0-359) for a name, to color its avatar */
export function nameHue(name: string): number {
    let hash = 0;
    for (const ch of name.toLowerCase()) {
        hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
    }
    return hash % 360;
}

/** First letter of a name for its avatar (skipping symbols like "_" or "[") */
export function initial(name: string): string {
    const letter = [...name].find((ch) => /[\p{L}\p{N}]/u.test(ch));
    return (letter ?? (name.charAt(0) || '?')).toUpperCase();
}

/** Prompt without the IRC prefixes (~ & @ % + !) in front of the nick */
function withoutPrivilege(prompt: RichText[]): RichText[] {
    const index = prompt.findIndex((part) => part.text !== '');
    if (index < 0) {
        return prompt;
    }
    const text = prompt[index].text.replace(/^[~&@%+!]+/, '');
    if (text === prompt[index].text) {
        return prompt;
    }
    const rest = prompt.slice(index + 1);
    // The prefix often has its own color, so it can be a whole part
    return text === '' ? withoutPrivilege(rest) : [{ ...prompt[index], text }, ...rest];
}

/**
 * Only the nick of an input prompt: "@nick(+i)" -> "nick", without the
 * privilege in front or the user modes after it (nicks have no "(").
 */
export function promptNick(prompt: RichText[]): RichText[] {
    const nick: RichText[] = [];
    for (const part of withoutPrivilege(prompt)) {
        const end = part.text.indexOf('(');
        if (end >= 0) {
            const text = part.text.slice(0, end).trimEnd();
            if (text !== '') {
                nick.push({ ...part, text });
            }
            break;
        }
        nick.push(part);
    }
    return nick;
}
