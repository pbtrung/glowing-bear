/* Relay "api" protocol: authentication, URLs, time format, event handlers */

import angular from 'angular';

import 'angular-mocks';

import '../../src/main';

import {
    base64,
    base64url,
    buildCredentials,
    describeAuthError,
    relayUrls,
    supportedHashAlgos,
    websocketProtocols,
} from '../../src/js/relay-auth';
import { weechatTimeFormatToAngular } from '../../src/js/time-format';

describe('relay authentication', function () {
    var TIMESTAMP = 1706431066;

    it('encodes credentials in base64 and base64url', function () {
        expect(base64('plain:secret_password')).toEqual('cGxhaW46c2VjcmV0X3Bhc3N3b3Jk');
        // UTF-8, URL-safe alphabet, no padding
        expect(base64url('plain:pässwörd?>')).toEqual('cGxhaW46cMOkc3N3w7ZyZD8-');
    });

    it('builds websocket sub-protocols', function () {
        expect(websocketProtocols('plain:secret_password')).toEqual([
            'api.weechat',
            'base64url.bearer.authorization.weechat.cGxhaW46c2VjcmV0X3Bhc3N3b3Jk',
        ]);
    });

    it('offers the strongest algorithms first', function () {
        var algos = supportedHashAlgos();
        expect(algos[0]).toEqual('pbkdf2+sha512');
        expect(algos[algos.length - 1]).toEqual('plain');
    });

    it('builds plain credentials', function () {
        return buildCredentials('secret_password', 'plain', 0, TIMESTAMP).then(
            function (creds) {
                expect(creds).toEqual('plain:secret_password');
            },
        );
    });

    it('builds sha256 credentials (example from the WeeChat docs)', function () {
        return buildCredentials('secret_password', 'sha256', 0, TIMESTAMP).then(
            function (creds) {
                expect(creds).toEqual(
                    'hash:sha256:1706431066:' +
                        'dfa1db3f6bb6445d18d9ec7427c10f6421274e3a4751e6c1ffc7dd28c94eadf6',
                );
            },
        );
    });

    it('builds pbkdf2+sha512 credentials salted with the timestamp', function () {
        return buildCredentials(
            'secret_password',
            'pbkdf2+sha512',
            1000,
            TIMESTAMP,
        ).then(function (creds) {
            expect(creds).toEqual(
                'hash:pbkdf2+sha512:1706431066:1000:' +
                    '77fc0c193ddd6844f988f935ec2291a469bc9618099c6101a5117f86bce86e34' +
                    '34703969bffaa0b9ec7d3ef23a22df9cd696586d8072decd8b7f7e25351a38ea',
            );
        });
    });

    it('builds pbkdf2+sha256 credentials', function () {
        return buildCredentials(
            'secret_password',
            'pbkdf2+sha256',
            1000,
            TIMESTAMP,
        ).then(function (creds) {
            expect(creds).toEqual(
                'hash:pbkdf2+sha256:1706431066:1000:' +
                    'c3c331950c9ddf645f8a23d6ee779c7e4e56dcc79d5ea80d40b96944707e3d35',
            );
        });
    });

    it('explains authentication errors', function () {
        expect(describeAuthError('Invalid password')).toEqual('Wrong password.');
        expect(describeAuthError('Invalid timestamp')).toContain('time_window');
        expect(describeAuthError('Something else')).toEqual('Something else');
    });
});

describe('relay URLs', function () {
    it('builds http and websocket URLs', function () {
        expect(relayUrls('example.com', 9000, 'api', true)).toEqual({
            http: 'https://example.com:9000/api',
            ws: 'wss://example.com:9000/api',
        });
        expect(relayUrls('localhost', 9000, '', false)).toEqual({
            http: 'http://localhost:9000/api',
            ws: 'ws://localhost:9000/api',
        });
    });

    it('supports a proxy path and IPv6 addresses', function () {
        expect(relayUrls('::1', 443, '/relay/api/', true).ws).toEqual(
            'wss://[::1]:443/relay/api',
        );
        expect(relayUrls('[2001:db8::1]', 9000, 'api', false).http).toEqual(
            'http://[2001:db8::1]:9000/api',
        );
    });
});

