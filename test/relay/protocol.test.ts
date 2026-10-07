/*
 * Compliance of the client with the WeeChat relay "api" protocol, against a
 * real WeeChat: authentication, every resource, every event.
 * https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html
 *
 * The tests run in order: /upgrade and /quit come last.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RelayClient, RequestError } from '../../src/lib/relay/client';
import type {
    ApiBuffer,
    ApiLine,
    ApiNick,
    ApiNickGroup,
} from '../../src/lib/relay/types';
import { Session } from '../../src/lib/state/session';
import { connect, relayOptions, sleep, until, type Connection } from './helpers';

const BUFFER_KEYS = [
    'id',
    'name',
    'short_name',
    'number',
    'type',
    'hidden',
    'title',
    'modes',
    'input_prompt',
    'input',
    'input_position',
    'input_multiline',
    'nicklist',
    'nicklist_case_sensitive',
    'nicklist_display_groups',
    'time_displayed',
    'local_variables',
    'keys',
];
const LINE_KEYS = [
    'id',
    'y',
    'date',
    'date_printed',
    'displayed',
    'highlight',
    'notify_level',
    'prefix',
    'message',
    'tags',
];
const NICK_KEYS = [
    'id',
    'parent_group_id',
    'prefix',
    'prefix_color_name',
    'prefix_color',
    'name',
    'color_name',
    'color',
    'visible',
];
const GROUP_KEYS = [
    'id',
    'parent_group_id',
    'name',
    'color_name',
    'color',
    'visible',
    'groups',
    'nicks',
];

const ISO_DATE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/;

let admin: Connection;

beforeAll(async () => {
    admin = await connect();
});

afterAll(() => {
    admin?.client.close();
});

describe('authentication', () => {
    const algos = ['plain', 'sha256', 'sha512', 'pbkdf2+sha256', 'pbkdf2+sha512'];

    it.each(algos)('connects with password hash algorithm %s', async (algo) => {
        await admin.weechat(`/set relay.network.password_hash_algo "${algo}"`);
        try {
            const c = await connect();
            expect((await c.api.version()).weechat_version).toMatch(/^\d+\.\d+/);
            c.client.close();
        } finally {
            await admin.weechat('/unset relay.network.password_hash_algo');
        }
    });

    it('negotiates the strongest algorithm', async () => {
        const urls = {
            http: `http://${relayOptions().host}:${relayOptions().port}/api`,
            ws: '',
        };
        const handshake = await RelayClient.handshake(urls);
        expect(handshake).toEqual({
            password_hash_algo: 'pbkdf2+sha512',
            password_hash_iterations: expect.any(Number),
            totp: false,
        });
    });

    it('reports a wrong password', async () => {
        await expect(connect({ password: 'wrong' })).rejects.toMatchObject({
            kind: 'auth',
            message: 'Wrong password.',
        });
    });

    it('reports a hashed password that is too old', async () => {
        // A timestamp outside relay.network.time_window is refused: check the
        // error message by sending such credentials ourselves
        const { base64 } = await import('../../src/lib/relay/auth');
        const { buildCredentials } = await import('../../src/lib/relay/auth');
        const options = relayOptions();
        const creds = await buildCredentials(options.password, 'sha256', 0, 1000000000);
        const response = await fetch(
            `http://${options.host}:${options.port}/api/version`,
            {
                headers: { Authorization: 'Basic ' + base64(creds) },
            },
        );
        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Invalid timestamp' });
    });

    it('refuses TOTP, which browsers cannot send on a WebSocket', async () => {
        await admin.weechat('/set relay.network.totp_secret "SECRETBASE32SECRET"');
        try {
            await expect(connect()).rejects.toMatchObject({ kind: 'totp' });
        } finally {
            await admin.weechat('/unset relay.network.totp_secret');
        }
    });
});

describe('resources', () => {
    let gbtest: ApiBuffer;

    beforeAll(async () => {
        gbtest = await admin.api.buffer('python.gbtest');
    });

    it('GET /api/version', async () => {
        const version = await admin.api.version();
        expect(version).toEqual({
            weechat_version: expect.stringMatching(/^\d+\.\d+/),
            weechat_version_git: expect.any(String),
            weechat_version_number: expect.any(Number),
            relay_api_version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
            relay_api_version_number: expect.any(Number),
        });
    });

    it('GET /api/buffers', async () => {
        const buffers = await admin.api.buffers();
        expect(buffers.length).toBeGreaterThanOrEqual(2);
        for (const buffer of buffers) {
            for (const key of BUFFER_KEYS) {
                expect(buffer).toHaveProperty(key);
            }
            expect(buffer.lines).toBeUndefined();
        }
        const core = buffers.find((b) => b.name === 'core.weechat');
        expect(core?.number).toBe(1);
        expect(core?.type).toBe('formatted');
    });

    it('GET /api/buffers with lines, nicks and colors', async () => {
        const buffers = await admin.api.buffers({
            lines: -2,
            nicks: true,
            colors: 'strip',
        });
        const buffer = buffers.find((b) => b.id === gbtest.id)!;
        expect(buffer.lines).toHaveLength(2);
        expect(buffer.nicklist_root?.name).toBe('root');
    });

    it('GET /api/buffers/{id} and /api/buffers/{name}', async () => {
        const byId = await admin.api.buffer(gbtest.id);
        const byName = await admin.api.buffer('python.gbtest');
        expect(byId.name).toBe('python.gbtest');
        expect(byName.id).toBe(gbtest.id);
        expect(byId.short_name).toBe('#gbtest');
        expect(byId.local_variables).toMatchObject({
            type: 'channel',
            server: 'gbnet',
        });
        // Buffer names are URL encoded
        await admin.weechat('/buffer add #enc');
        expect((await admin.api.buffer('core.#enc')).name).toBe('core.#enc');
        await admin.weechat('/buffer close core.#enc');
    });

    it('returns 404 for unknown buffers', async () => {
        const error = await admin.api.buffer('no.such.buffer').catch((e) => e);
        expect(error).toBeInstanceOf(RequestError);
        expect(error.response.code).toBe(404);
    });

    it('GET /api/buffers/{id}/lines: newest, oldest, all', async () => {
        const newest = await admin.api.lines(gbtest.id, -3, 'strip');
        expect(newest).toHaveLength(3);
        for (const line of newest) {
            for (const key of LINE_KEYS) {
                expect(line).toHaveProperty(key);
            }
            expect(line.date).toMatch(ISO_DATE);
        }
        // Oldest first
        expect(newest[0].id).toBeLessThan(newest[2].id);
        const oldest = await admin.api.lines(gbtest.id, 2, 'strip');
        expect(oldest.map((l) => l.message)).toEqual([
            'history line 0',
            'history line 1',
        ]);
        const all = await admin.api.lines(gbtest.id, undefined, 'strip');
        expect(all.length).toBeGreaterThanOrEqual(40);
    });

    it('GET /api/buffers/{id}/lines/{line_id}', async () => {
        const [last] = await admin.api.lines(gbtest.id, -1, 'strip');
        const line = await admin.api.line(gbtest.id, last.id, 'strip');
        expect(line).toEqual(last);
    });

    it('returns colors as WeeChat codes, ANSI or stripped', async () => {
        await admin.weechat('/gbtest color');
        const [weechat] = await admin.api.lines(gbtest.id, -1, 'weechat');
        const [ansi] = await admin.api.lines(gbtest.id, -1, 'ansi');
        const [strip] = await admin.api.lines(gbtest.id, -1, 'strip');
        expect(weechat.message).toContain('\x19');
        expect(ansi.message).toContain('\x1b[');
        expect(strip.message).toBe('normal green bold back');
    });

    it('GET /api/buffers/{id}/nicks', async () => {
        const root = await admin.api.nicks(gbtest.id, 'weechat');
        expect(Object.keys(root).sort()).toEqual([...GROUP_KEYS].sort());
        expect(root).toMatchObject({ id: 0, parent_group_id: -1, name: 'root' });
        const ops = root.groups.find((g) => g.name === '000|o')!;
        expect(Object.keys(ops.nicks[0]).sort()).toEqual([...NICK_KEYS].sort());
        expect(ops.nicks[0]).toMatchObject({
            name: 'alice',
            prefix: '@',
            prefix_color_name: 'lightgreen',
            color_name: 'cyan',
            parent_group_id: ops.id,
        });
    });

    it('GET /api/hotlist', async () => {
        await admin.weechat('/gbtest say alice hotlist line');
        const hotlist = await admin.api.hotlist();
        const entry = hotlist.find((h) => h.buffer_id === gbtest.id);
        expect(entry).toEqual({
            priority: expect.any(Number),
            date: expect.stringMatching(ISO_DATE),
            buffer_id: gbtest.id,
            count: [
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
            ],
        });
        expect(entry!.count[1]).toBeGreaterThan(0);
    });

    it('GET /api/scripts', async () => {
        const scripts = await admin.api.scripts();
        expect(scripts).toContainEqual({
            name: 'gbtest.py',
            version: '1.0',
            description: 'Glowing Bear test fixtures',
            author: 'glowing-bear',
            license: 'GPL3',
        });
    });

    it('GET /api/options/{name} (or 404 on WeeChat <= 4.10)', async () => {
        try {
            const option = await admin.api.option('weechat.look.buffer_time_format');
            expect(option).toMatchObject({
                name: 'weechat.look.buffer_time_format',
                type: 'string',
            });
            expect(typeof option.value).toBe('string');
        } catch (e) {
            expect(e).toBeInstanceOf(RequestError);
            expect((e as RequestError).response.code).toBe(404);
        }
    });

    it('POST /api/input, by buffer id and by name', async () => {
        await admin.weechat('/print input by id', gbtest.id);
        await admin.weechat('/print input by name', 'python.gbtest');
        const lines = await admin.api.lines(gbtest.id, -2, 'strip');
        expect(lines.map((l) => l.message)).toEqual(['input by id', 'input by name']);
    });

    it('POST /api/completion', async () => {
        const completion = await admin.api.completion('/hel', gbtest.id, 4);
        expect(completion).toEqual({
            context: 'command',
            base_word: 'hel',
            position_replace: 1,
            add_space: true,
            list: ['help'],
        });
        // Nicks at the beginning of the input come with the nick completer
        const nicks = await admin.api.completion('al', gbtest.id, 2);
        expect(nicks.list).toContain('alice: ');
    });

    it('POST /api/ping, with and without data', async () => {
        expect(await admin.api.ping('1702835741')).toBe('1702835741');
        expect(await admin.api.ping()).toBeNull();
    });

    it('rejects requests to unknown resources', async () => {
        const error = await admin.client.request('GET', '/api/nothing').catch((e) => e);
        expect(error).toBeInstanceOf(RequestError);
        expect(error.response.code).toBe(404);
    });

    it('answers pipelined requests', async () => {
        const [version, ping] = await Promise.all([
            admin.client.request('GET', '/api/version'),
            admin.client.request('POST', '/api/ping', { data: 'pipelined' }),
        ]);
        expect(version.body_type).toBe('version');
        expect(ping.body).toEqual({ data: 'pipelined' });
    });

    it('answers batched requests (a JSON array in one frame)', async () => {
        const [version, ping, error] = await Promise.all(
            admin.client.batch(() => [
                admin.client.request('GET', '/api/version'),
                admin.client.request('POST', '/api/ping', { data: 'batch' }),
                admin.client.request('GET', '/api/nothing').catch((e) => e),
            ]),
        );
        expect(version.body_type).toBe('version');
        expect(ping.body).toEqual({ data: 'batch' });
        expect(error).toBeInstanceOf(RequestError);
        expect(error.response.code).toBe(404);
    });
});

describe('events', () => {
    let c: Connection;
    let bufferId: number;

    beforeAll(async () => {
        c = await connect();
        await c.api.sync({ sync: true, nicks: true, input: true, colors: 'weechat' });
    });

    afterAll(() => c?.client.close());

    async function expectEvent(
        command: string,
        name: string,
        buffer: number | string = 'core.weechat',
    ) {
        c.mark();
        const waiting = c.waitEvent(
            name,
            (e) =>
                bufferId === undefined ||
                e.buffer_id === bufferId ||
                e.buffer_id === -1,
        );
        await c.weechat(command, buffer);
        return waiting;
    }

    it('buffer_opened (with lines and nicks)', async () => {
        c.mark();
        const waiting = c.waitEvent(
            'buffer_opened',
            (e) => (e.body as ApiBuffer).name === 'core.gbevents',
        );
        await c.weechat('/buffer add gbevents');
        const event = await waiting;
        bufferId = event.buffer_id;
        expect(event.body_type).toBe('buffer');
        const body = event.body as ApiBuffer;
        expect(body.id).toBe(bufferId);
        for (const key of BUFFER_KEYS) {
            expect(body).toHaveProperty(key);
        }
        expect(body.lines).toEqual([]);
    });

    it('buffer_line_added', async () => {
        const event = await expectEvent(
            '/print -buffer core.gbevents hello \x02world',
            'buffer_line_added',
        );
        expect(event.body_type).toBe('line');
        const line = event.body as ApiLine;
        expect(Object.keys(line).sort()).toEqual([...LINE_KEYS].sort());
        expect(line.message).toContain('hello');
    });

    it('buffer_title_changed', async () => {
        const event = await expectEvent(
            '/buffer set title New title',
            'buffer_title_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).title).toBe('New title');
    });

    it('buffer_renamed', async () => {
        const event = await expectEvent(
            '/buffer set short_name evts',
            'buffer_renamed',
            bufferId,
        );
        expect((event.body as ApiBuffer).short_name).toBe('evts');
    });

    it('buffer_localvar_added, buffer_localvar_changed, buffer_localvar_removed', async () => {
        let event = await expectEvent(
            '/buffer setvar gbvar one',
            'buffer_localvar_added',
            bufferId,
        );
        expect((event.body as ApiBuffer).local_variables.gbvar).toBe('one');
        event = await expectEvent(
            '/buffer setvar gbvar two',
            'buffer_localvar_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).local_variables.gbvar).toBe('two');
        event = await expectEvent(
            '/buffer delvar gbvar',
            'buffer_localvar_removed',
            bufferId,
        );
        expect((event.body as ApiBuffer).local_variables.gbvar).toBeUndefined();
    });

    it('buffer_hidden, buffer_unhidden', async () => {
        expect(
            (
                (await expectEvent('/buffer hide', 'buffer_hidden', bufferId))
                    .body as ApiBuffer
            ).hidden,
        ).toBe(true);
        expect(
            (
                (await expectEvent('/buffer unhide', 'buffer_unhidden', bufferId))
                    .body as ApiBuffer
            ).hidden,
        ).toBe(false);
    });

    it('buffer_moved', async () => {
        const event = await expectEvent('/buffer move 1', 'buffer_moved', bufferId);
        expect((event.body as ApiBuffer).number).toBe(1);
        // "+" moves to the end
        await expectEvent('/buffer move +', 'buffer_moved', bufferId);
    });

    it('buffer_merged, buffer_unmerged', async () => {
        await expectEvent('/buffer merge core.weechat', 'buffer_merged', bufferId);
        await expectEvent('/buffer unmerge', 'buffer_unmerged', bufferId);
    });

    // Sent by relay API >= 0.7.0 (newer than WeeChat 4.10), as
    // buffer_prefix_for_each_line_changed and buffer_day_change_changed
    it('buffer_notify_changed (relay API >= 0.7.0)', async (ctx) => {
        const version = await c.api.version();
        if (version.relay_api_version_number < 0x000700) {
            ctx.skip();
        }
        const event = await expectEvent(
            '/buffer set notify highlight',
            'buffer_notify_changed',
            bufferId,
        );
        expect(event.body_type).toBe('buffer');
    });

    it('buffer_modes_changed', async () => {
        const event = await expectEvent(
            '/buffer set modes +nt',
            'buffer_modes_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).modes).toBe('+nt');
    });

    it('buffer_time_for_each_line_changed', async () => {
        const event = await expectEvent(
            '/buffer set time_for_each_line 0',
            'buffer_time_for_each_line_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).time_displayed).toBe(false);
    });

    it('input_prompt_changed', async () => {
        const event = await expectEvent(
            '/buffer set input_prompt >>',
            'input_prompt_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).input_prompt).toContain('>>');
    });

    it('input_text_changed, input_text_cursor_moved (sync with input)', async () => {
        let event = await expectEvent(
            '/input insert some text',
            'input_text_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).input).toBe('some text');
        event = await expectEvent(
            '/input move_beginning_of_line',
            'input_text_cursor_moved',
            bufferId,
        );
        expect((event.body as ApiBuffer).input_position).toBe(0);
        await c.weechat('/input delete_line', bufferId);
    });

    it('buffer_cleared', async () => {
        const event = await expectEvent('/buffer clear', 'buffer_cleared', bufferId);
        expect(event.body_type).toBe('buffer');
    });

    it('buffer_type_changed, and lines of free buffers', async () => {
        const event = await expectEvent(
            '/buffer set type free',
            'buffer_type_changed',
            bufferId,
        );
        expect((event.body as ApiBuffer).type).toBe('free');
        const added = await expectEvent(
            '/print -buffer core.gbevents -y 0 first',
            'buffer_line_added',
        );
        expect((added.body as ApiLine).y).toBe(0);
        // Printing again on a line of a free buffer replaces it: the event
        // has the same y
        const replaced = await expectEvent(
            '/print -buffer core.gbevents -y 0 replaced',
            'buffer_line_added',
        );
        expect((replaced.body as ApiLine).y).toBe(0);
        expect((replaced.body as ApiLine).message).toBe('replaced');
    });

    it('buffer_line_data_changed', async () => {
        const gbtest = (await c.api.buffer('python.gbtest')).id;
        await c.weechat('/gbtest say alice before edit');
        const [line] = await c.api.lines(gbtest, -1, 'strip');
        c.mark();
        const waiting = c.waitEvent(
            'buffer_line_data_changed',
            (e) => e.buffer_id === gbtest,
        );
        await c.weechat('/gbtest edit after edit');
        const event = await waiting;
        expect(event.body_type).toBe('line');
        expect((event.body as ApiLine).id).toBe(line.id);
        expect((event.body as ApiLine).message).toBe('after edit');
    });

    it('buffer_closing, buffer_closed', async () => {
        c.mark();
        const closing = c.waitEvent('buffer_closing', (e) => e.buffer_id === bufferId);
        const closed = c.waitEvent('buffer_closed', (e) => e.buffer_id === bufferId);
        await c.weechat('/buffer close core.gbevents');
        expect((await closing).body_type).toBe('buffer');
        const event = await closed;
        expect(event.body_type).toBeNull();
        expect(event.body).toBeNull();
    });

    describe('nicklist', () => {
        let gbtest: number;

        beforeAll(async () => {
            gbtest = (await c.api.buffer('python.gbtest')).id;
        });

        async function nickEvent(command: string, name: string) {
            c.mark();
            const waiting = c.waitEvent(name, (e) => e.buffer_id === gbtest);
            await c.weechat(command);
            return waiting;
        }

        it('nicklist_nick_added, nicklist_nick_changed, nicklist_nick_removing', async () => {
            let event = await nickEvent('/gbtest nick add bob', 'nicklist_nick_added');
            expect(event.body_type).toBe('nick');
            const nick = event.body as ApiNick;
            expect(Object.keys(nick).sort()).toEqual([...NICK_KEYS].sort());
            expect(nick.name).toBe('bob');
            event = await nickEvent(
                '/gbtest nick prefix bob +',
                'nicklist_nick_changed',
            );
            expect((event.body as ApiNick).prefix).toBe('+');
            event = await nickEvent('/gbtest nick del bob', 'nicklist_nick_removing');
            expect((event.body as ApiNick).id).toBe(nick.id);
        });

        it('nicklist_group_added, nicklist_group_changed, nicklist_group_removing', async () => {
            let event = await nickEvent(
                '/gbtest group add 500|test',
                'nicklist_group_added',
            );
            expect(event.body_type).toBe('nick_group');
            const group = event.body as ApiNickGroup;
            expect(group.name).toBe('500|test');
            event = await nickEvent(
                '/gbtest group hide 500|test',
                'nicklist_group_changed',
            );
            expect((event.body as ApiNickGroup).visible).toBe(false);
            event = await nickEvent(
                '/gbtest group del 500|test',
                'nicklist_group_removing',
            );
            expect((event.body as ApiNickGroup).id).toBe(group.id);
        });

        it('stops sending nick events with sync nicks=false', async () => {
            await c.api.sync({
                sync: true,
                nicks: false,
                input: true,
                colors: 'weechat',
            });
            const count = c.events.length;
            await c.weechat('/gbtest nick add carol');
            await sleep(200);
            const after = c.events.slice(count).map((e) => e.event_name);
            expect(after.filter((name) => name.startsWith('nicklist_'))).toEqual([]);
            await c.weechat('/gbtest nick del carol');
            await c.api.sync({
                sync: true,
                nicks: true,
                input: true,
                colors: 'weechat',
            });
        });
    });

    it('stops sending events with sync=false', async () => {
        await c.api.sync({ sync: false });
        const count = c.events.length;
        await c.weechat('/print event-less');
        await sleep(500);
        expect(c.events.length).toBe(count);
    });
});

describe('session', () => {
    let session: Session;
    const highlights: string[] = [];

    beforeAll(async () => {
        session = new Session({
            hotlistSync: () => false,
            onHighlight: (_bufferId, line) => highlights.push(line.text),
            pingInterval: 0,
            reconnectDelay: 500,
        });
        await session.connect(relayOptions());
    });

    afterAll(() => session?.disconnect());

    const gbtest = () =>
        Object.values(session.state.buffers).find(
            (b) => b.fullName === 'python.gbtest',
        )!;

    it('loads buffers and the version', () => {
        expect(session.state.status).toBe('connected');
        expect(session.state.version?.weechat_version).toMatch(/^\d+\./);
        expect(gbtest().shortName).toBe('#gbtest');
        expect(session.state.activeBufferId).not.toBeNull();
    });

    it('loads lines and the nicklist when switching to a buffer', async () => {
        session.activate(gbtest().id);
        await until(() => gbtest().lines.length > 0 && gbtest().nicklistLoaded);
        expect(gbtest().lines.some((l) => l.text === 'history line 39')).toBe(true);
        expect(Object.values(gbtest().nicks).map((n) => n.name)).toContain('alice');
    });

    it('receives new lines and counts highlights in other buffers', async () => {
        const core = Object.values(session.state.buffers).find(
            (b) => b.fullName === 'core.weechat',
        )!;
        session.activate(core.id);
        await session.input('/gbtest say alice hey gbuser');
        await until(() => highlights.includes('hey gbuser'));
        expect(gbtest().notification).toBeGreaterThan(0);
    });

    it('sends input and keeps it in the history', async () => {
        // The fixtures buffer has no input callback: print the text
        await session.send(gbtest().id, '/print from the session');
        await until(() => gbtest().lines.some((l) => l.text === 'from the session'));
        expect(session.historyUp(gbtest().id, '')).toBe('/print from the session');
    });

    it('follows nicklist changes', async () => {
        await session.input('/gbtest nick add dave');
        await until(() => Object.values(gbtest().nicks).some((n) => n.name === 'dave'));
        await session.input('/gbtest nick del dave');
        await until(
            () => !Object.values(gbtest().nicks).some((n) => n.name === 'dave'),
        );
    });

    it('keeps buffer numbers in sync with WeeChat when buffers move', async () => {
        const core = Object.values(session.state.buffers).find(
            (b) => b.fullName === 'core.weechat',
        )!;
        await session.input('/buffer move +', core.id);
        await sleep(300);
        await session.input('/buffer move 1', core.id);
        await sleep(300);
        await session.input('/buffer move 2', gbtest().id);
        await sleep(500);
        const c = await connect();
        const expected = Object.fromEntries(
            (await c.api.buffers()).map((b) => [b.id, b.number]),
        );
        c.client.close();
        const actual = Object.fromEntries(
            Object.values(session.state.buffers).map((b) => [b.id, b.number]),
        );
        expect(actual).toEqual(expected);
    });

    it('completes commands with WeeChat', async () => {
        const completion = await session.completion(gbtest().id, '/hel', 4);
        expect(completion.list).toEqual(['help']);
    });

    it('opens buffers and switches to the ones it asked for', async () => {
        const core = Object.values(session.state.buffers).find(
            (b) => b.fullName === 'core.weechat',
        )!;
        await session.send(core.id, '/buffer add sessionbuf');
        await until(() =>
            Object.values(session.state.buffers).some(
                (b) => b.fullName === 'core.sessionbuf',
            ),
        );
        await session.input('/buffer close core.sessionbuf');
        await until(
            () =>
                !Object.values(session.state.buffers).some(
                    (b) => b.fullName === 'core.sessionbuf',
                ),
        );
    });

    it('reconnects when the connection is lost', async () => {
        const id = gbtest().id;
        session.activate(id);
        // Drop the connection as if the network failed
        (session as unknown as { client: RelayClient }).client.abort('test');
        expect(session.state.status).toBe('reconnecting');
        await until(() => session.state.status === 'connected', 10000);
        expect(session.state.activeBufferId).toBe(id);
    });

    it('reconnects after a WeeChat /upgrade and reloads everything', async () => {
        const id = gbtest().id;
        await session.input('/upgrade');
        await until(() => session.state.status !== 'connected', 10000);
        await until(
            () => session.state.status === 'connected' && !session.state.upgrading,
            30000,
        );
        // Buffers keep their ids across upgrades
        expect(session.state.buffers[id]?.fullName).toBe('python.gbtest');
        expect(session.state.activeBufferId).toBe(id);
        // The fixtures script is not reloaded by /upgrade
        await session.input('/python load gbtest.py');
    });
});

describe('quit', () => {
    it('sends the quit event and closes the connection', async () => {
        const c = await connect();
        // Relay clients can't run /quit by default (relay.network.commands)
        await c.weechat('/set relay.network.commands "*"');
        await c.api.sync({ sync: true });
        c.mark();
        const quit = c.waitEvent('quit');
        // No barrier: WeeChat is gone after this command
        await c.api.input('/quit');
        expect((await quit).buffer_id).toBe(-1);
        await until(() => c.closes.length > 0, 10000);
    });
});
