/*
 * State updates for the data received from the relay: responses to requests
 * (buffers, lines, nicks, hotlist) and events pushed by WeeChat.
 *
 * All functions are pure: they take a state and return a new one (immer), and
 * report side effects (notifications, reconnection...) to the caller.
 */
import { produce, type Draft } from 'immer';
import type {
    ApiBuffer,
    ApiEvent,
    ApiHotlist,
    ApiLine,
    ApiNick,
    ApiNickGroup,
    ApiScript,
    ApiVersion,
} from '../relay/types';
import { parseRichText, plainText } from '../relay/colors';
import {
    bufferProperties,
    createBuffer,
    createLine,
    createNick,
    createNickGroup,
    READ_MARKER_TOP,
    type Buffer,
    type Line,
} from './model';

export type ConnectionStatus =
    'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface ChatState {
    status: ConnectionStatus;
    buffers: Record<number, Buffer>;
    activeBufferId: number | null;
    previousBufferId: number | null;
    version: ApiVersion | null;
    scripts: ApiScript[];
    /** WeeChat options (weechat.look.buffer_time_format...) */
    options: Record<string, string>;
    /** WeeChat is upgrading (/upgrade) */
    upgrading: boolean;
    /** WeeChat is quitting */
    quitting: boolean;
    /** Names of buffers we asked WeeChat to open (/query, /join): switch to them */
    outgoingQueries: OutgoingQuery[];
}

export const initialState: ChatState = {
    status: 'disconnected',
    buffers: {},
    activeBufferId: null,
    previousBufferId: null,
    version: null,
    scripts: [],
    options: {},
    upgrading: false,
    quitting: false,
    outgoingQueries: [],
};

/** A buffer we asked WeeChat to open: switch to it when it opens */
export interface OutgoingQuery {
    /** Short name of the buffer */
    name: string;
    /** Date.now() after which it's forgotten (e.g. the /join failed) */
    expires: number;
}

export type Effect =
    /** A highlight or private message to notify */
    | { type: 'highlight'; bufferId: number; line: Line }
    /** A line was added to the active buffer */
    | { type: 'activeBufferLine'; bufferId: number }
    /** Switch to a buffer (one we opened, or after closing the active one) */
    | { type: 'activate'; bufferId: number }
    /** WeeChat is upgrading: the connection must be reopened */
    | { type: 'upgrade' };

export interface Result {
    state: ChatState;
    effects: Effect[];
}

export interface EventContext {
    /** Whether the window is focused (unfocused: lines in the active buffer count as unread) */
    windowFocused: boolean;
}

/*
 * Lines
 */

const startOfDay = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** A line announcing a date change, like WeeChat's day change messages */
export function dateChangeLine(previous: Date, date: Date, key: string): Line {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    let content = '\x1943' + date.toLocaleDateString(locale, { weekday: 'long' });
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    if (date.getFullYear() !== previous.getFullYear()) {
        options.year = 'numeric';
    }
    content += ' (' + date.toLocaleDateString(locale, options);
    const days = Math.round((startOfDay(date) - startOfDay(previous)) / 86400000);
    if (days > 1) {
        content += `, ${days} days later`;
    } else if (days < 0) {
        content += days === -1 ? ', 1 day before' : `, ${-days} days before`;
    }
    content += ')';
    const prefix = parseRichText('\x1943─');
    const rich = parseRichText(content);
    return {
        key,
        id: -1,
        y: -1,
        date,
        prefix,
        content: rich,
        prefixText: plainText(prefix),
        text: plainText(rich),
        tags: [],
        highlight: false,
        notifyLevel: -1,
        displayed: true,
        isMessage: false,
        isDateChange: true,
        self: false,
        smartFiltered: false,
        host: null,
    };
}

