/*
 * Notifications: desktop notifications and sound for highlights and private
 * messages, unread counts in the title, the favicon and the app badge.
 */
import type { Buffer, Line } from '../lib/state/model';
import { getSettings } from './settings';

let serviceWorker: ServiceWorkerRegistration | null = null;
const shown: Notification[] = [];

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export const notificationPermission = (): NotificationPermissionState =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;

/**
 * Ask for the permission to show notifications (browsers only ask from a
 * click). Resolves with the permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
    let permission = notificationPermission();
    if (permission === 'default') {
        permission = await Notification.requestPermission().catch(() => permission);
    }
    return permission;
}

/** Register the service worker (notifications on Android), at startup */
export function registerServiceWorker(): void {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }
    navigator.serviceWorker.register('serviceworker.js').then(
        (registration) => {
            serviceWorker = registration;
        },
        () => undefined,
    );
}

/** Click handlers of the notifications shown by the service worker, by tag */
const swClickHandlers = new Map<string, () => void>();

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
        const data = event.data as { type?: string; tag?: string } | null;
        if (data?.type === 'notificationclick' && data.tag) {
            swClickHandlers.get(data.tag)?.();
        }
    });
}

/**
 * Show a notification (one per buffer: a new one replaces it and alerts
 * again). Pages can't create notifications on Android: the service worker
 * shows them there, and sends clicks back.
 */
function showNotification(
    tag: string,
    title: string,
    body: string,
    onClick: () => void,
): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
    }
    let notification: Notification;
    try {
        notification = new Notification(title, {
            body,
            icon: 'assets/img/favicon.png',
            tag,
            renotify: true,
        } as NotificationOptions);
    } catch {
        if (serviceWorker) {
            swClickHandlers.set(tag, onClick);
            void serviceWorker
                .showNotification(title, {
                    body,
                    icon: 'assets/img/glowing_bear_128x128.png',
                    tag,
                    renotify: true,
                } as NotificationOptions)
                .catch(() => undefined);
        }
        return;
    }
    shown.push(notification);
    notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
    };
    notification.onclose = () => {
        const index = shown.indexOf(notification);
        if (index >= 0) {
            shown.splice(index, 1);
        }
    };
    setTimeout(() => notification.close(), 15000);
}

function playSound(): void {
    const audio = new Audio();
    audio.src = audio.canPlayType('audio/ogg')
        ? 'assets/audio/sonar.ogg'
        : 'assets/audio/sonar.mp3';
    audio.play().catch(() => undefined);
}

/** Notify a highlight or a private message */
export function notifyHighlight(buffer: Buffer, line: Line, onClick: () => void): void {
    const count = buffer.notification;
    let title: string;
    let body: string;
    if (buffer.type === 'private') {
        title = count > 1 ? `${count} private messages from ` : 'Private message from ';
        body = line.text;
    } else {
        title = count > 1 ? `${count} highlights in ` : 'Highlight in ';
        body = `<${line.prefixText}> ${line.text}`;
    }
    title += buffer.shortName + (buffer.server ? ` (${buffer.server})` : '');
    showNotification('gb-' + buffer.id, title, body, onClick);
    if (getSettings().soundnotification) {
        playSound();
    }
}

/** Close the notifications still shown (when disconnecting) */
export function cancelNotifications(): void {
    for (const notification of [...shown]) {
        notification.close();
    }
    swClickHandlers.clear();
    void serviceWorker
        ?.getNotifications()
        .then((notifications) => notifications.forEach((n) => n.close()))
        .catch(() => undefined);
}

/** Window title: "(highlights) Glowing Bear | buffer | title" */
export function updateTitle(notifications: number, buffer: Buffer | undefined): void {
    let title = notifications > 0 ? `(${notifications}) Glowing Bear` : 'Glowing Bear';
    if (buffer) {
        title += ` | ${buffer.shortName || buffer.fullName}`;
        if (buffer.titleText) {
            title += ` | ${buffer.titleText}`;
        }
    }
    document.title = title;
}

let originalFavicon: string | null = null;
let faviconImage: HTMLImageElement | null = null;
/** Counts to draw once the favicon is loaded (only the latest ones) */
let faviconCounts: [number, number] = [0, 0];

/** Draw a badge with a count on the favicon */
export function updateFavicon(notifications: number, unread: number): void {
    const link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"][type="image/png"]',
    );
    if (!link) {
        return;
    }
    originalFavicon ??= link.href;
    faviconCounts = [notifications, unread];
    const count = notifications > 0 ? notifications : unread;
    if (count === 0 || !getSettings().useFavico) {
        link.href = originalFavicon;
        return;
    }
    const draw = (image: HTMLImageElement) => {
        if (faviconCounts[0] !== notifications || faviconCounts[1] !== unread) {
            // changed while the image was loading: drawn by a later call
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.drawImage(image, 0, 0, 32, 32);
        ctx.fillStyle = notifications > 0 ? '#dd0000' : '#5cb85c';
        ctx.beginPath();
        ctx.arc(22, 22, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count > 99 ? '99' : String(count), 22, 23);
        link.href = canvas.toDataURL('image/png');
    };
    if (faviconImage === null) {
        faviconImage = new Image();
        faviconImage.src = originalFavicon;
    }
    const image = faviconImage;
    if (image.complete && image.naturalWidth > 0) {
        draw(image);
    } else {
        // one handler: the latest counts are drawn
        image.onload = () => draw(image);
    }
}

/** Badge of the installed app (Badging API) */
export function updateAppBadge(notifications: number, unread: number): void {
    if (!('setAppBadge' in navigator)) {
        return;
    }
    const nav = navigator as Navigator & {
        setAppBadge: (count?: number) => Promise<void>;
        clearAppBadge: () => Promise<void>;
    };
    let promise: Promise<void>;
    if (notifications > 0) {
        promise = nav.setAppBadge(notifications);
    } else if (unread > 0) {
        // just a dot
        promise = nav.setAppBadge();
    } else {
        promise = nav.clearAppBadge();
    }
    promise.catch(() => undefined);
}
