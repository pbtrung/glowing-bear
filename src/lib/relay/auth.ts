/*
 * Authentication with the WeeChat relay "api" protocol.
 *
 * The password is sent either as "plain:<password>" or hashed, using the
 * current Unix timestamp as salt:
 *   hash:sha256:<timestamp>:<hex(sha256(timestamp + password))>
 *   hash:sha512:<timestamp>:<hex(sha512(timestamp + password))>
 *   hash:pbkdf2+sha256:<timestamp>:<iterations>:<hex(pbkdf2(...))>
 *   hash:pbkdf2+sha512:<timestamp>:<iterations>:<hex(pbkdf2(...))>
 *
 * Browsers can't set the Authorization header on a WebSocket, so the
 * WebSocket carries the credentials base64url-encoded in a sub-protocol.
 */
import type { HashAlgo } from './types';

/** Strongest first: the order we offer them to WeeChat in */
const HASH_ALGOS: HashAlgo[] = [
    'pbkdf2+sha512',
    'pbkdf2+sha256',
    'sha512',
    'sha256',
    'plain',
];

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer): string =>
    Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');

/** Standard base64 of the UTF-8 encoding of a string */
export function base64(str: string): string {
    let binary = '';
    for (const byte of encoder.encode(str)) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary);
}

/** base64url (RFC 4648 §5, no padding) of the UTF-8 encoding of a string */
export function base64url(str: string): string {
    return base64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const hasSubtleCrypto = (): boolean =>
    typeof crypto !== 'undefined' && crypto.subtle !== undefined;

/**
 * Hash algorithms this browser can compute. WebCrypto is only available in
 * secure contexts (https:// or localhost), elsewhere only "plain" works.
 */
export function supportedHashAlgos(): HashAlgo[] {
    return hasSubtleCrypto() ? [...HASH_ALGOS] : ['plain'];
}

/**
 * Build the credentials string for the relay.
 *
 * @param password the relay password
 * @param algo hash algorithm returned by the handshake
 * @param iterations PBKDF2 iterations returned by the handshake
 * @param timestamp Unix timestamp in seconds (defaults to now)
 */
export async function buildCredentials(
    password: string,
    algo: HashAlgo | null,
    iterations = 0,
    timestamp = Math.floor(Date.now() / 1000),
): Promise<string> {
    const salt = String(timestamp);

    if (!algo || algo === 'plain') {
        return 'plain:' + password;
    }
    if (!hasSubtleCrypto()) {
        throw new Error('WebCrypto is not available');
    }

    if (algo === 'sha256' || algo === 'sha512') {
        const hash = await crypto.subtle.digest(
            algo === 'sha256' ? 'SHA-256' : 'SHA-512',
            encoder.encode(salt + password),
        );
        return `hash:${algo}:${salt}:${toHex(hash)}`;
    }

    const sha256 = algo === 'pbkdf2+sha256';
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits'],
    );
    const hash = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            hash: sha256 ? 'SHA-256' : 'SHA-512',
            salt: encoder.encode(salt),
            iterations,
        },
        key,
        sha256 ? 256 : 512,
    );
    return `hash:${algo}:${salt}:${iterations}:${toHex(hash)}`;
}

/** WebSocket sub-protocols carrying the credentials */
export function websocketProtocols(credentials: string): string[] {
    return [
        'api.weechat',
        'base64url.bearer.authorization.weechat.' + base64url(credentials),
    ];
}

export interface RelayUrls {
    /** e.g. https://host:9001/api */
    http: string;
    /** e.g. wss://host:9001/api */
    ws: string;
}

/**
 * Build the base URLs of the relay.
 *
 * @param host hostname, IPv4 or IPv6 address
 * @param port port number
 * @param path path of the API on the relay ("api" unless behind a proxy)
 * @param tls whether to use TLS
 */
export function relayUrls(
    host: string,
    port: number | string,
    path: string,
    tls: boolean,
): RelayUrls {
    // If host is an IPv6 literal wrap it in brackets
    if (host.includes(':') && !host.startsWith('[') && !host.endsWith(']')) {
        host = `[${host}]`;
    }
    const cleanPath = (path || 'api').replace(/^\/+|\/+$/g, '');
    const hostPort = `${host}:${port}/${cleanPath}`;
    return {
        http: `${tls ? 'https' : 'http'}://${hostPort}`,
        ws: `${tls ? 'wss' : 'ws'}://${hostPort}`,
    };
}

/** Human readable explanation of an authentication error ("error" of a 401) */
export function describeAuthError(error: string | undefined): string {
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
}
