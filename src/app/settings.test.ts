import { describe, expect, it } from 'vitest';
import {
    DEFAULT_SETTINGS,
    loadSettings,
    hashSettings,
    parseHashParams,
    parseHostField,
} from './settings';

function fakeStorage(items: Record<string, string>): Storage {
    return {
        getItem: (key: string) => items[key] ?? null,
        setItem: (key: string, value: string) => {
            items[key] = value;
        },
        removeItem: (key: string) => {
            delete items[key];
        },
        clear: () => undefined,
        key: () => null,
        length: Object.keys(items).length,
    };
}

describe('host field', () => {
    it('parses host, host:port and host:port/path', () => {
        expect(parseHostField('example.com')).toMatchObject({
            host: 'example.com',
            path: 'api',
        });
        expect(parseHostField('example.com:9001')).toMatchObject({
            host: 'example.com',
            port: '9001',
            path: 'api',
        });
        expect(parseHostField('example.com:443/relay/api')).toMatchObject({
            host: 'example.com',
            port: '443',
            path: 'relay/api',
        });
        expect(parseHostField('[2001:db8::1]:9001')).toMatchObject({
            host: '[2001:db8::1]',
            port: '9001',
        });
    });

    it('takes TLS from a scheme and removes it', () => {
        expect(parseHostField('wss://example.com:9001')).toMatchObject({
            tls: true,
            hostField: 'example.com:9001',
        });
        expect(parseHostField('http://example.com')).toMatchObject({
            tls: false,
            hostField: 'example.com',
        });
    });

    it('rejects invalid fields', () => {
        expect(parseHostField('example.com/path')).toBeNull();
        expect(parseHostField('2001:db8::1')).toBeNull();
    });
});

describe('URL parameters', () => {
    it('parses the fragment', () => {
        expect(
            parseHashParams(
                '#host=example.com&port=9001&password=p%40ss&autoconnect=true&x=1',
            ),
        ).toEqual({
            host: 'example.com',
            port: '9001',
            password: 'p@ss',
            autoconnect: true,
        });
        expect(parseHashParams('')).toEqual({});
    });

    const saved = {
        ...DEFAULT_SETTINGS,
        hostField: 'example.com:9001',
        host: 'example.com',
        port: 9001,
        savepassword: true,
        password: 'secret',
    };

    it('sets the relay', () => {
        expect(
            hashSettings(saved, {
                host: 'other.org',
                port: '443',
                path: 'weechat/api',
            }),
        ).toEqual({
            changes: {
                hostField: 'other.org:443/weechat/api',
                host: 'other.org',
                port: 443,
                path: 'weechat/api',
                password: '',
            },
            relayChanged: true,
        });
        // The port given with the host, or kept
        expect(hashSettings(saved, { host: 'other.org:9002' }).changes.hostField).toBe(
            'other.org:9002',
        );
        expect(hashSettings(saved, { host: 'other.org' }).changes.hostField).toBe(
            'other.org:9001',
        );
        expect(hashSettings(saved, { host: 'wss://other.org' }).changes.tls).toBe(true);
        // An invalid port is ignored
        expect(hashSettings(saved, { port: 'x' }).changes.port).toBe(9001);
        expect(hashSettings(saved, {})).toEqual({ changes: {}, relayChanged: false });
    });

    it('forgets the saved password only for another relay', () => {
        const same = hashSettings(saved, { host: 'EXAMPLE.com', port: '9001' });
        expect(same.relayChanged).toBe(false);
        expect(same.changes.password).toBeUndefined();
        expect(hashSettings(saved, { host: 'evil.example' }).changes.password).toBe('');
        expect(hashSettings(saved, { port: '9002' }).changes.password).toBe('');
        expect(hashSettings(saved, { path: 'x' }).changes.password).toBe('');
    });
});

describe('stored settings', () => {
    it('uses the defaults', () => {
        expect(loadSettings(fakeStorage({}))).toEqual(DEFAULT_SETTINGS);
    });

    it('reads settings saved by previous versions', () => {
        const settings = loadSettings(
            fakeStorage({
                theme: '"light"',
                port: '9002',
                fontsize: '16',
                onlyUnread: 'true',
                hostField: '"example.com:9001/weechat"',
                path: '"weechat"',
                currentlyViewedBuffers:
                    '{"example.com:9001/weechat":"0x55d0c0a7e0","x":"irc.libera.#weechat"}',
            }),
        );
        expect(settings.theme).toBe('light');
        expect(settings.port).toBe(9002);
        expect(settings.fontsize).toBe('16');
        expect(settings.onlyUnread).toBe(true);
        // The "weechat" relay path is migrated to "api"
        expect(settings.hostField).toBe('example.com:9001/api');
        expect(settings.path).toBe('api');
        expect(settings.currentlyViewedBuffers.x).toBe('irc.libera.#weechat');
    });

    it('ignores values of another type', () => {
        const settings = loadSettings(
            fakeStorage({
                hostField: 'null',
                port: '{}',
                collapsedServers: '{"a":1}',
                currentlyViewedBuffers: '[1]',
            }),
        );
        expect(settings.hostField).toBe(DEFAULT_SETTINGS.hostField);
        expect(settings.port).toBe(DEFAULT_SETTINGS.port);
        expect(settings.collapsedServers).toEqual([]);
        expect(settings.currentlyViewedBuffers).toEqual({});
    });

    it('ignores a password that was not meant to be saved', () => {
        expect(loadSettings(fakeStorage({ password: '"secret"' })).password).toBe('');
        expect(
            loadSettings(fakeStorage({ password: '"secret"', savepassword: 'true' }))
                .password,
        ).toBe('secret');
    });
});