/** Insert a date change line before `line` if the day changed */
function addDateChange(buffer: Draft<Buffer>, line: Line): void {
    const last = buffer.lines[buffer.lines.length - 1];
    if (!last) {
        return;
    }
    if (startOfDay(last.date) !== startOfDay(line.date)) {
        buffer.lines.push(
            dateChangeLine(last.date, line.date, 'd' + line.key) as Draft<Line>,
        );
    }
}

/** Remember when a nick spoke, to complete the most recent speakers first */
function updateNickSpeak(buffer: Draft<Buffer>, line: Line, now: number): void {
    if (!buffer.nicklistLoaded || line.notifyLevel < 1) {
        // not a message (joins, quits, nick changes...)
        return;
    }
    // The nick_xxx tag, else the prefix (which may have a suffix, or be the
    // action prefix)
    let nick = line.tags.find((t) => t.startsWith('nick_'))?.substring(5);
    if (nick === undefined) {
        nick = line.prefix[line.prefix.length - 1]?.text.trim();
    }
    if (!nick) {
        return;
    }
    for (const n of Object.values(buffer.nicks)) {
        if (n.name === nick) {
            n.spokeAt = now;
            return;
        }
    }
}

/** Set a line of a buffer with free content (lines are addressed by index) */
function setFreeLine(buffer: Draft<Buffer>, line: Line): void {
    const index = buffer.lines.findIndex((l) => l.y >= line.y);
    if (index === -1) {
        buffer.lines.push(line as Draft<Line>);
    } else if (buffer.lines[index].y === line.y) {
        buffer.lines[index] = line as Draft<Line>;
    } else {
        buffer.lines.splice(index, 0, line as Draft<Line>);
    }
}

/** Lines kept in buffers not shown (older ones are fetched again if needed) */
export const MAX_LINES = 500;

/** Most lines fetched for a buffer (the history shown when scrolling up) */
export const MAX_FETCHED_LINES = 8 * MAX_LINES;

/**
 * Lines of the buffer shown above which it's trimmed (to 2 * MAX_LINES).
 * More than MAX_FETCHED_LINES, so that a new line doesn't trim the history
 * just fetched (whose reading would fetch it again, and so on).
 */
export const MAX_ACTIVE_LINES = 10 * MAX_LINES;

/** Whether two versions of a line show the same thing */
function sameLine(a: Line, b: Line): boolean {
    return (
        a.key === b.key &&
        a.id === b.id &&
        a.date.getTime() === b.date.getTime() &&
        a.prefixText === b.prefixText &&
        a.text === b.text &&
        a.highlight === b.highlight &&
        a.notifyLevel === b.notifyLevel &&
        a.displayed === b.displayed &&
        a.tags.join(',') === b.tags.join(',')
    );
}

/** Whether older lines of a buffer can be fetched */
export function canFetchMore(buffer: Buffer): boolean {
    return (
        !buffer.free &&
        !buffer.allLinesFetched &&
        buffer.requestedLines < MAX_FETCHED_LINES
    );
}

/** Keep the last `max` lines of a buffer (memory of long sessions) */
function trimLines(buffer: Draft<Buffer>, max = MAX_LINES): void {
    if (buffer.free) {
        return;
    }
    let count = buffer.lines.filter((l) => !l.isDateChange).length;
    if (count <= max) {
        return;
    }
    let start = 0;
    for (; count > max; start++) {
        if (!buffer.lines[start].isDateChange) {
            count--;
        }
    }
    // No date change at the top
    while (buffer.lines[start]?.isDateChange) {
        start++;
    }
    buffer.lines.splice(0, start);
    buffer.requestedLines = max;
    buffer.allLinesFetched = false;
    if (
        buffer.lastReadKey !== null &&
        buffer.lastReadKey !== READ_MARKER_TOP &&
        !buffer.lines.some((l) => l.key === buffer.lastReadKey)
    ) {
        // read before the lines kept
        buffer.lastReadKey = READ_MARKER_TOP;
    }
}

