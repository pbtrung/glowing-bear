import { describe, expect, it } from 'vitest';
import {
    base64,
    base64url,
    buildCredentials,
    describeAuthError,
    relayUrls,
    supportedHashAlgos,
    websocketProtocols,
} from './auth';

const TIMESTAMP = 1706431066;

describe('credentials', () => {
    it('encodes in base64 and base64url', () => {
        expect(base64('plain:secret_password')).toBe('cGxhaW46c2VjcmV0X3Bhc3N3b3Jk');
        // UTF-8, URL-safe alphabet, no padding
        expect(base64url('plain:pässwörd?>')).toBe('cGxhaW46cMOkc3N3w7ZyZD8-');
    });

    it('builds the WebSocket sub-protocols (example of the WeeChat docs)', () => {
        expect(websocketProtocols('plain:secret_password')).toEqual([
            'api.weechat',
            'base64url.bearer.authorization.weechat.cGxhaW46c2VjcmV0X3Bhc3N3b3Jk',
        ]);
    });

    it('offers the strongest algorithms first', () => {
        expect(supportedHashAlgos()).toEqual([
            'pbkdf2+sha512',
            'pbkdf2+sha256',
            'sha512',
            'sha256',
            'plain',
        ]);
    });

    it('builds plain credentials', async () => {
        expect(await buildCredentials('secret_password', 'plain', 0, TIMESTAMP)).toBe(
            'plain:secret_password',
        );
        expect(await buildCredentials('secret_password', null)).toBe(
            'plain:secret_password',
        );
    });

    it('builds sha256 credentials (example of the WeeChat docs)', async () => {
        expect(await buildCredentials('secret_password', 'sha256', 0, TIMESTAMP)).toBe(
            'hash:sha256:1706431066:' +
                'dfa1db3f6bb6445d18d9ec7427c10f6421274e3a4751e6c1ffc7dd28c94eadf6',
        );
    });

    it('builds sha512 credentials', async () => {
        expect(await buildCredentials('secret_password', 'sha512', 0, TIMESTAMP)).toBe(
            'hash:sha512:1706431066:' +
                'c62a694b8f07e047fc85c7249f56c7b8124634a11c72b4e000fbee5b27e98c5e' +
                '717843044a50c5099737e926b47a61f86c0b33a2d5a3c027f3b1d2bc90d12683',
        );
    });

    it('builds pbkdf2 credentials salted with the timestamp', async () => {
        expect(
            await buildCredentials('secret_password', 'pbkdf2+sha512', 1000, TIMESTAMP),
        ).toBe(
            'hash:pbkdf2+sha512:1706431066:1000:' +
                '77fc0c193ddd6844f988f935ec2291a469bc9618099c6101a5117f86bce86e34' +
                '34703969bffaa0b9ec7d3ef23a22df9cd696586d8072decd8b7f7e25351a38ea',
        );
        expect(
            await buildCredentials('secret_password', 'pbkdf2+sha256', 1000, TIMESTAMP),
        ).toBe(
            'hash:pbkdf2+sha256:1706431066:1000:' +
                'c3c331950c9ddf645f8a23d6ee779c7e4e56dcc79d5ea80d40b96944707e3d35',
        );
    });

    it('explains authentication errors', () => {
        expect(describeAuthError('Invalid password')).toBe('Wrong password.');
        expect(describeAuthError('Missing password')).toBe('Wrong password.');
        expect(describeAuthError('Invalid timestamp')).toContain('time_window');
        expect(describeAuthError('Something else')).toBe('Something else');
        expect(describeAuthError(undefined)).toBe('Authentication failed.');
    });
});

describe('relay URLs', () => {
    it('builds HTTP and WebSocket URLs', () => {
        expect(relayUrls('example.com', 9000, 'api', true)).toEqual({
            http: 'https://example.com:9000/api',
            ws: 'wss://example.com:9000/api',
        });
        expect(relayUrls('localhost', '9000', '', false)).toEqual({
            http: 'http://localhost:9000/api',
            ws: 'ws://localhost:9000/api',
        });
    });

    it('supports a proxy path and IPv6 addresses', () => {
        expect(relayUrls('::1', 443, '/relay/api/', true).ws).toBe(
            'wss://[::1]:443/relay/api',
        );
        expect(relayUrls('[2001:db8::1]', 9000, 'api', false).http).toBe(
            'http://[2001:db8::1]:9000/api',
        );
    });
});
