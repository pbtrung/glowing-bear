/*
 * Service worker: shows the notifications on Android (pages can't create
 * them there) and sends their clicks back to the page, which switches to the
 * buffer (see src/app/notifications.ts).
 *
 * Built to serviceworker.js at the root of the app (vite.config.mts): a
 * service worker only controls the pages under its own path.
 */
// (a script, not a module: it's registered as a classic service worker)
const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('notificationclick', (event) => {
    // Android doesn't close the notification when it's clicked
    event.notification.close();
    event.waitUntil(
        sw.clients.matchAll({ type: 'window' }).then(async (windows) => {
            const window = windows[0];
            if (!window) {
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
