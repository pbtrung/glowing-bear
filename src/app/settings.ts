/*
 * User settings, persisted in localStorage.
 *
 * Each setting is a JSON value under its own key, as stored by previous
 * versions of Glowing Bear, so existing settings are kept.
 */
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export const DEFAULT_FONT = "'Inter Variable', Inter, system-ui, sans-serif";

export interface Settings {
    theme: string;
    /** Host field of the connection form (host, host:port or host:port/path) */
    hostField: string;
    host: string;
    port: number | string;
    path: string;
    tls: boolean;
    savepassword: boolean;
    password: string;
    autoconnect: boolean;
    /** Hide the nicklist (desktop) */
    nonicklist: boolean;
    /** Always show the nicklist (mobile) */
    alwaysnicklist: boolean;
    onlyUnread: boolean;
    hotlistsync: boolean;
    orderbyserver: boolean;
    useFavico: boolean;
    soundnotification: boolean;
    fontsize: string;
    fontfamily: string;
    readlineBindings: boolean;
    enableMathjax: boolean;
    enableQuickKeys: boolean;
    /** Share the input bar with WeeChat and its other clients */
    syncInput: boolean;
    /** Show WeeChat's buffer numbers in the buffer list */
    showBufferNumbers: boolean;
    /** Hide joins/parts/quits WeeChat's smart filter marks (irc_smart_filter) */
    hideSmartFiltered: boolean;
    customCSS: string;
    /** Buffer to show after connecting, per relay ("host:port/path" -> full name) */
    currentlyViewedBuffers: Record<string, string>;
    /** Servers whose buffers are collapsed in the buffer list ("plugin.server") */
    collapsedServers: string[];
}

const isSecurePage = typeof location !== 'undefined' && location.protocol === 'https:';

export const DEFAULT_SETTINGS: Settings = {
    theme: 'dark',
    hostField: 'localhost',
    host: 'localhost',
    port: 9001,
    path: 'api',
    tls: isSecurePage,
    savepassword: false,
    password: '',
    autoconnect: false,
    nonicklist: false,
    alwaysnicklist: false,
    onlyUnread: false,
    hotlistsync: true,
    orderbyserver: true,
    useFavico: true,
    soundnotification: true,
    fontsize: '14px',
    fontfamily: DEFAULT_FONT,
    readlineBindings: false,
    enableMathjax: false,
    enableQuickKeys: true,
    syncInput: true,
    showBufferNumbers: false,
    hideSmartFiltered: false,
    customCSS: '',
    currentlyViewedBuffers: {},
    collapsedServers: [],
};

function storage(): Storage | null {
    try {
        return typeof localStorage === 'undefined' ? null : localStorage;
    } catch {
        // e.g. disabled cookies
        return null;
    }
}

/** Read the stored settings over the defaults */
export function loadSettings(store: Storage | null = storage()): Settings {
    const settings: Settings = { ...DEFAULT_SETTINGS };
    if (!store) {
        return settings;
    }
    const target = settings as unknown as Record<string, unknown>;
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
        const raw = store.getItem(key);
        if (raw === null) {
            continue;
        }
        let value: unknown;
        try {
            value = JSON.parse(raw);
        } catch {
            value = raw;
        }
        const defaultValue = DEFAULT_SETTINGS[key];
        // Values of another type are ignored (e.g. a null host field broke the
        // page at load)
        if (typeof defaultValue === 'boolean') {
            value = value === true || value === 'true';
        } else if (typeof defaultValue === 'string') {
            if (typeof value === 'number') {
                value = String(value);
            } else if (typeof value !== 'string') {
                continue;
            }
        } else if (typeof defaultValue === 'number') {
            if (typeof value !== 'number' && typeof value !== 'string') {
                continue;
            }
        } else if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value) !== Array.isArray(defaultValue)
        ) {
            continue;
        }
        target[key] = value;
    }
    // Older versions saved the "weechat" protocol path, the api is on /api
    if (settings.path === 'weechat') {
        settings.path = 'api';
    }
    if (settings.hostField.endsWith('/weechat')) {
        settings.hostField = settings.hostField.replace(/\/weechat$/, '/api');
    }
    // Older versions saved buffer pointers here: drop them
    for (const [key, value] of Object.entries(settings.currentlyViewedBuffers)) {
        if (typeof value !== 'string') {
            delete settings.currentlyViewedBuffers[key];
        }
    }
    if (!settings.savepassword) {
        settings.password = '';
    }
    return settings;
}

export const settingsStore = createStore<Settings>(() => loadSettings());

