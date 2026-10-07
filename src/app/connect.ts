/*
 * Connecting with the settings of the connection form.
 */
import { session } from './chat';
import { cancelNotifications, requestNotificationPermission } from './notifications';
import {
    getSettings,
    parseHashParams,
    parseHostField,
    updateSettings,
} from './settings';

/** Connect with the current settings and the given password */
export async function connectWithSettings(password: string): Promise<void> {
    const s = getSettings();
    const parsed = parseHostField(s.hostField);
    if (!parsed) {
        return;
    }
    requestNotificationPermission();
    try {
        await session.connect({
            host: parsed.host,
            port: parsed.port ?? s.port,
            path: parsed.path,
            password,
            tls: s.tls,
        });
    } catch {
        // the error is in the session state
    }
}

/**
 * Apply the URL parameters (#host=...&port=...&password=...&autoconnect=true)
 * and connect automatically if asked to.
 */
export function initConnection(): void {
    const params = parseHashParams(location.hash);
    if (params.host) {
        updateSettings({ host: params.host, hostField: params.host });
    }
    if (params.port) {
        updateSettings({ port: Number(params.port) });
    }
    if (params.path) {
        const s = getSettings();
        updateSettings({
            path: params.path,
            hostField: `${s.host}:${s.port}/${params.path}`,
        });
    }
    if (params.autoconnect !== undefined) {
        updateSettings({ autoconnect: params.autoconnect });
    }
    const s = getSettings();
    const password = params.password ?? (s.savepassword ? s.password : '');
    if (s.autoconnect) {
        void connectWithSettings(password);
    }

    session.store.subscribe((state, previous) => {
        if (state.status === 'disconnected' && previous.status !== 'disconnected') {
            cancelNotifications();
        }
    });
}
