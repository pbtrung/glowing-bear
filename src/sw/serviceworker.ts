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
                // The page in front, else any; none: open Glowing Bear on
                // the buffer (resumed once connected)
                const data = event.notification.data as { buffer?: string } | null;
                const buffer = data?.buffer ?? '';
                const window =
                    windows.find((w) => w.focused) ??
                    windows.find((w) => w.visibilityState === 'visible') ??
                    windows[0];
                if (!window) {
                    await sw.clients.openWindow(
                        buffer ? './#buffer=' + encodeURIComponent(buffer) : './',
                    );
                    return;
                }
                // (it may not be the page that showed it: the buffer is sent)
                window.postMessage({
                    type: 'notificationclick',
                    tag: event.notification.tag,
                    buffer,
                });
                await window.focus();
            }),
    );
});
