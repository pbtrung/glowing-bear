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
    /** Depth of the group (0 under the root) */
    depth: number;
    /** The group name is shown (visible group) */
    visible: boolean;
    /** Classes of the color of the group name */
    classes: string[];
}

/**
 * Visible nicks by group, in WeeChat's order: groups sorted by name, each
 * followed by its subgroups, the nicks of the root group last. Nicks are
 * sorted by name, and kept if they match the filter (case insensitive).
 */
export function nickSections(buffer: Buffer, filter = ''): NickSection[] {
    const needle = filter.trim().toLowerCase();
    const byGroup = new Map<number, Nick[]>();
    for (const nick of Object.values(buffer.nicks)) {
        if (!nick.visible || (needle && !nick.name.toLowerCase().includes(needle))) {
            continue;
        }
        byGroup.set(nick.groupId, [...(byGroup.get(nick.groupId) ?? []), nick]);
    }
    const groups = Object.values(buffer.nickGroups);
    const isRoot = (id: number) =>
        id === 0 || buffer.nickGroups[id]?.name === 'root' || !buffer.nickGroups[id];
    const children = (parentId: number) =>
        groups
            .filter((g) => g.parentId === parentId && !isRoot(g.id))
            .sort((a, b) => a.name.localeCompare(b.name));
    const sortNicks = (nicks: Nick[]) =>
        nicks.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        );

    const sections: NickSection[] = [];
    const visit = (parentId: number, depth: number, seen: Set<number>) => {
        for (const group of children(parentId)) {
            if (seen.has(group.id)) {
                continue;
            }
            seen.add(group.id);
            const nicks = byGroup.get(group.id);
            if (nicks) {
                sections.push({
                    id: group.id,
                    title: groupTitle(group.name),
                    nicks: sortNicks(nicks),
                    depth,
                    visible: group.visible,
                    classes: group.colorClasses,
                });
            }
            visit(group.id, depth + 1, seen);
        }
    };
    const rootId = groups.find((g) => isRoot(g.id))?.id ?? 0;
    visit(rootId, 0, new Set());
    // Nicks of the root group, and of groups not found (nicks are kept)
    const placed = new Set(sections.map((s) => s.id));
    const others = [...byGroup.entries()]
        .filter(([id]) => !placed.has(id))
        .flatMap(([, nicks]) => nicks);
    if (others.length > 0) {
        sections.push({
            id: rootId,
            title: 'Users',
            nicks: sortNicks(others),
            depth: 0,
            visible: true,
            classes: [],
        });
    }
    return sections;
}

/**
 * Whether the nicklist shows group titles: with several groups, when the
 * buffer displays its groups (nicklist_display_groups) or they are IRC mode
 * groups ("000|o"...), which IRC buffers don't display but are worth naming.
 */
export function showGroupTitles(buffer: Buffer, visible: Nick[]): boolean {
    const groups = new Set(visible.map((n) => n.groupId));
    if (groups.size < 2) {
        return false;
    }
    return (
        buffer.nicklistDisplayGroups ||
        [...groups].every((id) => {
            const name = buffer.nickGroups[id]?.name ?? '';
            return id === 0 || name === 'root' || /^\d+\|/.test(name);
        })
    );
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