/**
 * Add a line pushed by WeeChat (buffer_line_added).
 */
function addNewLine(
    draft: Draft<ChatState>,
    buffer: Draft<Buffer>,
    api: ApiLine,
    ctx: EventContext,
    effects: Effect[],
): void {
    const line = createLine(api, buffer.free);
    if (buffer.free) {
        setFreeLine(buffer, line);
        return;
    }
    buffer.requestedLines++;
    if (!line.displayed) {
        return;
    }
    addDateChange(buffer, line);
    buffer.lines.push(line as Draft<Line>);
    updateNickSpeak(buffer, line, Date.now());

    const active = draft.activeBufferId === buffer.id;
    if (!active) {
        trimLines(buffer);
    } else if (buffer.lines.length > MAX_ACTIVE_LINES) {
        // The lines of the active buffer are kept while it's read, up to a
        // point (e.g. a busy buffer shown all night)
        trimLines(buffer, 2 * MAX_LINES);
    }
    if (active) {
        effects.push({ type: 'activeBufferLine', bufferId: buffer.id });
    }
    if (active && ctx.windowFocused) {
        return;
    }
    const isPrivate = line.notifyLevel === 2;
    const isHighlight = line.highlight || line.notifyLevel === 3;
    if (isHighlight || isPrivate || line.notifyLevel === 1) {
        buffer.activityAt = line.date.getTime();
    }
    if (isHighlight || isPrivate) {
        buffer.notification++;
        effects.push({ type: 'highlight', bufferId: buffer.id, line });
    } else if (line.notifyLevel === 1) {
        buffer.unread++;
    }
}

/**
 * Key of the last read line, given the number of unread lines: they are
 * counted like the unread counters, from the lines that notify.
 */
function guessLastRead(lines: Line[], unread: number): string | null {
    let i = lines.length;
    for (let remaining = unread; remaining > 0;) {
        if (i === 0) {
            // everything loaded is unread
            return lines.length > 0 ? READ_MARKER_TOP : null;
        }
        i--;
        const line = lines[i];
        if (!line.isDateChange && (line.notifyLevel >= 1 || line.highlight)) {
            remaining--;
        }
    }
    return lines.slice(0, i).findLast((l) => !l.isDateChange)?.key ?? READ_MARKER_TOP;
}

/**
 * Lines fetched for a buffer (GET /api/buffers/{id}/lines), oldest first:
 * they replace the current lines.
 *
 * @param requested number of lines requested (to know if all were fetched)
 * @param unreadHint number of unread lines, to place the read marker if
 *                   WeeChat has none
 */
export function applyLines(
    state: ChatState,
    bufferId: number,
    apiLines: ApiLine[],
    requested: number,
    unreadHint = 0,
): ChatState {
    return produce(state, (draft) => {
        const buffer = draft.buffers[bufferId];
        if (!buffer) {
            return;
        }
        // Lines already loaded are kept as they are (no new objects: the rows
        // of the lines shown aren't rendered again when older ones are fetched)
        const previous = new Map(state.buffers[bufferId].lines.map((l) => [l.key, l]));
        const reuse = (line: Line): Line => {
            const old = previous.get(line.key);
            return old && sameLine(old, line) ? old : line;
        };
        buffer.lines = [];
        buffer.requestedLines = apiLines.length;
        buffer.allLinesFetched = apiLines.length < requested;
        for (const api of apiLines) {
            const line = createLine(api, buffer.free);
            if (buffer.free) {
                setFreeLine(buffer, line);
            } else if (line.displayed) {
                addDateChange(buffer, line);
                buffer.lines.push(line as Draft<Line>);
            }
        }
        if (buffer.free) {
            return;
        }
        buffer.lines = buffer.lines.map((l) => reuse(l as Line)) as Draft<Line>[];
        // Read marker, if none yet: WeeChat's one, else guess from the number
        // of unread lines (WeeChat's marker comes again with each buffer
        // event, and must not replace the local one)
        const noMarker =
            buffer.lastReadKey === null || buffer.lastReadKey === READ_MARKER_TOP;
        if (noMarker && buffer.lastReadLineId >= 0 && buffer.lines.length > 0) {
            // The last line loaded up to WeeChat's one (which may be filtered,
            // e.g. a join hidden by the smart filter); line ids grow with time
            const read = buffer.lines.findLast(
                (l) => !l.isDateChange && l.id <= buffer.lastReadLineId,
            );
            buffer.lastReadKey = read ? read.key : READ_MARKER_TOP;
        } else if (noMarker && unreadHint > 0) {
            buffer.lastReadKey = guessLastRead(buffer.lines, unreadHint);
        }
        buffer.linesFetched = true;
        if (draft.activeBufferId !== bufferId) {
            // fetched for a buffer left meanwhile
            trimLines(buffer);
        }
        // Show a date change before today's first message
        const last = buffer.lines[buffer.lines.length - 1];
        if (last && startOfDay(last.date) !== startOfDay(new Date())) {
            const now = new Date();
            buffer.lines.push(dateChangeLine(last.date, now, 'dtoday') as Draft<Line>);
        }
    });
}

