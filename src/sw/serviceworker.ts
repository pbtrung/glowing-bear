/*
 * Service worker: shows the notifications on Android (pages can't create
 * them there) and sends their clicks back to the page, which switches to the
 * buffer (see src/app/notifications.ts).
 *
 * Built to serviceworker.js at the root of the app (vite.config.mts): a
 * service worker only controls the pages under its own path. It is a
 * classic script: it must not import anything.
 */

// (a script, not a module: it's registered as a classic service worker)
const sw = self as unknown as ServiceWorkerGlobalScope;

// Control the open pages right away (else clicks in the session that
// registered it would find no page)
sw.addEventListener('install', () => void sw.skipWaiting());
sw.addEventListener('activate', (event) => event.waitUntil(sw.clients.claim()));

sw.addEventListener('notificationclick', (event) => {
    // Android doesn't close the notification when it's clicked
    event.notification.close();
    event.waitUntil(
        sw.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then(async (windows) => {
                // The page in front, else any; none: open Glowing Bear
                const window =
                    windows.find((w) => w.focused) ??
                    windows.find((w) => w.visibilityState === 'visible') ??
                    windows[0];
                if (!window) {
                    await sw.clients.openWindow('./');
                    return;
                }
                window.postMessage({
                    type: 'notificationclick',
                    tag: event.notification.tag,
                });
                await window.focus();
            }),
    );
});
