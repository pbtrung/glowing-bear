'use strict';

/*
 * Connection to WeeChat using the relay "api" protocol (WeeChat >= 4.1).
 *
 * Connecting is done in two steps:
 *   1. POST /api/handshake (HTTP, no authentication) to agree on the
 *      password hash algorithm;
 *   2. open the WebSocket on /api, authenticated through a sub-protocol,
 *      fetch buffers and hotlist, then enable synchronization so WeeChat
 *      pushes events.
 * If the WebSocket is refused, GET /api/version (HTTP, authenticated) tells
 * us why, e.g. a wrong password: the WebSocket API gives no details at all.
 */

import {
    base64,
    buildCredentials,
    describeAuthError,
    relayUrls,
    supportedHashAlgos,
    websocketProtocols,
} from './relay-auth';
import { weechatTimeFormatToAngular } from './time-format';

// WeeChat options we use, with their default values (used if they can't be
// fetched: the /api/options resource is newer than WeeChat 4.10)
var WEECHAT_OPTIONS = {
    'weechat.look.buffer_time_format': '%H:%M:%S',
    'weechat.completion.nick_completer': ':',
    'weechat.completion.nick_add_space': 'on',
};

// Interval between keepalive pings, and how long we wait for the answer
var PING_INTERVAL = 30000;
var PING_TIMEOUT = 15000;

// Interval between hotlist refreshes
var HOTLIST_INTERVAL = 60000;

