'use strict';

/*
 * Helpers for authenticating with the WeeChat relay "api" protocol.
 *
 * The password is sent either as "plain:<password>" or hashed, using the
 * current Unix timestamp as salt:
 *   hash:sha256:<timestamp>:<hex(sha256(timestamp + password))>
 *   hash:sha512:<timestamp>:<hex(sha512(timestamp + password))>
 *   hash:pbkdf2+sha256:<timestamp>:<iterations>:<hex(pbkdf2(...))>
 *   hash:pbkdf2+sha512:<timestamp>:<iterations>:<hex(pbkdf2(...))>
 *
 * Browsers can't set the Authorization header on a WebSocket, so the
 * WebSocket carries it base64url-encoded in a sub-protocol instead.
 */

// Strongest first: this is the order we offer them to WeeChat in
const HASH_ALGOS = ['pbkdf2+sha512', 'pbkdf2+sha256', 'sha512', 'sha256', 'plain'];

const textEncoder = new TextEncoder();

const toHex = function (buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(function (b) {
            return b.toString(16).padStart(2, '0');
        })
        .join('');
};

const bytesToBinaryString = function (bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
};

// Standard base64 of the UTF-8 encoding of a string
export const base64 = function (str) {
    return btoa(bytesToBinaryString(textEncoder.encode(str)));
};

// base64url (RFC 4648 §5, no padding) of the UTF-8 encoding of a string
export const base64url = function (str) {
    return base64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const hasSubtleCrypto = function () {
    return typeof crypto !== 'undefined' && !!crypto.subtle;
};

/*
 * Hash algorithms this browser can compute. WebCrypto is only available in
 * secure contexts (https:// or localhost), elsewhere only "plain" works.
 */
export const supportedHashAlgos = function () {
    return hasSubtleCrypto() ? HASH_ALGOS.slice() : ['plain'];
};

/*
 * Build the credentials string for the relay.
 *
 * @param password the relay password
 * @param algo hash algorithm returned by the handshake
 * @param iterations PBKDF2 iterations returned by the handshake
 * @param timestamp Unix timestamp in seconds (defaults to now)
 * @return promise resolving to e.g. "hash:sha256:1706431066:dfa1..."
 */
export const buildCredentials = function (password, algo, iterations, timestamp) {
    if (timestamp === undefined) {
        timestamp = Math.floor(Date.now() / 1000);
    }
    const salt = String(timestamp);

    if (!algo || algo === 'plain') {
        return Promise.resolve('plain:' + password);
    }
    if (!hasSubtleCrypto()) {
        return Promise.reject(new Error('WebCrypto is not available'));
    }

    if (algo === 'sha256' || algo === 'sha512') {
        const hashName = algo === 'sha256' ? 'SHA-256' : 'SHA-512';
        return crypto.subtle
            .digest(hashName, textEncoder.encode(salt + password))
            .then(function (hash) {
                return 'hash:' + algo + ':' + salt + ':' + toHex(hash);
            });
    }

    if (algo === 'pbkdf2+sha256' || algo === 'pbkdf2+sha512') {
        const hashName = algo === 'pbkdf2+sha256' ? 'SHA-256' : 'SHA-512';
        const bits = algo === 'pbkdf2+sha256' ? 256 : 512;
        return crypto.subtle
            .importKey('raw', textEncoder.encode(password), { name: 'PBKDF2' }, false, [
                'deriveBits',
            ])
            .then(function (key) {
                return crypto.subtle.deriveBits(
                    {
                        name: 'PBKDF2',
                        hash: hashName,
                        salt: textEncoder.encode(salt),
                        iterations: iterations,
                    },
                    key,
                    bits,
                );
            })
            .then(function (hash) {
                return (
                    'hash:' + algo + ':' + salt + ':' + iterations + ':' + toHex(hash)
                );
            });
    }

    return Promise.reject(new Error('Unsupported hash algorithm: ' + algo));
};

/*
 * WebSocket sub-protocols carrying the credentials.
 */
export const websocketProtocols = function (credentials) {
    return [
        'api.weechat',
        'base64url.bearer.authorization.weechat.' + base64url(credentials),
    ];
};

/*
 * Build the base URLs of the relay.
 *
 * @param host hostname, IPv4 or IPv6 address
 * @param port port number
 * @param path path of the API on the relay ("api" unless behind a proxy)
 * @param tls whether to use TLS
 * @return {http, ws} base URLs, without trailing slash
 */
export const relayUrls = function (host, port, path, tls) {
    // If host is an IPv6 literal wrap it in brackets
    if (host.indexOf(':') !== -1 && host[0] !== '[' && host[host.length - 1] !== ']') {
        host = '[' + host + ']';
    }
    path = (path || 'api').replace(/^\/+|\/+$/g, '');
    const hostPort = host + ':' + port + '/' + path;
    return {
        http: (tls ? 'https' : 'http') + '://' + hostPort,
        ws: (tls ? 'wss' : 'ws') + '://' + hostPort,
    };
};

/*
 * Human readable explanation for an authentication error returned by the
 * relay (the "error" field of a 401 response).
 */
export const describeAuthError = function (error) {
    switch (error) {
        case 'Missing password':
        case 'Invalid password':
            return 'Wrong password.';
        case 'Invalid timestamp':
            return (
                'WeeChat rejected the timestamp of the hashed password. Check that the ' +
                'clocks of this device and the WeeChat host are in sync, or increase ' +
                'relay.network.time_window in WeeChat.'
            );
        case 'Invalid hash algorithm (not found or not supported)':
            return (
                'WeeChat and Glowing Bear could not agree on a password hash ' +
                'algorithm. Check relay.network.password_hash_algo in WeeChat.'
            );
        case 'Invalid number of iterations':
            return 'Invalid number of PBKDF2 iterations.';
        case 'Missing TOTP':
        case 'Invalid TOTP':
            return 'Missing or invalid TOTP.';
        default:
            return error || 'Authentication failed.';
    }
};
