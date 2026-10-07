/*
 * Relay objects for tests.
 */
import type { ApiBuffer, ApiLine, ApiNick } from '../relay/types';

export const apiBuffer = (
    id: number,
    number: number,
    name: string,
    shortName: string,
    extra: Partial<ApiBuffer> = {},
): ApiBuffer => ({
    id,
    name,
    short_name: shortName,
    number,
    type: 'formatted',
    hidden: false,
    title: 'Title of ' + name,
    modes: '',
    input_prompt: '',
    input: '',
    input_position: 0,
    input_multiline: false,
    nicklist: true,
    nicklist_case_sensitive: false,
    nicklist_display_groups: false,
    time_displayed: true,
    local_variables: { plugin: 'irc', type: 'channel', server: 'libera' },
    keys: [],
    last_read_line_id: -1,
    ...extra,
});

export const apiLine = (
    id: number,
    message: string,
    extra: Partial<ApiLine> = {},
): ApiLine => ({
    id,
    y: -1,
    date: '2024-01-07T08:54:00.179483Z',
    date_printed: '2024-01-07T08:54:00.179483Z',
    displayed: true,
    highlight: false,
    notify_level: 1,
    prefix: 'alice',
    message,
    tags: ['irc_privmsg', 'nick_alice', 'log1'],
    ...extra,
});

export const apiNick = (id: number, groupId: number, name: string): ApiNick => ({
    id,
    parent_group_id: groupId,
    prefix: '@',
    prefix_color_name: 'lightgreen',
    prefix_color: '',
    name,
    color_name: 'bar_fg',
    color: '',
    visible: true,
});