/*
 * Buffers
 */

function addBuffer(draft: Draft<ChatState>, api: ApiBuffer): Draft<Buffer> {
    const buffer = createBuffer(api) as Draft<Buffer>;
    draft.buffers[api.id] = buffer;
    return buffer;
}

/** Response of GET /api/buffers: the complete list of buffers */
export function applyBuffers(state: ChatState, apiBuffers: ApiBuffer[]): ChatState {
    return produce(state, (draft) => {
        const ids = new Set(apiBuffers.map((b) => b.id));
        for (const id of Object.keys(draft.buffers).map(Number)) {
            if (!ids.has(id)) {
                delete draft.buffers[id];
            }
        }
        for (const api of apiBuffers) {
            const buffer = draft.buffers[api.id];
            if (buffer) {
                Object.assign(buffer, bufferProperties(api));
            } else {
                addBuffer(draft, api);
            }
        }
        if (draft.activeBufferId !== null && !draft.buffers[draft.activeBufferId]) {
            draft.activeBufferId = null;
        }
    });
}

/** Response of GET /api/hotlist */
export function applyHotlist(state: ChatState, hotlist: ApiHotlist[]): ChatState {
    return produce(state, (draft) => {
        // The active buffer may be in WeeChat's hotlist if it's not the
        // current buffer in WeeChat: ignore it, and keep the lines it counted
        // while the window was not focused
        const others = Object.values(draft.buffers).filter(
            (b) => b.id !== draft.activeBufferId,
        );
        // The hotlist only has buffers with unread lines: reset the others
        for (const buffer of others) {
            clearCounts(buffer);
        }
        for (const entry of hotlist) {
            const buffer = draft.buffers[entry.buffer_id];
            if (!buffer || buffer.id === draft.activeBufferId) {
                continue;
            }
            // count: low, message, private, highlight
            buffer.activityAt = Date.parse(entry.date) || 0;
            buffer.unread = entry.count[1];
            buffer.notification = entry.count[2] + entry.count[3];
        }
    });
}

function fillNicklist(buffer: Draft<Buffer>, root: ApiNickGroup): void {
    const spokeAt = new Map(
        Object.values(buffer.nicks).map((n) => [n.name, n.spokeAt]),
    );
    buffer.nickGroups = {};
    buffer.nicks = {};
    const add = (group: ApiNickGroup) => {
        buffer.nickGroups[group.id] = createNickGroup(group);
        for (const api of group.nicks ?? []) {
            const nick = createNick(api);
            nick.spokeAt = spokeAt.get(nick.name) ?? 0;
            buffer.nicks[nick.id] = nick;
        }
        for (const sub of group.groups ?? []) {
            add(sub);
        }
    };
    add(root);
    buffer.nicklistLoaded = true;
}

