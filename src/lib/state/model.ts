/*
 * Domain model: buffers, lines and nicks as displayed, built from the
 * objects of the relay "api" protocol.
 */
import { parseRichText, plainText, type RichText } from '../relay/colors';
import type { ApiBuffer, ApiLine, ApiNick, ApiNickGroup } from '../relay/types';

/** lastReadKey when all the lines loaded are unread */
export const READ_MARKER_TOP = '^';

export interface Line {
    /** Unique key in the buffer */
    key: string;
    /** Line id (-1 for lines added by Glowing Bear, e.g. date changes) */
    id: number;
    /** Index of the line in buffers with free content, -1 otherwise */
    y: number;
    date: Date;
    prefix: RichText[];
    content: RichText[];
    prefixText: string;
    text: string;
    tags: string[];
    highlight: boolean;
    /** -1: none, 0: low, 1: message, 2: private, 3: highlight */
    notifyLevel: number;
    displayed: boolean;
    /** Message of a user (add invisible <> around the nick for copy/paste) */
    isMessage: boolean;
    /** Sent by us (tag self_msg) */
    self: boolean;
    /** A join/part/quit WeeChat's smart filter may hide (tag irc_smart_filter) */
    smartFiltered: boolean;
    /** user@host of the nick (tag host_...), null if unknown */
    host: string | null;
    /** Date change line added by Glowing Bear */
    isDateChange?: boolean;
}

export interface Nick {
    id: number;
    groupId: number;
    prefix: string;
    name: string;
    visible: boolean;
    prefixClasses: string[];
    nameClasses: string[];
    /** Last time the nick spoke (for completion), 0 if unknown */
    spokeAt: number;
}

export interface NickGroup {
    id: number;
    parentId: number;
    name: string;
    /** Its name is shown (its nicks are, whatever this is) */
    visible: boolean;
    /** Classes of the color of its name */
    colorClasses: string[];
}

export interface Buffer {
    id: number;
    fullName: string;
    shortName: string;
    /** Short name without the channel prefix (#, & or +) */
    trimmedName: string;
    /** Channel prefix: "#", "&", "+" or "" */
    channelPrefix: string;
    nameClasses: string[];
    title: RichText[];
    titleText: string;
    modes: string;
    number: number;
    hidden: boolean;
    free: boolean;
    localVariables: Record<string, string>;
    /** channel, private, server, other... (local variable "type") */
    type: string;
    plugin: string;
    server: string;
    pinned: boolean;
    /** Key to sort the buffer list by server */
    serverSortKey: string;
    hideTime: boolean;
    hasNicklist: boolean;
    /** Nicks are compared with their case (e.g. for completion) */
    nicklistCaseSensitive: boolean;
    /** The nicklist shows its groups (else only their order matters) */
    nicklistDisplayGroups: boolean;
    /** Input with several lines is sent whole (else line by line) */
    inputMultiline: boolean;
    inputPrompt: RichText[];
    input: string;
    inputPosition: number;
    keys: { key: string; command: string }[];

    lines: Line[];
    /** Number of lines held (to know how many to fetch next) */
    requestedLines: number;
    /** Lines were fetched (else only the lines received since are held) */
    linesFetched: boolean;
    /** Lines are being fetched */
    loadingLines: boolean;
    allLinesFetched: boolean;
    /**
     * Key of the last line read: the read marker is shown after it (before
     * the first line with READ_MARKER_TOP)
     */
    lastReadKey: string | null;
    /** Read marker of WeeChat, used when lines are loaded (-1: none) */
    lastReadLineId: number;

    unread: number;
    notification: number;
    /** Time of the last activity counted (ms), 0 if none */
    activityAt: number;
    /** Away message (local variable "away" of IRC buffers), null if not away */
    away: string | null;

    nicklistLoaded: boolean;
    nickGroups: Record<number, NickGroup>;
    nicks: Record<number, Nick>;
}

