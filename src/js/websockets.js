'use strict';

/*
 * WebSocket transport for the WeeChat relay "api" protocol.
 *
 * Requests are JSON objects {request, body, request_id}; responses carry the
 * same request_id back, which is used to resolve the promise returned by
 * send(). Messages with code 0 are events pushed by WeeChat (after a sync
 * request) and are emitted on $rootScope as 'onMessage'.
 */
var websockets = angular.module('ngWebsockets', []);

websockets.factory('ngWebsockets', [
    '$rootScope',
    '$q',
    function ($rootScope, $q) {
        var ws = null;
        var callbacks = {};
        var currentCallBackId = 0;

        /*
         * Fails every currently subscribed callback for the given reason
         *
         * @param reason reason for failure
         */
        var failCallbacks = function (reason) {
            for (var id in callbacks) {
                callbacks[id].reject(reason);
            }
            callbacks = {};
        };

        var nextRequestId = function () {
            currentCallBackId = (currentCallBackId + 1) % 100000;
            return 'gb' + currentCallBackId;
        };

        /*
         * Build a request object.
         *
         * @param method HTTP method (GET, POST, ...)
         * @param path resource path, e.g. "/api/buffers?lines=-100"
         * @param body optional request body
         */
        var request = function (method, path, body) {
            var req = { request: method + ' ' + path };
            if (body !== undefined) {
                req.body = body;
            }
            return req;
        };

        /*
         * Send a request and return a promise resolved with the response
         * (rejected with the response if its code is an HTTP error).
         *
         * @param req request object (see request())
         * @returns a promise
         */
        var send = function (req) {
            var defer = $q.defer();
            var id = nextRequestId();
            callbacks[id] = defer;
            req = angular.extend({}, req, { request_id: id });
            try {
                ws.send(JSON.stringify(req));
            } catch (e) {
                delete callbacks[id];
                defer.reject(e);
            }
            return defer.promise;
        };

        /*
         * Send several requests and return a promise resolved when all
         * responses have arrived.
         */
        var sendAll = function (reqs) {
            return $q.all(reqs.map(send));
        };

        var onmessage = function (evt) {
            var messages;
            try {
                messages = JSON.parse(evt.data);
            } catch (e) {
                // The stream is corrupted (this happens with compressed
                // frames after a /upgrade of WeeChat): reconnect
                console.error('Unable to parse relay message, reconnecting', e);
                abort('corrupted stream');
                return;
            }
            if (!Array.isArray(messages)) {
                messages = [messages];
            }
            messages.forEach(function (message) {
                var id = message.request_id;
                if (message.code !== 0 && id && id in callbacks) {
                    var defer = callbacks[id];
                    delete callbacks[id];
                    if (message.code >= 400) {
                        defer.reject(message);
                    } else {
                        defer.resolve(message);
                    }
                } else if (message.code === 0) {
                    $rootScope.$emit('onMessage', message);
                } else if (message.code >= 400) {
                    console.warn('Relay error response', message);
                }
            });
            // Make sure all UI is updated with new data
            $rootScope.$apply();
        };

        /*
         * Open the websocket.
         *
         * @param url websocket URL
         * @param protocols sub-protocols (used for authentication)
         * @param properties event handlers (onopen, onclose, onerror)
         */
        var connect = function (url, protocols, properties) {
            if (ws !== null && ws.readyState !== WebSocket.CLOSED) {
                ws.onopen = null;
                ws.onclose = null;
                ws.onerror = null;
                ws.onmessage = null;
                ws.close();
            }
            failCallbacks('reconnect');
            ws = new WebSocket(url, protocols);
            for (var property in properties) {
                ws[property] = properties[property];
            }
            ws.onmessage = onmessage;
        };

        var disconnect = function () {
            if (ws !== null) {
                ws.close();
            }
        };

        /*
         * Drop the connection without waiting for the closing handshake
         * (which never completes if the relay doesn't answer), and run the
         * close handler right away.
         */
        var abort = function (reason) {
            if (ws === null) {
                return;
            }
            var onclose = ws.onclose;
            ws.onopen = null;
            ws.onclose = null;
            ws.onerror = null;
            ws.onmessage = null;
            try {
                ws.close();
            } catch (e) {
                // already closed
            }
            ws = null;
            if (onclose) {
                onclose({ code: 4000, reason: reason || 'aborted' });
            }
        };

        var isOpen = function () {
            return ws !== null && ws.readyState === WebSocket.OPEN;
        };

        return {
            request: request,
            send: send,
            sendAll: sendAll,
            connect: connect,
            disconnect: disconnect,
            abort: abort,
            isOpen: isOpen,
            failCallbacks: failCallbacks,
        };
    },
]);