/** Response of GET /api/buffers/{id}/nicks */
export function applyNicklist(
    state: ChatState,
    bufferId: number,
    root: ApiNickGroup,
): ChatState {
    return produce(state, (draft) => {
        const buffer = draft.buffers[bufferId];
        if (buffer) {
            fillNicklist(buffer, root);
        }
    });
}

/** The buffer shown */
export const activeBuffer = (state: ChatState): Buffer | undefined =>
    state.activeBufferId !== null ? state.buffers[state.activeBufferId] : undefined;

/**
 * Switch to a buffer. The previous one remembers its last line as read.
 */
export function setActiveBuffer(state: ChatState, bufferId: number): ChatState {
    if (!state.buffers[bufferId] || state.activeBufferId === bufferId) {
        return state;
    }
    return produce(state, (draft) => {
        const previous =
            draft.activeBufferId !== null
                ? draft.buffers[draft.activeBufferId]
                : undefined;
        if (previous) {
            const last = previous.lines.findLast((l) => !l.isDateChange);
            previous.lastReadKey = last ? last.key : null;
            draft.previousBufferId = previous.id;
            trimLines(previous);
        }
        clearCounts(draft.buffers[bufferId]);
        draft.activeBufferId = bufferId;
    });
}

/** Lines of a buffer are being fetched, or no more */
export function setLoadingLines(
    state: ChatState,
    bufferId: number,
    loading: boolean,
): ChatState {
    return produce(state, (draft) => {
        const buffer = draft.buffers[bufferId];
        if (buffer) {
            buffer.loadingLines = loading;
        }
    });
}

/** Clear the unread counters of a buffer (e.g. when the window gets focus) */
export function markRead(state: ChatState, bufferId: number): ChatState {
    return produce(state, (draft) => {
        const buffer = draft.buffers[bufferId];
        if (buffer) {
            clearCounts(buffer);
        }
    });
}

/** Clear the unread counters of all buffers */
export function markAllRead(state: ChatState): ChatState {
    return produce(state, (draft) => {
        for (const buffer of Object.values(draft.buffers)) {
            clearCounts(buffer);
        }
    });
}

/*
 * Events pushed by WeeChat
 */

type EventHandler = (
    draft: Draft<ChatState>,
    event: ApiEvent,
    ctx: EventContext,
    effects: Effect[],
) => void;

const eventBuffer = (
    draft: Draft<ChatState>,
    event: ApiEvent,
): Draft<Buffer> | undefined => draft.buffers[event.buffer_id];

function clearCounts(buffer: Draft<Buffer>): void {
    buffer.unread = 0;
    buffer.notification = 0;
}

function resetLines(buffer: Draft<Buffer>): void {
    buffer.lines = [];
    buffer.requestedLines = 0;
    buffer.linesFetched = false;
    buffer.lastReadKey = null;
}

/** Switch to buffers we opened ourselves (/query, /join) */
function checkOutgoingQuery(
    draft: Draft<ChatState>,
    buffer: Draft<Buffer>,
    effects: Effect[],
): void {
    const now = Date.now();
    draft.outgoingQueries = draft.outgoingQueries.filter((q) => q.expires > now);
    const name = buffer.shortName.toLowerCase();
    const index = draft.outgoingQueries.findIndex((q) => q.name.toLowerCase() === name);
    if (name && index >= 0) {
        draft.outgoingQueries.splice(index, 1);
        effects.push({ type: 'activate', bufferId: buffer.id });
    }
}