export const connectionFactory = [
    '$rootScope',
    '$log',
    'handlers',
    'models',
    'settings',
    'ngWebsockets',
    function ($rootScope, $log, handlers, models, settings, ngWebsockets) {
        var request = ngWebsockets.request;

        var connectionData = [];
        var reconnectTimer;
        var hotlistInterval;
        var pingInterval;
        var pingTimeout;

        // Global connection lock to prevent multiple connections from being opened
        var locked = false;

        var resetErrors = function () {
            $rootScope.passwordError = false;
            $rootScope.authErrorMessage = '';
            $rootScope.errorMessage = false;
            $rootScope.tlsError = false;
            $rootScope.securityError = false;
            $rootScope.hashAlgorithmDisagree = false;
            $rootScope.totpUnsupported = false;
            $rootScope.weechatQuit = false;
        };

        var stopTimers = function () {
            clearInterval(hotlistInterval);
            clearInterval(pingInterval);
            clearTimeout(pingTimeout);
        };

        var parseJsonResponse = function (response) {
            return response
                .json()
                .catch(function () {
                    return {};
                })
                .then(function (json) {
                    return { status: response.status, ok: response.ok, json: json };
                });
        };

        /*
         * Step 1: handshake, to agree on a password hash algorithm
         */
        var handshake = function (urls) {
            // No Content-Type header: this keeps it a "simple" CORS request
            return fetch(urls.http + '/handshake', {
                method: 'POST',
                body: JSON.stringify({ password_hash_algo: supportedHashAlgos() }),
            })
                .then(parseJsonResponse)
                .then(function (res) {
                    if (!res.ok) {
                        var err = new Error('Handshake failed: HTTP ' + res.status);
                        err.relayError = res.json.error;
                        throw err;
                    }
                    return res.json;
                });
        };

        /*
         * Step 2: check credentials, returns the WeeChat version
         */
        var checkCredentials = function (urls, credentials) {
            return fetch(urls.http + '/version', {
                headers: { Authorization: 'Basic ' + base64(credentials) },
            })
                .then(parseJsonResponse)
                .then(function (res) {
                    if (res.status === 401) {
                        var err = new Error('Authentication failed');
                        err.authError = res.json.error;
                        throw err;
                    }
                    if (!res.ok) {
                        throw new Error('Version request failed: HTTP ' + res.status);
                    }
                    return res.json;
                });
        };

        /*
         * Fetch the value of a WeeChat option (GET /api/options/{name})
         */
        var fetchConfValue = function (name) {
            return ngWebsockets
                .send(request('GET', '/api/options/' + encodeURIComponent(name)))
                .then(
                    function (response) {
                        var value = response.body.value;
                        if (typeof value === 'boolean') {
                            value = value ? 'on' : 'off';
                        }
                        return value === null ? WEECHAT_OPTIONS[name] : value;
                    },
                    function () {
                        return WEECHAT_OPTIONS[name];
                    },
                )
                .then(function (value) {
                    handlers.handleConfValue(name, value);
                });
        };

        var updateTimeFormat = function () {
            $rootScope.angularTimeFormat = weechatTimeFormatToAngular(
                models.wconfig['weechat.look.buffer_time_format'],
            );
        };

        var requestHotlist = function () {
            return ngWebsockets.send(request('GET', '/api/hotlist')).then(function (r) {
                handlers.handleHotlistInfo(r.body);
            });
        };

        var requestBuffers = function () {
            return ngWebsockets
                .send(request('GET', '/api/buffers?colors=weechat'))
                .then(function (r) {
                    handlers.handleBufferInfo(r.body);
                });
        };

        var requestScripts = function () {
            return ngWebsockets.send(request('GET', '/api/scripts')).then(
                function (r) {
                    models.scripts = r.body || [];
                    return models.scripts;
                },
                function () {
                    return models.scripts;
                },
            );
        };

        /*
         * Send a ping; close the connection if WeeChat doesn't answer in
         * time, which triggers a reconnection.
         */
        var ping = function () {
            if (!ngWebsockets.isOpen()) {
                return;
            }
            clearTimeout(pingTimeout);
            pingTimeout = setTimeout(function () {
                $log.warn('No answer to ping, closing connection');
                ngWebsockets.abort('ping timeout');
            }, PING_TIMEOUT);
            ngWebsockets
                .send(request('POST', '/api/ping', { data: String(Date.now()) }))
                .then(function () {
                    clearTimeout(pingTimeout);
                });
        };

        /*
         * Fetch buffers, hotlist and options, then enable synchronization.
         * Requests are processed in order by WeeChat, so we don't miss events
         * between the buffer list and the sync.
         */
        var initialSync = function () {
            // Use defaults until (and unless) the real values arrive
            angular.forEach(WEECHAT_OPTIONS, function (value, name) {
                if (models.wconfig[name] === undefined) {
                    models.wconfig[name] = value;
                }
            });
            updateTimeFormat();

            var buffersLoaded = requestBuffers();
            requestHotlist();
            ngWebsockets.send(
                request('POST', '/api/sync', {
                    sync: true,
                    nicks: true,
                    input: false,
                    colors: 'weechat',
                }),
            );
            fetchConfValue('weechat.look.buffer_time_format').then(updateTimeFormat);
            fetchConfValue('weechat.completion.nick_completer');
            fetchConfValue('weechat.completion.nick_add_space');
            requestScripts();
            return buffersLoaded;
        };

        var resync = function () {
            if (!$rootScope.connected) {
                return;
            }
            var active = models.getActiveBuffer();
            var activeId = active ? active.id : null;
            models.reinitialize();
            requestBuffers().then(function () {
                if (activeId !== null) {
                    models.setActiveBuffer(activeId);
                }
                requestHotlist();
            });
        };
        $rootScope.$on('relayResync', resync);

        // WeeChat is upgrading: frames received after the upgrade can't be
        // decompressed with the current WebSocket, so close it. This triggers
        // a reconnection, which reloads everything once WeeChat is back.
        $rootScope.$on('relayUpgrade', function () {
            $log.info('WeeChat is upgrading, reconnecting');
            ngWebsockets.abort('upgrade');
        });

        // Takes care of the connection and websocket hooks
        var connect = function (
            host,
            port,
            path,
            passwd,
            tls,
            successCallback,
            failCallback,
        ) {
            if (locked) {
                // We already have an open connection
                $log.debug('Aborting connection (lock in use)');
                return;
            }
            locked = true;

            resetErrors();
            connectionData = [host, port, path, passwd, tls];
            var urls = relayUrls(host, port, path, tls);
            $log.debug('Connecting to relay: ', urls.http);

            var fail = function (err) {
                $log.error('Unable to connect to relay', err);
                locked = false;
                stopTimers();
                $rootScope.$emit('relayDisconnect');
                if (failCallback) {
                    failCallback();
                }
                $rootScope.$applyAsync();
            };

            // Browsers block unencrypted connections from pages served over https
            if (window.location.protocol === 'https:' && !tls) {
                $rootScope.securityError = true;
                $rootScope.errorMessage = true;
                fail(new Error('Unencrypted relay on a secure page'));
                return;
            }

            // The WebSocket handshake gives no details when it's refused:
            // ask the HTTP API why. This is only done on failure, so that
            // the WebSocket is never opened after an HTTP request (a client
            // reusing that keep-alive connection for the upgrade would fail).
            var diagnose = function (credentials, evt) {
                checkCredentials(urls, credentials)
                    .then(function () {
                        $rootScope.errorMessage = true;
                        $rootScope.tlsError = !!tls && evt.code === 1006;
                    })
                    .catch(function (err) {
                        if (err.authError !== undefined) {
                            $rootScope.passwordError = true;
                            $rootScope.authErrorMessage = describeAuthError(
                                err.authError,
                            );
                        } else {
                            $rootScope.errorMessage = true;
                            $rootScope.tlsError = !!tls;
                        }
                    })
                    .then(function () {
                        fail(new Error('WebSocket refused: ' + evt.code));
                    });
            };

            handshake(urls)
                .then(function (result) {
                    if (result.totp) {
                        // TOTP is sent in the x-weechat-totp header, which
                        // browsers can't set on a WebSocket
                        $rootScope.totpUnsupported = true;
                        throw new Error('TOTP is enabled in WeeChat');
                    }
                    if (!result.password_hash_algo) {
                        $rootScope.hashAlgorithmDisagree = true;
                        throw new Error('No common password hash algorithm');
                    }
                    return buildCredentials(
                        passwd,
                        result.password_hash_algo,
                        result.password_hash_iterations,
                    );
                })
                .then(function (credentials) {
                    openWebSocket(urls, credentials, successCallback, fail, diagnose);
                })
                .catch(function (err) {
                    if (
                        !$rootScope.totpUnsupported &&
                        !$rootScope.hashAlgorithmDisagree
                    ) {
                        // Network error: relay not reachable, invalid
                        // certificate, not an "api" relay, ...
                        $rootScope.errorMessage = true;
                        $rootScope.tlsError = !!tls;
                    }
                    fail(err);
                });
        };

        /*
         * Step 3: open the WebSocket and load data
         */
        var openWebSocket = function (
            urls,
            credentials,
            successCallback,
            fail,
            diagnose,
        ) {
            var opened = false;

            var onopen = function () {
                opened = true;
                $log.info('Connected to relay');
                ngWebsockets
                    .send(request('GET', '/api/version'))
                    .then(function (response) {
                        handlers.handleVersionInfo(response.body);
                        $rootScope.weechatUpgrading = false;
                        $rootScope.connected = true;
                        $rootScope.waseverconnected = true;
                        return initialSync();
                    })
                    .then(function () {
                        if (settings.hotlistsync) {
                            // Refresh the hotlist every so often so that this
                            // client will have unread counts (mostly) in sync
                            // with other clients or terminal usage directly.
                            clearInterval(hotlistInterval);
                            hotlistInterval = setInterval(function () {
                                if ($rootScope.connected) {
                                    requestHotlist();
                                }
                            }, HOTLIST_INTERVAL);
                        }
                        clearInterval(pingInterval);
                        pingInterval = setInterval(ping, PING_INTERVAL);
                        if (successCallback) {
                            successCallback();
                        }
                    })
                    .catch(function (err) {
                        $log.error('Initial synchronization failed', err);
                        ngWebsockets.disconnect();
                    });
            };

            var onclose = function (evt) {
                /*
                 * Handles websocket disconnection
                 */
                $log.info('Disconnected from relay', evt.code, evt.reason);
                var wasConnected = $rootScope.connected && !$rootScope.reconnecting;
                stopTimers();
                ngWebsockets.failCallbacks('disconnection');
                locked = false;
                $rootScope.$emit('relayDisconnect');
                if ($rootScope.userdisconnect) {
                    $rootScope.userdisconnect = false;
                    $rootScope.connected = false;
                } else if (wasConnected) {
                    // Keep the UI (with the reconnect banner) while we
                    // try to reconnect
                    reconnect();
                } else if ($rootScope.reconnecting || opened) {
                    fail(new Error('WebSocket closed: ' + evt.code));
                } else {
                    // The WebSocket was refused: find out why
                    diagnose(credentials, evt);
                }
                $rootScope.$applyAsync();
            };

            var onerror = function (evt) {
                /*
                 * Handles cases when connection issues come from
                 * the relay.
                 */
                $log.error('Relay error', evt);
            };

            try {
                ngWebsockets.connect(urls.ws, websocketProtocols(credentials), {
                    onopen: onopen,
                    onclose: onclose,
                    onerror: onerror,
                });
            } catch (e) {
                $log.debug('Websocket caught DOMException:', e);
                $rootScope.errorMessage = true;
                $rootScope.securityError = true;
                fail(e);
            }
        };

        var attemptReconnect = function (bufferId, timeout) {
            $log.info('Attempting to reconnect...');
            var d = connectionData;
            connect(
                d[0],
                d[1],
                d[2],
                d[3],
                d[4],
                function () {
                    $rootScope.reconnecting = false;
                    // on success, update active buffer
                    models.setActiveBuffer(bufferId);
                    $log.info('Sucessfully reconnected to relay');
                },
                function () {
                    // on failure, schedule another attempt
                    if (timeout >= 600000) {
                        // If timeout is ten minutes or more, give up
                        $log.info('Failed to reconnect, giving up');
                        $rootScope.reconnecting = false;
                        $rootScope.connected = false;
                    } else {
                        $log.info(
                            'Failed to reconnect, scheduling next attempt in',
                            timeout / 1000,
                            'seconds',
                        );
                        clearTimeout(reconnectTimer);
                        reconnectTimer = setTimeout(function () {
                            // exponential timeout increase
                            attemptReconnect(bufferId, timeout * 1.5);
                        }, timeout);
                    }
                },
            );
        };

        var reconnect = function () {
            if (connectionData.length < 5) {
                // something is wrong
                $log.error('Cannot reconnect, connection information is missing');
                return;
            }

            var active = models.getActiveBuffer();
            var bufferId = active ? active.id : null,
                timeout = 3000; // start with a three-second timeout

            // reinitialise everything, clear all buffers
            models.reinitialize();
            $rootScope.reconnecting = true;

            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(function () {
                attemptReconnect(bufferId, timeout);
            }, timeout);
        };

        var disconnect = function () {
            $log.info('Disconnecting from relay');
            $rootScope.userdisconnect = true;
            $rootScope.reconnecting = false;
            clearTimeout(reconnectTimer);
            stopTimers();
            ngWebsockets.disconnect();
            ngWebsockets.failCallbacks('disconnection');
            $rootScope.connected = false;
            locked = false; // release the connection lock
            $rootScope.$emit('relayDisconnect');
        };

        /*
         * Send text or a command to a buffer (POST /api/input)
         *
         * @param message the text or command
         * @param buffer target buffer (defaults to the active buffer)
         * @returns the angular promise
         */
        var sendMessage = function (message, buffer) {
            buffer = buffer || models.getActiveBuffer();
            return ngWebsockets.send(
                request('POST', '/api/input', {
                    buffer_id: buffer.id,
                    command: message,
                }),
            );
        };

        var sendCoreCommand = function (command) {
            return ngWebsockets.send(
                request('POST', '/api/input', {
                    buffer_name: 'core.weechat',
                    command: command,
                }),
            );
        };

        var sendHotlistClear = function () {
            var buffer = models.getActiveBuffer();
            if (!buffer) {
                return;
            }
            // Remove the buffer from the hotlist and move the read marker
            sendMessage('/buffer set hotlist -1', buffer);
            sendMessage('/input set_unread_current_buffer', buffer);
        };

        var sendHotlistClearAll = function () {
            sendCoreCommand('/hotlist clear');
        };

        var requestNicklist = function (bufferId, callback) {
            // Prevent requesting nicklist for all buffers if bufferId is invalid
            if (!bufferId) {
                return;
            }
            ngWebsockets
                .send(
                    request(
                        'GET',
                        '/api/buffers/' + bufferId + '/nicks?colors=weechat',
                    ),
                )
                .then(function (response) {
                    handlers.handleNicklist(bufferId, response.body);
                    if (callback !== undefined) {
                        callback();
                    }
                });
        };

        var fetchMoreLines = function (numLines) {
            $log.debug('Fetching ', numLines, ' lines');
            var buffer = models.getActiveBuffer();
            if (numLines === undefined) {
                // Math.max(undefined, *) = NaN -> need a number here
                numLines = 0;
            }
            // Calculate number of lines to fetch, at least as many as the parameter
            numLines = Math.max(numLines, buffer.requestedLines * 2);

            // Indicator that we are loading lines, hides "load more lines" link
            $rootScope.loadingLines = true;
            return ngWebsockets
                .send(
                    request(
                        'GET',
                        '/api/buffers/' +
                            buffer.id +
                            '/lines?lines=-' +
                            numLines +
                            '&colors=weechat',
                    ),
                )
                .then(function (response) {
                    var lines = response.body || [];
                    // delete old lines and add new ones
                    var oldLength = buffer.lines.length;
                    // whether we already had all unread lines
                    var hadAllUnreadLines = buffer.lastSeen >= 0;

                    // clear the old lines
                    buffer.lines.length = 0;
                    // We need to set the number of requested lines to 0 here, because parsing a line
                    // increments it. This is needed to also count newly arriving lines while we're
                    // already connected.
                    buffer.requestedLines = 0;

                    // Parse the lines
                    handlers.handleLineInfo(buffer, lines, true);

                    // Correct the read marker for the lines that were counted twice
                    buffer.lastSeen -= oldLength;

                    // We requested more lines than we got, no more lines.
                    if (lines.length < numLines) {
                        buffer.allLinesFetched = true;
                    }
                    $rootScope.loadingLines = false;

                    // Only scroll to read marker if we didn't have all unread lines previously, but have them now
                    var scrollToReadmarker = !hadAllUnreadLines && buffer.lastSeen >= 0;
                    // Scroll to correct position
                    $rootScope.scrollWithBuffer(scrollToReadmarker, true);
                })
                .catch(function (err) {
                    $log.error('Unable to fetch lines', err);
                    $rootScope.loadingLines = false;
                });
        };

        /*
         * Ask WeeChat to complete the input (POST /api/completion)
         *
         * @return promise resolving to {context, base_word, position_replace,
         *         add_space, list}
         */
        var requestCompletion = function (bufferId, position, data) {
            // Prevent requesting completion if bufferId is invalid
            if (!bufferId) {
                return;
            }

            return ngWebsockets
                .send(
                    request('POST', '/api/completion', {
                        buffer_id: bufferId,
                        command: data,
                        position: position,
                    }),
                )
                .then(function (response) {
                    return response.body;
                });
        };

        return {
            connect: connect,
            disconnect: disconnect,
            sendMessage: sendMessage,
            sendCoreCommand: sendCoreCommand,
            sendHotlistClear: sendHotlistClear,
            sendHotlistClearAll: sendHotlistClearAll,
            fetchMoreLines: fetchMoreLines,
            requestNicklist: requestNicklist,
            requestScripts: requestScripts,
            attemptReconnect: attemptReconnect,
            requestCompletion: requestCompletion,
        };
    },
];