describe('time format', function () {
    var strip = function (format) {
        // Remove the delimiter markup to make expectations readable
        return format.replace(/'<span[^>]*>([^<]*)<\/span>'/g, '$1');
    };

    it('converts 24h formats', function () {
        expect(strip(weechatTimeFormatToAngular('%H:%M:%S'))).toEqual('HH:mm:ss');
        expect(strip(weechatTimeFormatToAngular('%H:%M'))).toEqual('HH:mm');
    });

    it('converts 12h formats', function () {
        expect(strip(weechatTimeFormatToAngular('%I:%M %p'))).toEqual("hh:mm'&nbsp;'a");
    });

    it('defaults when no format is known', function () {
        expect(strip(weechatTimeFormatToAngular(undefined))).toEqual('HH:mm:ss');
    });

    it('puts date components in the order of the format', function () {
        expect(strip(weechatTimeFormatToAngular('%Y-%m-%d %H:%M'))).toEqual(
            'yyyy/MM/dd&nbsp;HH:mm',
        );
        expect(strip(weechatTimeFormatToAngular('%d.%m.%Y %H:%M'))).toEqual(
            'dd/MM/yyyy&nbsp;HH:mm',
        );
    });
});

describe('relay event handlers', function () {
    beforeEach(angular.mock.module('weechat'));

    var apiBuffer = function (id, number, name, shortName, extra) {
        return angular.extend(
            {
                id: id,
                name: name,
                short_name: shortName,
                number: number,
                type: 'formatted',
                hidden: false,
                title: 'Title of ' + name,
                modes: '',
                input_prompt: '',
                input: '',
                input_position: 0,
                input_multiline: false,
                nicklist: true,
                time_displayed: true,
                local_variables: {
                    plugin: 'irc',
                    name: name.replace(/^irc\./, ''),
                    type: 'channel',
                    server: 'libera',
                },
                keys: [],
                last_read_line_id: -1,
            },
            extra || {},
        );
    };

    var line = function (id, message, extra) {
        return angular.extend(
            {
                id: id,
                y: -1,
                date: '2024-01-07T08:54:00.179483Z',
                date_printed: '2024-01-07T08:54:00.179483Z',
                displayed: true,
                highlight: false,
                notify_level: 1,
                prefix: 'alice',
                message: message,
                tags: ['irc_privmsg', 'nick_alice', 'log1'],
            },
            extra || {},
        );
    };

    var event = function (name, bufferId, bodyType, body) {
        return {
            code: 0,
            message: 'Event',
            event_name: name,
            buffer_id: bufferId,
            body_type: bodyType,
            body: body,
        };
    };

    var setup = function (handlers) {
        handlers.handleBufferInfo([
            apiBuffer(1, 1, 'core.weechat', 'weechat', {
                nicklist: false,
                local_variables: { plugin: 'core', name: 'weechat' },
            }),
            apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
            apiBuffer(3, 3, 'irc.libera.#test', '#test', { notify: 'all' }),
        ]);
    };

    it(
        'loads buffers from the relay',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            var buffer = models.getBuffer(2);
            expect(buffer.fullName).toEqual('irc.libera.#weechat');
            expect(buffer.trimmedName).toEqual('weechat');
            expect(buffer.prefix).toEqual('#');
            expect(buffer.rtitle).toEqual('Title of irc.libera.#weechat');
            expect(models.getActiveBuffer().id).toEqual(1);
        }),
    );

    it(
        'counts unread lines and highlights',
        angular.mock.inject(function (handlers, models, $rootScope) {
            $rootScope.isWindowFocused = function () {
                return true;
            };
            setup(handlers);
            handlers.handleEvent(
                event('buffer_line_added', 3, 'line', line(10, 'hello')),
            );
            handlers.handleEvent(
                event(
                    'buffer_line_added',
                    3,
                    'line',
                    line(11, 'hi alice', { highlight: true }),
                ),
            );
            handlers.handleEvent(
                event(
                    'buffer_line_added',
                    3,
                    'line',
                    line(12, 'join', { notify_level: 0 }),
                ),
            );
            var buffer = models.getBuffer(3);
            expect(buffer.lines.length).toEqual(3);
            expect(buffer.lines[0].text).toEqual('hello');
            expect(buffer.unread).toEqual(1);
            expect(buffer.notification).toEqual(1);
        }),
    );

    it(
        'replaces changed lines',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            handlers.handleEvent(
                event('buffer_line_added', 2, 'line', line(5, 'typo')),
            );
            handlers.handleEvent(
                event('buffer_line_data_changed', 2, 'line', line(5, 'fixed')),
            );
            expect(models.getBuffer(2).lines[0].text).toEqual('fixed');
        }),
    );

    it(
        'opens, renames, moves and closes buffers',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            handlers.handleEvent(
                event(
                    'buffer_opened',
                    4,
                    'buffer',
                    apiBuffer(4, 4, 'irc.libera.bob', ''),
                ),
            );
            expect(models.getBuffer(4)).toBeDefined();

            handlers.handleEvent(
                event(
                    'buffer_renamed',
                    4,
                    'buffer',
                    apiBuffer(4, 4, 'irc.libera.bob', 'bob'),
                ),
            );
            expect(models.getBuffer(4).shortName).toEqual('bob');

            handlers.handleEvent(
                event(
                    'buffer_moved',
                    4,
                    'buffer',
                    apiBuffer(4, 2, 'irc.libera.bob', 'bob'),
                ),
            );
            expect(models.getBuffer(4).number).toEqual(2);
            expect(models.getBuffer(2).number).toEqual(3);
            expect(models.getBuffer(3).number).toEqual(4);

            handlers.handleEvent(event('buffer_closed', 4, null, null));
            expect(models.getBuffer(4)).toBeUndefined();
        }),
    );

    it(
        'switches to queries we opened',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            models.outgoingQueries.push('bob');
            handlers.handleEvent(
                event(
                    'buffer_opened',
                    4,
                    'buffer',
                    apiBuffer(4, 4, 'irc.libera.bob', 'bob'),
                ),
            );
            expect(models.getActiveBuffer().id).toEqual(4);
            expect(models.outgoingQueries).toEqual([]);
        }),
    );

    it(
        'maintains the nicklist',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            handlers.handleNicklist(2, {
                id: 0,
                parent_group_id: -1,
                name: 'root',
                visible: false,
                nicks: [],
                groups: [
                    {
                        id: 100,
                        parent_group_id: 0,
                        name: '000|o',
                        color_name: 'weechat.color.nicklist_group',
                        visible: true,
                        groups: [],
                        nicks: [
                            {
                                id: 101,
                                parent_group_id: 100,
                                prefix: '@',
                                prefix_color_name: 'lightgreen',
                                name: 'alice',
                                color_name: 'bar_fg',
                                visible: true,
                            },
                        ],
                    },
                ],
            });
            var buffer = models.getBuffer(2);
            expect(buffer.nicklist['000|o'].nicks.map((n) => n.name)).toEqual([
                'alice',
            ]);
            expect(buffer.nicklist['000|o'].nicks[0].prefixClasses).toEqual([
                'cwf-lightgreen',
            ]);

            var bob = {
                id: 102,
                parent_group_id: 100,
                prefix: '@',
                prefix_color_name: 'lightgreen',
                name: 'bob',
                color_name: 'bar_fg',
                visible: true,
            };
            handlers.handleEvent(event('nicklist_nick_added', 2, 'nick', bob));
            expect(buffer.queryNicklist('bob')).toBe(true);

            handlers.handleEvent(event('nicklist_nick_removing', 2, 'nick', bob));
            expect(buffer.queryNicklist('bob')).toBe(false);

            // Buffer without a requested nicklist ignores nick events
            handlers.handleEvent(event('nicklist_nick_added', 3, 'nick', bob));
            expect(models.getBuffer(3).queryNicklist('bob')).toBe(false);
        }),
    );

    it(
        'applies the hotlist',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            handlers.handleHotlistInfo([
                {
                    priority: 3,
                    date: '2024-03-17T16:38:51Z',
                    buffer_id: 3,
                    count: [2, 5, 1, 2],
                },
            ]);
            var buffer = models.getBuffer(3);
            expect(buffer.unread).toEqual(5);
            expect(buffer.notification).toEqual(3);
        }),
    );

    it(
        'stores free buffer lines by index',
        angular.mock.inject(function (handlers, models) {
            setup(handlers);
            handlers.handleEvent(
                event(
                    'buffer_opened',
                    5,
                    'buffer',
                    apiBuffer(5, 5, 'fset.fset', '', { type: 'free' }),
                ),
            );
            handlers.handleEvent(
                event('buffer_line_added', 5, 'line', line(0, 'second', { y: 1 })),
            );
            handlers.handleEvent(
                event('buffer_line_added', 5, 'line', line(1, 'first', { y: 0 })),
            );
            handlers.handleEvent(
                event(
                    'buffer_line_data_changed',
                    5,
                    'line',
                    line(0, 'changed', { y: 1 }),
                ),
            );
            var lines = models.getBuffer(5).lines;
            expect(lines.map((l) => l.text)).toEqual(['first', 'changed']);
        }),
    );

    it(
        'flags upgrades',
        angular.mock.inject(function (handlers, $rootScope) {
            handlers.handleEvent(event('upgrade', -1, null, null));
            expect($rootScope.weechatUpgrading).toBe(true);
            handlers.handleEvent(event('upgrade_ended', -1, null, null));
            expect($rootScope.weechatUpgrading).toBe(false);
        }),
    );
});