/** The body of the event is the buffer: update its properties */
const bufferChanged: EventHandler = (draft, event, _ctx, effects) => {
    const buffer = eventBuffer(draft, event);
    if (buffer && event.body) {
        const wasFree = buffer.free;
        Object.assign(buffer, bufferProperties(event.body as ApiBuffer));
        if (buffer.free !== wasFree) {
            // Lines are addressed differently (y instead of id): reload them
            resetLines(buffer);
            buffer.allLinesFetched = false;
            if (draft.activeBufferId === buffer.id) {
                // (activating the buffer shown fetches its lines)
                effects.push({ type: 'activate', bufferId: buffer.id });
            }
        }
    }
};

const bufferOpened: EventHandler = (draft, event, ctx, effects) => {
    const api = event.body as ApiBuffer;
    if (!api || draft.buffers[api.id]) {
        return;
    }
    const buffer = addBuffer(draft, api);
    for (const line of api.lines ?? []) {
        addNewLine(draft, buffer, line, ctx, []);
    }
    if (api.nicklist_root) {
        fillNicklist(buffer, api.nicklist_root);
    }
    checkOutgoingQuery(draft, buffer, effects);
};

const bufferRenamed: EventHandler = (draft, event, ctx, effects) => {
    bufferChanged(draft, event, ctx, effects);
    const buffer = eventBuffer(draft, event);
    if (buffer) {
        checkOutgoingQuery(draft, buffer, effects);
    }
};

const bufferCleared: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (buffer) {
        resetLines(buffer);
        buffer.allLinesFetched = true;
    }
};

const bufferClosed: EventHandler = (draft, event, _ctx, effects) => {
    delete draft.buffers[event.buffer_id];
    if (draft.previousBufferId === event.buffer_id) {
        draft.previousBufferId = null;
    }
    if (draft.activeBufferId === event.buffer_id) {
        // Switch to the previous buffer, else the visible one with the lowest
        // number (activated by the session, which loads its lines)
        draft.activeBufferId = null;
        const previous =
            draft.previousBufferId !== null
                ? draft.buffers[draft.previousBufferId]
                : undefined;
        const next =
            previous ??
            Object.values(draft.buffers)
                .filter((b) => !b.hidden)
                .sort((a, b) => a.number - b.number)[0];
        draft.previousBufferId = null;
        if (next) {
            effects.push({ type: 'activate', bufferId: next.id });
        }
    }
};

const lineAdded: EventHandler = (draft, event, ctx, effects) => {
    const buffer = eventBuffer(draft, event);
    if (buffer && event.body) {
        addNewLine(draft, buffer, event.body as ApiLine, ctx, effects);
    }
};

const lineDataChanged: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (!buffer || !event.body) {
        return;
    }
    const line = createLine(event.body as ApiLine, buffer.free);
    if (buffer.free) {
        setFreeLine(buffer, line);
        return;
    }
    const index = buffer.lines.findIndex((l) => l.key === line.key);
    if (index >= 0) {
        if (line.displayed) {
            buffer.lines[index] = line as Draft<Line>;
        } else {
            // filtered
            buffer.lines.splice(index, 1);
        }
    } else if (
        line.displayed &&
        buffer.lines.some((l) => !l.isDateChange && l.id < line.id)
    ) {
        // A line hidden by a filter is displayed: insert it among the loaded
        // ones (ids grow with time), before the date change of the next one
        let next = buffer.lines.findIndex((l) => !l.isDateChange && l.id > line.id);
        if (next === -1) {
            next = buffer.lines.length;
        } else if (buffer.lines[next - 1]?.isDateChange) {
            next--;
        }
        buffer.lines.splice(next, 0, line as Draft<Line>);
    }
};

const nickGroupAdded: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (!buffer?.nicklistLoaded || !event.body) {
        return;
    }
    const group = createNickGroup(event.body as ApiNickGroup);
    buffer.nickGroups[group.id] = group;
};

const nickGroupChanged: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    const api = event.body as ApiNickGroup | null;
    if (!buffer?.nicklistLoaded || !api || !buffer.nickGroups[api.id]) {
        return;
    }
    buffer.nickGroups[api.id] = createNickGroup(api);
};

