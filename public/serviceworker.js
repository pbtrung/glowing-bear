// Service worker: shows the notifications on Android (pages can't create
// them there) and sends their clicks back to the page.
// File needs to be stored in the root of the app.

this.onnotificationclick = function (event) {
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // Focus the open window, and tell it which notification was clicked
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                client.postMessage({
                    type: 'notificationclick',
                    tag: event.notification.tag,
                });
                if ('focus' in client) {
                    return client.focus();
                }
            }
        }),
    );
};