/** Properties of a buffer that come from the relay */
export function bufferProperties(api: ApiBuffer): Partial<Buffer> {
    const localVariables = api.local_variables ?? {};
    const shortNameRich = parseRichText(api.short_name);
    const shortName = plainText(shortNameRich);
    const title = parseRichText(api.title);
    const type = localVariables.type || 'other';
    const plugin = localVariables.plugin ?? '';
    const server = localVariables.server ?? '';
    const props: Partial<Buffer> = {
        fullName: api.name,
        shortName,
        // If the name is empty after removing the channel prefix, use a
        // space so that the prefix (displayed separately) is not alone
        trimmedName: shortName.replace(/^[#&+]/, '') || (shortName ? ' ' : ''),
        channelPrefix: /^[#&+]/.test(shortName) ? shortName.charAt(0) : '',
        nameClasses: shortNameRich[0].classes,
        title,
        titleText: plainText(title),
        modes: api.modes ?? '',
        number: api.number,
        hidden: Boolean(api.hidden),
        free: api.type === 'free',
        localVariables,
        type,
        plugin,
        server,
        pinned: localVariables.pinned === 'true',
        away: localVariables.away || null,
        // "irc.server.libera" must sort before "irc.libera.#chan"
        serverSortKey: (
            plugin +
            '.' +
            server +
            (type === 'server' ? '' : '.' + shortName)
        ).toLowerCase(),
        hideTime: type === 'relay' || api.time_displayed === false,
        hasNicklist: api.nicklist !== false,
        nicklistCaseSensitive: api.nicklist_case_sensitive === true,
        nicklistDisplayGroups: api.nicklist_display_groups === true,
        inputMultiline: api.input_multiline === true,
        inputPrompt: parseRichText(api.input_prompt),
        input: api.input ?? '',
        inputPosition: api.input_position ?? 0,
        keys: api.keys ?? [],
    };
    if (api.last_read_line_id !== undefined) {
        props.lastReadLineId = api.last_read_line_id;
    }
    return props;
}

export function createBuffer(api: ApiBuffer): Buffer {
    return {
        id: api.id,
        lines: [],
        requestedLines: 0,
        linesFetched: false,
        loadingLines: false,
        allLinesFetched: false,
        lastReadKey: null,
        lastReadLineId: -1,
        unread: 0,
        notification: 0,
        activityAt: 0,
        nicklistLoaded: false,
        nickGroups: {},
        nicks: {},
        ...bufferProperties(api),
    } as Buffer;
}

export function lineKey(line: { id: number; y: number }, free: boolean): string {
    return free ? 'y' + line.y : 'l' + line.id;
}

export function createLine(api: ApiLine, free = false): Line {
    const prefix = parseRichText(api.prefix);
    const content = parseRichText(api.message);
    const tags = api.tags ?? [];
    if (api.highlight) {
        for (const part of prefix) {
            part.classes.push('highlight');
        }
    }
    return {
        key: lineKey(api, free),
        id: api.id,
        y: api.y ?? -1,
        date: new Date(api.date),
        prefix,
        content,
        prefixText: plainText(prefix),
        text: plainText(content),
        tags,
        highlight: Boolean(api.highlight),
        notifyLevel: api.notify_level ?? 0,
        displayed: api.displayed !== false,
        isMessage: tags.includes('irc_privmsg') && !tags.includes('irc_action'),
        self: tags.includes('self_msg'),
        smartFiltered: tags.includes('irc_smart_filter'),
        host: tags.find((t) => t.startsWith('host_'))?.substring(5) || null,
    };
}

/** CSS classes for a nick color (a color name or option, e.g. "lightgreen") */
export function nickColorClasses(color: string | undefined): string[] {
    if (!color) {
        return ['cwf-default'];
    }
    if (color.startsWith('weechat')) {
        // color option
        const name = color.match(/[a-zA-Z0-9_]+$/)?.[0] ?? 'default';
        return ['cof-' + name, 'cob-' + name, 'coa-' + name];
    }
    // Attributes (e.g. "*lightred" for bold) are not used
    color = color.replace(/^[*!/_%.|]+/, '');
    let classes = ['cwf-default'];
    const fgName = color.match(/^([a-zA-Z]+)(:|$)/);
    const fgExt = color.match(/^([0-9]+)(:|$)/);
    if (fgName) {
        classes = ['cwf-' + fgName[1]];
    } else if (fgExt) {
        classes = ['cef-' + fgExt[1]];
    }
    const bgName = color.match(/:([a-zA-Z]+)$/);
    const bgExt = color.match(/:([0-9]+)$/);
    if (bgName) {
        classes.push('cwb-' + bgName[1]);
    } else if (bgExt) {
        classes.push('ceb-' + bgExt[1]);
    }
    return classes;
}

export function createNick(api: ApiNick): Nick {
    return {
        id: api.id,
        groupId: api.parent_group_id,
        prefix: api.prefix,
        name: api.name,
        visible: api.visible !== false,
        prefixClasses: nickColorClasses(api.prefix_color_name),
        nameClasses: nickColorClasses(api.color_name),
        spokeAt: 0,
    };
}

export function createNickGroup(api: ApiNickGroup): NickGroup {
    return {
        id: api.id,
        parentId: api.parent_group_id,
        name: api.name,
        visible: api.visible !== false,
        colorClasses: nickColorClasses(api.color_name),
    };
}
