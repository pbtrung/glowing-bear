/*
 * This file contains the weechat models and various
 * helper methods to work with them.
 */
'use strict';

import { rawText2Rich } from './weechat-colors';
import { sortBy } from './misc';

var models = angular.module('weechatModels', []);

// Buffer "notify" property as sent by the relay, mapped to WeeChat's levels
var NOTIFY_LEVELS = { none: 0, highlight: 1, message: 2, all: 3 };

models.service('models', [
    '$rootScope',
    '$filter',
    'bufferResume',
    function ($rootScope, $filter, bufferResume) {
        // WeeChat version, e.g. [4, 10, 1]
        this.version = null;

        // Full response of GET /api/version
        this.versionInfo = null;

        // Loaded scripts (GET /api/scripts)
        this.scripts = [];

        // WeeChat configuration values
        this.wconfig = {};

        // Save outgoing queries
        this.outgoingQueries = [];

        var parseRichText = function (text) {
            if (!text) {
                return [{ text: text || '', classes: [] }];
            }

            var textElements = rawText2Rich(text),
                typeToClassPrefixFg = {
                    option: 'cof-',
                    weechat: 'cwf-',
                    ext: 'cef-',
                },
                typeToClassPrefixBg = {
                    option: 'cob-',
                    weechat: 'cwb-',
                    ext: 'ceb-',
                };

            textElements.forEach(function (textEl) {
                textEl.classes = [];

                // foreground color
                var prefix = typeToClassPrefixFg[textEl.fgColor.type];
                textEl.classes.push(prefix + textEl.fgColor.name);

                // background color
                prefix = typeToClassPrefixBg[textEl.bgColor.type];
                textEl.classes.push(prefix + textEl.bgColor.name);

                // attributes
                if (textEl.attrs.name !== null) {
                    textEl.classes.push('coa-' + textEl.attrs.name);
                }
                var attr, val;
                for (attr in textEl.attrs.override) {
                    val = textEl.attrs.override[attr];
                    if (val) {
                        textEl.classes.push('a-' + attr);
                    } else {
                        textEl.classes.push('a-no-' + attr);
                    }
                }
            });
            if (textElements.length === 0) {
                return [{ text: '', classes: [] }];
            }
            return textElements;
        };
        this.parseRichText = parseRichText;

        var plainText = function (richText) {
            return richText
                .map(function (part) {
                    return part.text;
                })
                .join('');
        };

        /*
         * Update a buffer with the properties of a buffer object sent by the
         * relay (GET /api/buffers, or the body of a buffer_* event).
         *
         * @param buffer the Buffer object to update
         * @param message the buffer object sent by the relay
         */
        var updateBuffer = function (buffer, message) {
            var localVars = message.local_variables || {};
            var shortNameRich = parseRichText(message.short_name);
            var shortName = plainText(shortNameRich);

            buffer.fullName = message.name;
            buffer.shortName = shortName;
            // Use color from short name
            buffer.nameClasses = shortNameRich[0].classes;
            // If it's a channel, trim away the prefix (#, &, or +). If that is
            // empty and the buffer has a short name, use a space (because the
            // prefix will be displayed separately, and we don't want prefix +
            // fullname, which would happen otherwise). Else, use null so that
            // full_name is used
            buffer.trimmedName =
                shortName.replace(/^[#&+]/, '') || (shortName ? ' ' : null);
            // get channel identifier
            buffer.prefix =
                ['#', '&', '+'].indexOf(shortName.charAt(0)) >= 0
                    ? shortName.charAt(0)
                    : '';
            buffer.title = parseRichText(message.title);
            buffer.rtitle = plainText(buffer.title);
            buffer.modes = message.modes || '';
            buffer.number = message.number;
            buffer.hidden = !!message.hidden;
            // 0 = formatted (normal); 1 = free
            buffer.bufferType = message.type === 'free' ? 1 : 0;
            if (message.notify in NOTIFY_LEVELS) {
                buffer.notify = NOTIFY_LEVELS[message.notify];
            }

            buffer.localVariables = localVars;
            // If type is undefined set it as other to avoid later errors
            buffer.type = localVars.type || 'other';
            buffer.indent = ['channel', 'private'].indexOf(buffer.type) >= 0;
            buffer.plugin = localVars.plugin;
            buffer.server = localVars.server;
            buffer.pinned = localVars.pinned === 'true';

            // Server buffers have this "irc.server.libera" naming schema, which
            // messes the sorting up. We need it to be "irc.libera" instead.
            // Lowercase it so alt+up/down traverses buffers in the same order
            // angular's sortBy directive puts them in
            buffer.serverSortKey = (
                buffer.plugin +
                '.' +
                buffer.server +
                (buffer.type === 'server' ? '' : '.' + shortName)
            ).toLowerCase();

            // hide timestamps for certain buffer types, or when WeeChat does
            buffer.hideBufferLineTimes =
                buffer.type === 'relay' || message.time_displayed === false;
            buffer.hidePrefix = message.prefix_displayed === false;
            buffer.dayChange = message.day_change !== false;
            buffer.hasNicklist = message.nicklist !== false;

            buffer.inputPrompt = parseRichText(message.input_prompt);
            buffer.input = message.input || '';
            buffer.inputPosition = message.input_position || 0;
            buffer.inputMultiline = !!message.input_multiline;
            buffer.keys = message.keys || [];
            if (message.last_read_line_id !== undefined) {
                buffer.lastReadLineId = message.last_read_line_id;
            }
        };
        this.updateBuffer = updateBuffer;

        /*
         * Buffer class
         *
         * @param message a buffer object sent by the relay
         */
        this.Buffer = function (message) {
            var lines = [];
            var nicklist = {};
            // Map of nick group id -> key in nicklist
            var nickGroups = {};
            var history = [];
            var historyPos = 0;

            var buffer = {
                id: message.id,
                lines: lines,
                requestedLines: 0,
                allLinesFetched: false,
                active: false,
                notify: 3, // Default 3 == all
                notification: 0,
                unread: 0,
                lastSeen: -1,
                lastReadLineId: -1,
                nicklist: nicklist,
                nickGroups: nickGroups,
                history: history,
            };
            updateBuffer(buffer, message);

            /*
             * Adds a line to this buffer
             *
             * @param line the BufferLine object
             * @return undefined
             */
            buffer.addLine = function (line) {
                lines.push(line);
                updateNickSpeak(line);
            };

            /*
             * Set a line of a buffer with free content: lines are identified
             * by their index (y) instead of being appended.
             */
            buffer.setFreeLine = function (line) {
                if (line.y < 0) {
                    return;
                }
                while (lines.length <= line.y) {
                    lines.push(null);
                }
                lines[line.y] = line;
            };

            /*
             * Replace an existing line (event buffer_line_data_changed)
             */
            buffer.replaceLine = function (line) {
                if (buffer.bufferType === 1) {
                    buffer.setFreeLine(line);
                    return;
                }
                for (var i = lines.length - 1; i >= 0; i--) {
                    if (lines[i] && lines[i].id === line.id) {
                        lines[i] = line;
                        return;
                    }
                }
            };

            /*
             * Adds a nick to nicklist
             */
            buffer.addNick = function (group, nick) {
                if (buffer.nicklistRequested() && nicklist[group] !== undefined) {
                    nick.spokeAt = Date.now();
                    nicklist[group].nicks.push(nick);
                }
            };
            /*
             * Deletes a nick from nicklist
             */
            buffer.delNick = function (group, nick) {
                group = nicklist[group];
                if (group === undefined) {
                    return;
                }
                for (var i = 0; i < group.nicks.length; i++) {
                    if (group.nicks[i].name == nick.name) {
                        group.nicks.splice(i, 1);
                        break;
                    }
                }
            };
            /*
             * Clear the nicklist
             */
            buffer.clearNicklist = function () {
                for (var obj in nicklist) {
                    delete nicklist[obj];
                }
                for (var id in nickGroups) {
                    delete nickGroups[id];
                }
            };

            /*
             * Updates a nick in nicklist
             */
            buffer.updateNick = function (group, nick) {
                group = nicklist[group];
                if (group === undefined) {
                    // We are getting nicklist events for a buffer where not yet
                    // have populated the nicklist, so there will be nothing to
                    // update. Just ignore the event.
                    return;
                }
                for (var i = 0; i < group.nicks.length; i++) {
                    if (group.nicks[i].id === nick.id) {
                        nick.spokeAt = group.nicks[i].spokeAt;
                        group.nicks[i] = nick;
                        break;
                    }
                }
            };

            /*
             * Update a nick with a fresh timestamp so tab completion
             * can use time to complete recent speakers
             */
            var updateNickSpeak = function (line) {
                // Try to find nick from prefix
                var prefix = line.prefix;
                if (prefix.length === 0) {
                    // some scripts produce lines without a prefix
                    return;
                }
                var nick = prefix[prefix.length - 1].text;
                // Action / me, find the nick as the first word of the message
                if (nick === ' *') {
                    var match = line.text.match(/^(.+)\s/);
                    if (match) {
                        nick = match[1];
                    }
                } else if (nick === '' || nick === '=!=') {
                    return;
                }
                for (let groupIdx in nicklist) {
                    let nicks = nicklist[groupIdx].nicks;
                    for (let curr_nick of nicks) {
                        if (curr_nick.name === nick) {
                            curr_nick.spokeAt = Date.now();
                            return;
                        }
                    }
                }
            };

            /*
             * Get a flat nicklist sorted by speaker time. This function is
             * called for every tab key press by the user.
             *
             */
            buffer.getNicklistByTime = function () {
                var newlist = [];
                for (let groupIdx in nicklist) {
                    newlist = newlist.concat(nicklist[groupIdx].nicks);
                }

                newlist.sort(sortBy('spokeAt'));

                return newlist;
            };

            buffer.addToHistory = function (line) {
                var result = '';
                if (historyPos !== history.length) {
                    // Pop cached line from history. Occurs if we submit something from history
                    result = history.pop();
                }
                history.push(line);
                historyPos = history.length; // Go to end of history
                return result;
            };

            buffer.getHistoryUp = function (currentLine) {
                if (historyPos >= history.length) {
                    // cache current line in history
                    history.push(currentLine);
                }
                if (historyPos <= 0 || historyPos >= history.length) {
                    // Can't go up from first message or from out-of-bounds index
                    return currentLine;
                } else {
                    // Go up in history
                    historyPos--;
                    var line = history[historyPos];
                    return line;
                }
            };

            buffer.getHistoryDown = function (currentLine) {
                if (historyPos === history.length) {
                    // stash on history like weechat does
                    if (currentLine !== undefined && currentLine !== '') {
                        history.push(currentLine);
                        historyPos++;
                    }
                    return '';
                } else if (historyPos < 0 || historyPos > history.length) {
                    // Can't go down from out of bounds or last message
                    return currentLine;
                } else {
                    historyPos++;

                    if (history.length > 0 && historyPos == history.length - 1) {
                        // return cached line and remove from cache
                        return history.pop();
                    } else {
                        // Go down in history
                        return history[historyPos];
                    }
                }
            };

            // Check if the nicklist is empty, i.e., no nicks present
            // This checks for the presence of people, not whether a
            // request for the nicklist has been made
            buffer.isNicklistEmpty = function () {
                for (var obj in nicklist) {
                    if (nicklist[obj].nicks.length > 0) {
                        return false;
                    }
                }
                return true;
            };

            buffer.nicklistRequested = function () {
                // If the nicklist has been requested but is empty, it
                // still has a 'root' property. Check for its existence.
                return nicklist.hasOwnProperty('root');
            };

            // Check whether a particular nick is in the nicklist
            buffer.queryNicklist = function (nick) {
                for (var groupIdx in nicklist) {
                    var nicks = nicklist[groupIdx].nicks;
                    for (var nickIdx in nicks) {
                        if (nicks[nickIdx].name === nick) {
                            return true;
                        }
                    }
                }
                return false;
            };

            /* Clear all our buffer lines */
            buffer.clear = function () {
                lines.length = 0;
                buffer.requestedLines = 0;
                buffer.lastSeen = -1;
            };

            return buffer;
        };

        /*
         * BufferLine class
         *
         * @param message a line object sent by the relay, with an extra
         *                "buffer" property holding the buffer id
         */
        this.BufferLine = function (message) {
            var date =
                message.date instanceof Date ? message.date : new Date(message.date);
            var shortTime = $filter('date')(date, 'HH:mm');
            var formattedTime = $filter('date')(date, $rootScope.angularTimeFormat);

            var prefix = parseRichText(message.prefix);
            var tags = message.tags || [];
            var highlight = !!message.highlight;
            var content = parseRichText(message.message);

            // only put invisible angle brackets around nicks in normal messages
            // (for copying/pasting)
            var showHiddenBrackets =
                tags.indexOf('irc_privmsg') >= 0 && tags.indexOf('irc_action') === -1;

            if (highlight) {
                prefix.forEach(function (textEl) {
                    textEl.classes.push('highlight');
                });
            }

            return {
                id: message.id,
                y: message.y,
                prefix: prefix,
                content: content,
                date: date,
                shortTime: shortTime,
                formattedTime: formattedTime,
                buffer: message.buffer,
                tags: tags,
                highlight: highlight,
                notifyLevel:
                    message.notify_level === undefined ? 0 : message.notify_level,
                displayed: message.displayed !== false,
                prefixtext: plainText(prefix),
                text: plainText(content),
                showHiddenBrackets: showHiddenBrackets,
            };
        };

        function nickGetColorClasses(color) {
            var colorClasses = ['cwf-default'];
            if (color && color.length > 0) {
                if (color.match(/^weechat/)) {
                    // color option
                    var colorName = color.match(/[a-zA-Z0-9_]+$/)[0];
                    colorClasses = [
                        'cof-' + colorName,
                        'cob-' + colorName,
                        'coa-' + colorName,
                    ];
                } else {
                    if (color.match(/^[a-zA-Z]+(:|$)/)) {
                        // WeeChat color name (foreground)
                        var cwfcolor = color.match(/^[a-zA-Z]+/)[0];
                        colorClasses = ['cwf-' + cwfcolor];
                    } else if (color.match(/^[0-9]+(:|$)/)) {
                        // extended color (foreground)
                        var cefcolor = color.match(/^[0-9]+/)[0];
                        colorClasses = ['cef-' + cefcolor];
                    }
                    if (color.match(/:[a-zA-Z]+$/)) {
                        // WeeChat color name (background)
                        var cwbcolor = color.match(/:[a-zA-Z]+$/)[0].substring(1);
                        colorClasses.push('cwb-' + cwbcolor);
                    } else if (color.match(/:[0-9]+$/)) {
                        // extended color (background)
                        var cebcolor = color.match(/:[0-9]+$/)[0].substring(1);
                        colorClasses.push('ceb-' + cebcolor);
                    }
                }
            }
            return colorClasses;
        }

        /*
         * Nick class
         *
         * @param message a nick object sent by the relay
         */
        this.Nick = function (message) {
            return {
                id: message.id,
                groupId: message.parent_group_id,
                prefix: message.prefix,
                visible: message.visible !== false,
                name: message.name,
                prefixClasses: nickGetColorClasses(message.prefix_color_name),
                nameClasses: nickGetColorClasses(message.color_name),
            };
        };
        /*
         * Nicklist Group class
         *
         * @param message a nick group object sent by the relay
         */
        this.NickGroup = function (message) {
            return {
                id: message.id,
                name: message.name,
                visible: message.visible !== false,
                nicks: [],
            };
        };

        this.Server = function () {
            var id = 0; // will be set later on
            var unread = 0;

            return {
                id: id,
                unread: unread,
            };
        };

        var activeBuffer = null;
        var previousBuffer = null;

        this.model = { buffers: {}, servers: {} };

        this.registerServer = function (buffer) {
            var key = buffer.plugin + '.' + buffer.server;
            this.getServer(key).id = buffer.id;
        };

        /*
         * Adds a buffer to the list
         *
         * @param buffer buffer object
         * @return undefined
         */
        this.addBuffer = function (buffer) {
            this.model.buffers[buffer.id] = buffer;
        };

        /*
         * Returns the current active buffer
         *
         * @return active buffer object
         */
        this.getActiveBuffer = function () {
            return activeBuffer;
        };

        /*
         * Returns the previous current active buffer
         *
         * @return previous buffer object
         */
        this.getPreviousBuffer = function () {
            return previousBuffer;
        };

        /*
         * Sets the buffer specifiee by bufferId as active.
         * Deactivates the previous current buffer.
         *
         * @param bufferId id of the new active buffer
         * @return true on success, false if buffer was not found
         */
        this.setActiveBuffer = function (bufferId, key) {
            if (key === undefined) {
                key = 'id';
            }

            previousBuffer = this.getActiveBuffer();

            if (key === 'id') {
                activeBuffer = this.model.buffers[bufferId];
            } else {
                activeBuffer = Object.entries(this.model.buffers).find(
                    ([id, buffer]) => {
                        return buffer[key] === bufferId;
                    },
                );
                if (activeBuffer !== undefined) {
                    activeBuffer = activeBuffer[1]; // value not key
                }
            }

            if (activeBuffer === undefined) {
                // Buffer not found, undo assignment
                activeBuffer = previousBuffer;
                return false;
            }

            if (previousBuffer) {
                // turn off the active status for the previous buffer
                previousBuffer.active = false;
                // Save the last line we saw
                previousBuffer.lastSeen = previousBuffer.lines.length - 1;
            }

            var unreadSum = activeBuffer.unread + activeBuffer.notification;

            this.getServerForBuffer(activeBuffer).unread -= unreadSum;

            activeBuffer.active = true;
            activeBuffer.unread = 0;
            activeBuffer.notification = 0;

            $rootScope.$emit('activeBufferChanged', unreadSum);
            $rootScope.$emit('notificationChanged');
            bufferResume.record(activeBuffer);
            return true;
        };

        /*
         * Returns the buffer list
         */
        this.getBuffers = function () {
            return this.model.buffers;
        };

        /*
         * Reinitializes the model
         */
        this.reinitialize = function () {
            this.model.buffers = {};
            this.model.servers = {};
            this.scripts = [];
            activeBuffer = null;
            previousBuffer = null;
        };

        /*
         * Returns a specific buffer object
         *
         * @param bufferId id of the buffer
         * @return the buffer object
         */
        this.getBuffer = function (bufferId) {
            return this.model.buffers[bufferId];
        };

        /*
         * Returns the server list
         */
        this.getServers = function () {
            return this.model.servers;
        };

        /*
         * Returns the server object for a specific key, creating it if it does not exist
         * @param key the server key
         * @return the server object
         */
        this.getServer = function (key) {
            if (this.model.servers[key] === undefined) {
                this.model.servers[key] = this.Server();
            }
            return this.model.servers[key];
        };

        /*
         * Returns info on the server buffer for a specific buffer
         * @param buffer the buffer
         * @return the server object
         */
        this.getServerForBuffer = function (buffer) {
            var key = buffer.plugin + '.' + buffer.server;
            return this.getServer(key);
        };

        /*
         * Closes a weechat buffer. Sets the first buffer
         * as active, if the closing buffer was active before
         *
         * @param bufferId id of the buffer to close
         * @return undefined
         */
        this.closeBuffer = function (bufferId) {
            var buffer = this.getBuffer(bufferId);
            // Check if the buffer really exists, just in case
            if (buffer === undefined) {
                return;
            }
            // Can't use `buffer` here, needs to be deleted from the list
            delete this.model.buffers[bufferId];
            if (buffer.active) {
                var firstBuffer = Object.values(this.model.buffers).sort(
                    sortBy('number'),
                )[0];
                if (firstBuffer) {
                    this.setActiveBuffer(firstBuffer.id);
                }
            }
        };
    },
]);