const nickGroupRemoving: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    const api = event.body as ApiNickGroup | null;
    if (!buffer?.nicklistLoaded || !api) {
        return;
    }
    // Remove the group with its sub-groups and their nicks
    const removed = new Set([api.id]);
    let found = true;
    while (found) {
        found = false;
        for (const group of Object.values(buffer.nickGroups)) {
            if (!removed.has(group.id) && removed.has(group.parentId)) {
                removed.add(group.id);
                found = true;
            }
        }
    }
    for (const id of removed) {
        delete buffer.nickGroups[id];
    }
    for (const nick of Object.values(buffer.nicks)) {
        if (removed.has(nick.groupId)) {
            delete buffer.nicks[nick.id];
        }
    }
};

const nickAdded: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (!buffer?.nicklistLoaded || !event.body) {
        return;
    }
    const nick = createNick(event.body as ApiNick);
    nick.spokeAt = Date.now();
    buffer.nicks[nick.id] = nick;
};

const nickChanged: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (!buffer?.nicklistLoaded || !event.body) {
        return;
    }
    const nick = createNick(event.body as ApiNick);
    nick.spokeAt = buffer.nicks[nick.id]?.spokeAt ?? 0;
    buffer.nicks[nick.id] = nick;
};

const nickRemoving: EventHandler = (draft, event) => {
    const buffer = eventBuffer(draft, event);
    if (!buffer?.nicklistLoaded || !event.body) {
        return;
    }
    delete buffer.nicks[(event.body as ApiNick).id];
};

const EVENT_HANDLERS: Record<string, EventHandler> = {
    buffer_opened: bufferOpened,
    buffer_type_changed: bufferChanged,
    // WeeChat sends this event for every buffer whose number changed
    buffer_moved: bufferChanged,
    buffer_merged: bufferChanged,
    buffer_unmerged: bufferChanged,
    buffer_hidden: bufferChanged,
    buffer_unhidden: bufferChanged,
    buffer_renamed: bufferRenamed,
    buffer_title_changed: bufferChanged,
    buffer_modes_changed: bufferChanged,
    buffer_time_for_each_line_changed: bufferChanged,
    buffer_localvar_added: bufferChanged,
    buffer_localvar_changed: bufferChanged,
    buffer_localvar_removed: bufferChanged,
    buffer_cleared: bufferCleared,
    buffer_closing: bufferChanged,
    buffer_closed: bufferClosed,
    buffer_line_added: lineAdded,
    buffer_line_data_changed: lineDataChanged,
    input_prompt_changed: bufferChanged,
    input_text_changed: bufferChanged,
    input_text_cursor_moved: bufferChanged,
    nicklist_group_added: nickGroupAdded,
    nicklist_group_changed: nickGroupChanged,
    nicklist_group_removing: nickGroupRemoving,
    nicklist_nick_added: nickAdded,
    nicklist_nick_changed: nickChanged,
    nicklist_nick_removing: nickRemoving,
    upgrade: (draft, _event, _ctx, effects) => {
        draft.upgrading = true;
        effects.push({ type: 'upgrade' });
    },
    // Not received in practice: the upgrade event drops the connection, and
    // the reconnection reloads everything
    upgrade_ended: (draft) => {
        draft.upgrading = false;
    },
    quit: (draft) => {
        draft.quitting = true;
    },
};

/** Names of all the events handled */
export const HANDLED_EVENTS = Object.keys(EVENT_HANDLERS);

/** Apply an event pushed by WeeChat */
export function applyEvent(
    state: ChatState,
    event: ApiEvent,
    ctx: EventContext,
): Result {
    const handler = EVENT_HANDLERS[event.event_name];
    const effects: Effect[] = [];
    if (!handler) {
        return { state, effects };
    }
    const next = produce(state, (draft) => handler(draft, event, ctx, effects));
    return { state: next, effects };
}
