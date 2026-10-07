/*
 * Connecting with the settings of the connection form.
 */
import { session } from './chat';
import { cancelNotifications, requestNotificationPermission } from './notifications';
import {
    getSettings,
    hashSettings,
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
 * Apply the URL parameters (#host=...&port=...&path=...&password=...&autoconnect=true)
 * and connect automatically if asked to.
 */
export function initConnection(): void {
    const params = parseHashParams(location.hash);
    if (location.hash) {
        // Don't leave a password in the address bar and the history
        history.replaceState(null, '', location.pathname + location.search);
    }
    updateSettings(hashSettings(getSettings(), params).changes);
    const s = getSettings();
    const password = params.password ?? (s.savepassword ? s.password : '');
    // autoconnect in the URL applies to this page load only
    if (params.autoconnect ?? s.autoconnect) {
        void connectWithSettings(password);
    }

    session.store.subscribe((state, previous) => {
        if (state.status === 'disconnected' && previous.status !== 'disconnected') {
            cancelNotifications();
        }
    });
}
