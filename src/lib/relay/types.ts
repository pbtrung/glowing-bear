/*
 * Objects of the WeeChat relay "api" protocol.
 * https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html
 */

export type HashAlgo =
    'plain' | 'sha256' | 'sha512' | 'pbkdf2+sha256' | 'pbkdf2+sha512';

export type ColorsMode = 'ansi' | 'weechat' | 'strip';

/** POST /api/handshake */
export interface ApiHandshake {
    password_hash_algo: HashAlgo | null;
    password_hash_iterations: number;
    totp: boolean;
}

/** GET /api/version */
export interface ApiVersion {
    weechat_version: string;
    weechat_version_git: string;
    weechat_version_number: number;
    relay_api_version: string;
    relay_api_version_number: number;
}

export interface ApiKey {
    key: string;
    command: string;
}

/** A line of a buffer */
export interface ApiLine {
    id: number;
    /** Line index in buffers with free content, -1 otherwise */
    y: number;
    /** ISO 8601 date (UTC) */
    date: string;
    date_printed: string;
    displayed: boolean;
    highlight: boolean;
    /** -1: none, 0: low, 1: message, 2: private, 3: highlight */
    notify_level: number;
    prefix: string;
    message: string;
    tags: string[];
}

export interface ApiNick {
    id: number;
    parent_group_id: number;
    prefix: string;
    prefix_color_name: string;
    prefix_color: string;
    name: string;
    color_name: string;
    color: string;
    visible: boolean;
}

export interface ApiNickGroup {
    id: number;
    parent_group_id: number;
    name: string;
    color_name: string;
    color: string;
    visible: boolean;
    groups: ApiNickGroup[];
    nicks: ApiNick[];
}

/** A buffer (GET /api/buffers, buffer_* events) */
export interface ApiBuffer {
    id: number;
    name: string;
    short_name: string;
    number: number;
    type: 'formatted' | 'free';
    /** Notify level: "none", "highlight", "message" or "all" (newer WeeChat) */
    notify?: string;
    hidden: boolean;
    title: string;
    modes: string;
    input_prompt: string;
    input: string;
    input_position: number;
    input_multiline: boolean;
    nicklist: boolean;
    nicklist_case_sensitive: boolean;
    nicklist_display_groups: boolean;
    time_displayed: boolean;
    prefix_displayed?: boolean;
    day_change?: boolean;
    local_variables: Record<string, string>;
    keys: ApiKey[];
    /** Id of the last line read, -1 if there is no read marker */
    last_read_line_id?: number;
    lines?: ApiLine[];
    nicklist_root?: ApiNickGroup;
}

/** GET /api/hotlist */
export interface ApiHotlist {
    priority: number;
    date: string;
    buffer_id: number;
    /** Counts per level: low, message, private, highlight */
    count: [number, number, number, number];
}

/** GET /api/scripts */
export interface ApiScript {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
}

/** POST /api/completion */
export interface ApiCompletion {
    context: 'null' | 'command' | 'command_arg' | 'auto';
    base_word: string;
    position_replace: number;
    add_space: boolean;
    list: string[];
}

/** GET /api/options/{name} (WeeChat > 4.10) */
export interface ApiOption {
    name: string;
    type: string;
    value: string | number | boolean | null;
    default_value: string | number | boolean | null;
    description: string;
}

export interface ApiPing {
    data: string;
}

/** Response to a request sent on the WebSocket */
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    request: string;
    request_body: unknown;
    request_id: string | null;
    body_type: string | null;
    body: T;
}

export type EventName =
    | 'buffer_opened'
    | 'buffer_type_changed'
    | 'buffer_moved'
    | 'buffer_merged'
    | 'buffer_unmerged'
    | 'buffer_hidden'
    | 'buffer_unhidden'
    | 'buffer_renamed'
    | 'buffer_title_changed'
    | 'buffer_modes_changed'
    | 'buffer_notify_changed'
    | 'buffer_time_for_each_line_changed'
    | 'buffer_prefix_for_each_line_changed'
    | 'buffer_day_change_changed'
    | 'buffer_localvar_added'
    | 'buffer_localvar_changed'
    | 'buffer_localvar_removed'
    | 'buffer_cleared'
    | 'buffer_closing'
    | 'buffer_closed'
    | 'buffer_line_added'
    | 'buffer_line_data_changed'
    | 'input_prompt_changed'
    | 'input_text_changed'
    | 'input_text_cursor_moved'
    | 'nicklist_group_added'
    | 'nicklist_group_changed'
    | 'nicklist_group_removing'
    | 'nicklist_nick_added'
    | 'nicklist_nick_changed'
    | 'nicklist_nick_removing'
    | 'upgrade'
    | 'upgrade_ended'
    | 'quit'
    | 'day_changed';

/** Event pushed by WeeChat once synchronization is enabled (code 0) */
export interface ApiEvent {
    code: 0;
    message: 'Event';
    event_name: EventName | string;
    /** Buffer id, -1 for events not related to a buffer */
    buffer_id: number;
    body_type: string | null;
    body: ApiBuffer | ApiLine | ApiNick | ApiNickGroup | null;
}
