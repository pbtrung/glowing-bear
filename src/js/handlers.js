'use strict';

/*
 * Handlers for data received from the WeeChat relay "api" protocol: responses
 * to the requests made by the connection service, and events pushed by
 * WeeChat once synchronization is enabled (see eventHandlers below).
 */
var weechat = angular.module('weechat');

weechat.factory('handlers', [
    '$rootScope',
    '$log',
    'models',
    'notifications',
    'bufferResume',
    function ($rootScope, $log, models, notifications, bufferResume) {
        /*
         * Handle the response of GET /api/version
         */
        var handleVersionInfo = function (version) {
            models.versionInfo = version;
            // this eats things like 4.2.0-dev -> [4,2,0]
            models.version = version.weechat_version.split('.').map(function (c) {
                return parseInt(c);
            });
        };

        var handleConfValue = function (name, value) {
            $log.debug('Setting wconfig "' + name + '" to value "' + value + '"');
            models.wconfig[name] = value;
        };

        // inject a fake buffer line for date change if needed
        var injectDateChangeMessageIfNeeded = function (
            buffer,
            manually,
            old_date,
            new_date,
        ) {
            if (buffer.bufferType === 1 || !buffer.dayChange) {
                // Don't add date change messages to free buffers, or when
                // WeeChat doesn't display them for this buffer
                return;
            }
            old_date = new Date(old_date.getTime());
            new_date = new Date(new_date.getTime());
            old_date.setHours(0, 0, 0, 0);
            new_date.setHours(0, 0, 0, 0);
            // Check if the date changed
            if (old_date.valueOf() === new_date.valueOf()) {
                return;
            }
            if (manually) {
                // if the message that caused this date change to be sent
                // would increment buffer.lastSeen, we should increment as
                // well.
                ++buffer.lastSeen;
            }
            var old_date_plus_one = new Date(old_date.getTime());
            old_date_plus_one.setDate(old_date_plus_one.getDate() + 1);
            // it's not always true that a date with time 00:00:00
            // plus one day will be time 00:00:00
            old_date_plus_one.setHours(0, 0, 0, 0);

            var content = '\u001943'; // this colour corresponds to chat_day_change
            // Add day of the week
            content += new_date.toLocaleDateString(window.navigator.language, {
                weekday: 'long',
            });
            // if you're testing different date formats,
            // make sure to test different locales such as "en-US",
            // "en-US-u-ca-persian" (which has different weekdays, year 0, and an ERA)
            // "ja-JP-u-ca-persian-n-thai" (above, diff numbering, diff text)
            var extra_date_format = {
                day: 'numeric',
                month: 'long',
            };
            if (new_date.getFullYear() !== old_date.getFullYear()) {
                extra_date_format.year = 'numeric';
            }
            content +=
                ' (' +
                new_date.toLocaleDateString(
                    window.navigator.language,
                    extra_date_format,
                );
            // Result should be something like
            // Friday (November 27)
            // or if the year is different,
            // Friday (November 27, 2015)

            // Comparing dates in javascript is beyond tedious
            if (old_date_plus_one.valueOf() !== new_date.valueOf()) {
                var date_diff =
                    Math.round((new_date - old_date) / (24 * 60 * 60 * 1000)) + 1;
                if (date_diff < 0) {
                    date_diff = -1 * date_diff;
                    if (date_diff === 1) {
                        content += ', 1 day before';
                    } else {
                        content += ', ' + date_diff + ' days before';
                    }
                } else {
                    content += ', ' + date_diff + ' days later';
                }
                // Result: Friday (November 27, 5 days later)
            }
            content += ')';

            var line = {
                id: -1,
                buffer: buffer.id,
                date: new_date,
                prefix: '\u001943─',
                tags: [],
                displayed: true,
                highlight: false,
                notify_level: -1,
                message: content,
            };
            buffer.addLine(new models.BufferLine(line));
        };

        /*
         * Handle a line of a buffer.
         *
         * @param line line object sent by the relay, with an extra "buffer"
         *             property holding the buffer id
         * @param manually true if the line was explicitly requested (history),
         *                 false if it was pushed by WeeChat (new message)
         */
        var handleLine = function (line, manually) {
            var buffer = models.getBuffer(line.buffer);
            if (buffer === undefined) {
                return;
            }
            var message = new models.BufferLine(line);

            if (buffer.bufferType === 1) {
                // Free content: lines are addressed by their index (y)
                buffer.setFreeLine(message);
                return;
            }

            buffer.requestedLines++;
            // Only react to line if its displayed
            if (!message.displayed) {
                return;
            }
            // Check for date change
            if (buffer.lines.length > 0) {
                var old_date = buffer.lines[buffer.lines.length - 1].date;
                injectDateChangeMessageIfNeeded(
                    buffer,
                    manually,
                    old_date,
                    message.date,
                );
            }

            buffer.addLine(message);

            if (manually) {
                buffer.lastSeen++;
            }

            if (buffer.active && !manually) {
                $rootScope.scrollWithBuffer();
            }

            if (!manually && (!buffer.active || !$rootScope.isWindowFocused())) {
                var server = models.getServerForBuffer(buffer);

                // notify_level: -1 = no notify, 0 = low, 1 = message,
                // 2 = private, 3 = highlight
                var isPrivate = message.notifyLevel === 2;
                var isHighlight = message.highlight || message.notifyLevel === 3;

                if (buffer.notify !== 0 && (isHighlight || isPrivate)) {
                    buffer.notification++;
                    server.unread++;
                    notifications.createHighlight(buffer, message);
                    $rootScope.$emit('notificationChanged');
                } else if (buffer.notify > 1 && message.notifyLevel === 1) {
                    buffer.unread++;
                    server.unread++;
                    $rootScope.$emit('notificationChanged');
                }
            }
        };

        /*
         * Fill the nicklist of a buffer.
         *
         * @param buffer the buffer
         * @param root root nick group sent by the relay (with sub-groups and
         *             nicks)
         */
        var fillNicklist = function (buffer, root) {
            buffer.clearNicklist();
            var addGroup = function (group, isRoot) {
                var g = new models.NickGroup(group);
                var key = isRoot ? 'root' : g.name;
                buffer.nicklist[key] = g;
                buffer.nickGroups[g.id] = key;
                (group.nicks || []).forEach(function (n) {
                    buffer.addNick(key, new models.Nick(n));
                });
                (group.groups || []).forEach(function (sub) {
                    addGroup(sub, false);
                });
            };
            addGroup(root, true);
        };

        /*
         * Handle the response of GET /api/buffers/{id}/nicks
         */
        var handleNicklist = function (bufferId, root) {
            var buffer = models.getBuffer(bufferId);
            if (buffer === undefined) {
                return;
            }
            fillNicklist(buffer, root);
            //check if nicklist should be hidden or not
            $rootScope.$emit('nickListChanged');
        };

        var addNewBuffer = function (message) {
            var buffer = new models.Buffer(message);
            if (buffer.type === 'server') {
                models.registerServer(buffer);
            }
            models.addBuffer(buffer);
            return buffer;
        };

        /*
         * Handle the response of GET /api/buffers
         */
        var handleBufferInfo = function (buffers) {
            buffers.forEach(function (message) {
                var buffer = models.getBuffer(message.id);
                if (buffer !== undefined) {
                    // We already know this buffer
                    models.updateBuffer(buffer, message);
                    // reset unread counts, hotlist info will arrive shortly
                    var server = models.getServerForBuffer(buffer);
                    server.unread -= buffer.unread + buffer.notification;
                    buffer.notification = 0;
                    buffer.unread = 0;
                    buffer.lastSeen = -1;
                } else {
                    buffer = addNewBuffer(message);
                    // Switch to first buffer on startup
                    if (bufferResume.shouldResume(buffer)) {
                        models.setActiveBuffer(buffer.id);
                    }
                }
            });
            // If there was no buffer to automatically load, go to the first one.
            if (!bufferResume.wasAbleToResume() && buffers.length > 0) {
                models.setActiveBuffer(buffers[0].id);
            }
        };

        /*
         * Handle lines requested for a buffer
         * (GET /api/buffers/{id}/lines), oldest line first.
         */
        var handleLineInfo = function (buffer, lines, manually) {
            if (manually === undefined) {
                manually = true;
            }
            lines.forEach(function (l) {
                l.buffer = buffer.id;
                handleLine(l, manually);
            });
            if (buffer.lines.length > 0 && buffer.bufferType === 0) {
                var last_date = buffer.lines[buffer.lines.length - 1].date;
                injectDateChangeMessageIfNeeded(buffer, true, last_date, new Date());
            }
            // Use the read marker of WeeChat the first time lines are loaded
            if (buffer.lastReadLineId >= 0) {
                for (var i = buffer.lines.length - 1; i >= 0; i--) {
                    if (
                        buffer.lines[i] &&
                        buffer.lines[i].id === buffer.lastReadLineId
                    ) {
                        buffer.lastSeen = i;
                        buffer.lastReadLineId = -1;
                        break;
                    }
                }
            }
        };

        /*
         * Handle the response of GET /api/hotlist
         */
        var handleHotlistInfo = function (hotlist) {
            // Hotlist includes only buffers with unread counts so first we
            // iterate all our buffers and resets the counts.
            Object.values(models.getBuffers()).forEach(function (buffer) {
                buffer.unread = 0;
                buffer.notification = 0;
            });
            Object.values(models.getServers()).forEach(function (server) {
                server.unread = 0;
            });
            hotlist.forEach(function (l) {
                var buffer = models.getBuffer(l.buffer_id);
                // If buffer is active in gb, but not active in WeeChat the
                // hotlist in WeeChat will increase but we should ignore that
                // in gb.
                if (buffer === undefined || buffer.active) {
                    return;
                }
                // 1 is message
                buffer.unread = l.count[1];
                // 2 is private, 3 is highlight
                buffer.notification = l.count[2] + l.count[3];
                /* Since there is unread messages, we can guess
                 * what the last read line is and update it accordingly
                 */
                var unreadSum = l.count.reduce(function (memo, num) {
                    return memo + num;
                }, 0);
                buffer.lastSeen = buffer.lines.length - 1 - unreadSum;

                // update server buffer. Don't incude index 0 -> not unreadSum
                models.getServerForBuffer(buffer).unread +=
                    l.count[1] + l.count[2] + l.count[3];
            });
            // the unread badges in the bufferlist doesn't update if we don't do this
            setTimeout(function () {
                $rootScope.$apply();
                $rootScope.$emit('notificationChanged');
            });
        };

        /*
         * Events pushed by WeeChat. Each receives the event message:
         * {event_name, buffer_id, body_type, body}
         */

        var getEventBuffer = function (event) {
            return models.getBuffer(event.buffer_id);
        };

        // Switch to buffers we opened ourselves (e.g. /query)
        var checkOutgoingQuery = function (buffer) {
            var position = models.outgoingQueries.indexOf(buffer.shortName);
            if (position >= 0) {
                models.outgoingQueries.splice(position, 1);
                models.setActiveBuffer(buffer.id);
            }
        };

        var handleBufferOpened = function (event) {
            if (models.getBuffer(event.buffer_id) !== undefined) {
                return;
            }
            var buffer = addNewBuffer(event.body);
            if (event.body.lines && event.body.lines.length > 0) {
                handleLineInfo(buffer, event.body.lines, true);
            }
            if (event.body.nicklist_root) {
                fillNicklist(buffer, event.body.nicklist_root);
            }
            checkOutgoingQuery(buffer);
        };

        // Events whose body is the full buffer: just update its properties
        var handleBufferChanged = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined || !event.body) {
                return;
            }
            models.updateBuffer(buffer, event.body);
        };

        var handleBufferRenamed = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            models.updateBuffer(buffer, event.body);
            // After a buffer opens we get the name change event from WeeChat.
            // Here we check our outgoing commands that open a buffer and
            // switch to it if we find the buffer name in the list
            checkOutgoingQuery(buffer);
        };

        var handleBufferMoved = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            var old_number = buffer.number;
            var new_number = event.body.number;

            Object.values(models.getBuffers()).forEach(function (other) {
                if (other === buffer) {
                    return;
                }
                if (other.number > old_number && other.number <= new_number) {
                    other.number -= 1;
                }
                if (other.number < old_number && other.number >= new_number) {
                    other.number += 1;
                }
            });

            models.updateBuffer(buffer, event.body);
        };

        var handleBufferCleared = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            $log.debug('Handle buffer cleared: ' + buffer.fullName);
            buffer.clear();
            buffer.allLinesFetched = true;
        };

        var handleBufferClosed = function (event) {
            models.closeBuffer(event.buffer_id);
            $rootScope.$emit('notificationChanged');
        };

        var handleBufferLineAdded = function (event) {
            var line = angular.extend({}, event.body, { buffer: event.buffer_id });
            handleLine(line, false);
        };

        var handleBufferLineDataChanged = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            var line = angular.extend({}, event.body, { buffer: event.buffer_id });
            buffer.replaceLine(new models.BufferLine(line));
        };

        var nickGroupKey = function (buffer, groupId) {
            return buffer.nickGroups[groupId];
        };

        var handleNicklistGroupAdded = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined || !buffer.nicklistRequested()) {
                return;
            }
            var group = new models.NickGroup(event.body);
            buffer.nicklist[group.name] = group;
            buffer.nickGroups[group.id] = group.name;
        };

        var handleNicklistGroupChanged = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            var key = nickGroupKey(buffer, event.body.id);
            if (key !== undefined && buffer.nicklist[key]) {
                buffer.nicklist[key].visible = event.body.visible !== false;
            }
        };

        var handleNicklistGroupRemoving = function (event) {
            var buffer = getEventBuffer(event);
            if (buffer === undefined) {
                return;
            }
            var key = nickGroupKey(buffer, event.body.id);
            if (key !== undefined && key !== 'root') {
                delete buffer.nicklist[key];
                delete buffer.nickGroups[event.body.id];
            }
        };

        var nickEventHandler = function (action) {
            return function (event) {
                var buffer = getEventBuffer(event);
                if (buffer === undefined) {
                    return;
                }
                var key = nickGroupKey(buffer, event.body.parent_group_id);
                if (key === undefined) {
                    return;
                }
                buffer[action](key, new models.Nick(event.body));
                $rootScope.$emit('nickListChanged');
            };
        };

        var handleUpgrade = function () {
            $rootScope.weechatUpgrading = true;
            // The WebSocket compression state doesn't survive the upgrade:
            // the connection service reconnects once WeeChat is back
            $rootScope.$emit('relayUpgrade');
        };

        var handleUpgradeEnded = function () {
            $rootScope.weechatUpgrading = false;
            // Buffers and lines may have changed: fetch everything again
            $rootScope.$emit('relayResync');
        };

        var handleQuit = function () {
            $log.info('WeeChat is quitting');
            $rootScope.weechatQuit = true;
        };

        var ignoreEvent = function () {};

        var eventHandlers = {
            buffer_opened: handleBufferOpened,
            buffer_type_changed: handleBufferChanged,
            buffer_moved: handleBufferMoved,
            buffer_merged: handleBufferChanged,
            buffer_unmerged: handleBufferChanged,
            buffer_hidden: handleBufferChanged,
            buffer_unhidden: handleBufferChanged,
            buffer_renamed: handleBufferRenamed,
            buffer_title_changed: handleBufferChanged,
            buffer_modes_changed: handleBufferChanged,
            buffer_notify_changed: handleBufferChanged,
            buffer_time_for_each_line_changed: handleBufferChanged,
            buffer_prefix_for_each_line_changed: handleBufferChanged,
            buffer_day_change_changed: handleBufferChanged,
            buffer_localvar_added: handleBufferChanged,
            buffer_localvar_changed: handleBufferChanged,
            buffer_localvar_removed: handleBufferChanged,
            buffer_cleared: handleBufferCleared,
            buffer_closing: handleBufferChanged,
            buffer_closed: handleBufferClosed,
            buffer_line_added: handleBufferLineAdded,
            buffer_line_data_changed: handleBufferLineDataChanged,
            input_prompt_changed: handleBufferChanged,
            input_text_changed: handleBufferChanged,
            input_text_cursor_moved: handleBufferChanged,
            nicklist_group_added: handleNicklistGroupAdded,
            nicklist_group_changed: handleNicklistGroupChanged,
            nicklist_group_removing: handleNicklistGroupRemoving,
            nicklist_nick_added: nickEventHandler('addNick'),
            nicklist_nick_changed: nickEventHandler('updateNick'),
            nicklist_nick_removing: nickEventHandler('delNick'),
            upgrade: handleUpgrade,
            upgrade_ended: handleUpgradeEnded,
            quit: handleQuit,
            // Date changes are shown by injecting lines when needed
            day_changed: ignoreEvent,
        };

        var handleEvent = function (event) {
            if (event.event_name in eventHandlers) {
                eventHandlers[event.event_name](event);
            } else {
                $log.debug('Unhandled event received: ' + event.event_name);
            }
        };

        $rootScope.$on('onMessage', function (angularEvent, message) {
            handleEvent(message);
        });

        return {
            handleVersionInfo: handleVersionInfo,
            handleConfValue: handleConfValue,
            handleEvent: handleEvent,
            handleLineInfo: handleLineInfo,
            handleHotlistInfo: handleHotlistInfo,
            handleNicklist: handleNicklist,
            handleBufferInfo: handleBufferInfo,
        };
    },
]);