/** Change settings and save them */
export function updateSettings(changes: Partial<Settings>): void {
    const next = { ...settingsStore.getState(), ...changes };
    if (!next.savepassword) {
        next.password = '';
    }
    settingsStore.setState(next, true);
    const store = storage();
    if (!store) {
        return;
    }
    for (const key of Object.keys(changes) as (keyof Settings)[]) {
        try {
            store.setItem(key, JSON.stringify(next[key]));
        } catch {
            // storage full or disabled
        }
    }
    if (!next.savepassword) {
        store.removeItem('password');
    }
}

export function useSettings<T>(selector: (settings: Settings) => T): T {
    return useStore(settingsStore, selector);
}

export function getSettings(): Settings {
    return settingsStore.getState();
}

export interface HostFieldResult {
    host: string;
    /** Port, if part of the field */
    port?: string;
    path: string;
    /** TLS, if a scheme was given (https/wss or http/ws) */
    tls?: boolean;
    /** Host field without the scheme */
    hostField: string;
}

/**
 * Parse the host field of the connection form: "host", "host:port" or
 * "host:port/path", with an optional scheme. Returns null if invalid.
 */
export function parseHostField(field: string): HostFieldResult | null {
    let value = field.trim();
    let tls: boolean | undefined;
    const scheme = /^(https?|wss?):\/\/(.+)$/.exec(value);
    if (scheme) {
        value = scheme[2];
        tls = scheme[1] === 'https' || scheme[1] === 'wss';
    }
    let m = /^([^:/]*|\[.*\])$/.exec(value);
    if (m) {
        return { host: m[1], path: 'api', tls, hostField: value };
    }
    m = /^([^:]*|\[.*\]):(\d+)$/.exec(value);
    if (m) {
        return { host: m[1], port: m[2], path: 'api', tls, hostField: value };
    }
    m = /^([^:]*|\[.*\]):(\d+)\/(.+)$/.exec(value);
    if (m) {
        return { host: m[1], port: m[2], path: m[3], tls, hostField: value };
    }
    return null;
}

export interface HashParams {
    host?: string;
    port?: string;
    path?: string;
    password?: string;
    autoconnect?: boolean;
}

/** Parameters in the URL fragment: #host=...&port=...&password=...&autoconnect=true */
export function parseHashParams(hash: string): HashParams {
    const params: HashParams = {};
    for (const part of hash.replace(/^#/, '').split('&')) {
        const index = part.indexOf('=');
        if (index < 0) {
            continue;
        }
        const key = part.substring(0, index);
        let value: string;
        try {
            value = decodeURIComponent(part.substring(index + 1));
        } catch {
            value = part.substring(index + 1);
        }
        if (key === 'host' || key === 'port' || key === 'path' || key === 'password') {
            params[key] = value;
        } else if (key === 'autoconnect') {
            params.autoconnect = value === 'true';
        }
    }
    return params;
}

/**
 * Settings changed by the URL parameters host, port and path. If they point
 * to another relay, the saved password is forgotten: a link must not get the
 * password of the user's relay sent to another one.
 */
export function hashSettings(
    s: Settings,
    params: HashParams,
): { changes: Partial<Settings>; relayChanged: boolean } {
    if (
        params.host === undefined &&
        params.port === undefined &&
        params.path === undefined
    ) {
        return { changes: {}, relayChanged: false };
    }
    const current = parseHostField(s.hostField);
    const fromHost = params.host !== undefined ? parseHostField(params.host) : null;
    const host = fromHost?.host ?? current?.host ?? s.host;
    const port =
        params.port !== undefined && /^\d+$/.test(params.port)
            ? params.port
            : (fromHost?.port ?? current?.port ?? String(s.port));
    const path = (params.path ?? fromHost?.path ?? current?.path ?? s.path).replace(
        /^\/+/,
        '',
    );
    const changes: Partial<Settings> = {
        hostField: `${host}:${port}` + (path === 'api' ? '' : '/' + path),
        host,
        port: Number(port),
        path,
    };
    if (fromHost?.tls !== undefined) {
        changes.tls = fromHost.tls;
    }
    const relay = (h: string, p: string | number, pa: string) =>
        `${h.toLowerCase()}:${p}/${pa}`;
    const relayChanged =
        relay(host, port, path) !==
        relay(
            current?.host ?? s.host,
            current?.port ?? s.port,
            current?.path ?? s.path,
        );
    if (relayChanged) {
        changes.password = '';
    }
    return { changes, relayChanged };
}
