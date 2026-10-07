/*
 * Notifications: desktop notifications and sound for highlights and private
 * messages, unread counts in the title, the favicon and the app badge.
 */
import type { Buffer, Line } from '../lib/state/model';
import { getSettings } from './settings';

let serviceWorker: ServiceWorkerRegistration | null = null;
const shown: Notification[] = [];

/** Ask for the permission to show notifications, register the service worker */
export function requestNotificationPermission(): void {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        void Notification.requestPermission();
    }
    if ('serviceWorker' in navigator && serviceWorker === null) {
        navigator.serviceWorker.register('serviceworker.js').then(
            (registration) => {
                serviceWorker = registration;
            },
            () => undefined,
        );
    }
}

function showNotification(title: string, body: string, onClick: () => void): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
    }
    if (serviceWorker) {
        void serviceWorker.showNotification(title, {
            body,
            icon: 'assets/img/glowing_bear_128x128.png',
            tag: 'gb-highlight',
        });
        return;
    }
    const notification = new Notification(title, {
        body,
        icon: 'assets/img/favicon.png',
    });
    shown.push(notification);
    notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
    };
    notification.onclose = () => {
        shown.splice(shown.indexOf(notification), 1);
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
    showNotification(title, body, onClick);
    if (getSettings().soundnotification) {
        playSound();
    }
}

/** Close the notifications still shown (when disconnecting) */
export function cancelNotifications(): void {
    for (const notification of [...shown]) {
        notification.close();
    }
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

/** Draw a badge with a count on the favicon */
export function updateFavicon(notifications: number, unread: number): void {
    const link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"][type="image/png"]',
    );
    if (!link) {
        return;
    }
    originalFavicon ??= link.href;
    const count = notifications > 0 ? notifications : unread;
    if (count === 0 || !getSettings().useFavico) {
        link.href = originalFavicon;
        return;
    }
    const draw = (image: HTMLImageElement) => {
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
    if (faviconImage?.complete) {
        draw(faviconImage);
    } else {
        faviconImage = new Image();
        faviconImage.onload = () => draw(faviconImage!);
        faviconImage.src = originalFavicon;
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
