'use strict';

/**
 * WeeChat color code parser.
 *
 * Strings sent by the relay "api" protocol with colors=weechat contain
 * WeeChat's internal color and attribute codes. This turns them into text
 * elements with color/attribute information the UI maps to CSS classes.
 */
var WeeChatColors = {};

/**
 * WeeChat colors names.
 */
WeeChatColors._weeChatColorsNames = [
    'default',
    'black',
    'darkgray',
    'red',
    'lightred',
    'green',
    'lightgreen',
    'brown',
    'yellow',
    'blue',
    'lightblue',
    'magenta',
    'lightmagenta',
    'cyan',
    'lightcyan',
    'gray',
    'white',
];

/**
 * Style options names.
 */
WeeChatColors._colorsOptionsNames = [
    'separator',
    'chat',
    'chat_time',
    'chat_time_delimiters',
    'chat_prefix_error',
    'chat_prefix_network',
    'chat_prefix_action',
    'chat_prefix_join',
    'chat_prefix_quit',
    'chat_prefix_more',
    'chat_prefix_suffix',
    'chat_buffer',
    'chat_server',
    'chat_channel',
    'chat_nick',
    'chat_nick_self',
    'chat_nick_other',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'invalid',
    'chat_host',
    'chat_delimiters',
    'chat_highlight',
    'chat_read_marker',
    'chat_text_found',
    'chat_value',
    'chat_prefix_buffer',
    'chat_tags',
    'chat_inactive_window',
    'chat_inactive_buffer',
    'chat_prefix_buffer_inactive_buffer',
    'chat_nick_offline',
    'chat_nick_offline_highlight',
    'chat_nick_prefix',
    'chat_nick_suffix',
    'emphasis',
    'chat_day_change',
    'chat_value_null',
    'chat_status_disabled',
    'chat_status_enabled',
];

/**
 * Gets the default color.
 *
 * @return Default color
 */
WeeChatColors._getDefaultColor = function () {
    return {
        type: 'weechat',
        name: 'default',
    };
};

/**
 * Gets the default attributes.
 *
 * @return Default attributes
 */
WeeChatColors._getDefaultAttributes = function () {
    return {
        name: null,
        override: {
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
        },
    };
};

/**
 * Gets the default style (default colors and attributes).
 *
 * @return Default style
 */
WeeChatColors._getDefaultStyle = function () {
    return {
        fgColor: WeeChatColors._getDefaultColor(),
        bgColor: WeeChatColors._getDefaultColor(),
        attrs: WeeChatColors._getDefaultAttributes(),
    };
};

/**
 * Clones a color object.
 *
 * @param color Color object to clone
 * @return Cloned color object
 */
WeeChatColors._cloneColor = function (color) {
    var clone = {};

    for (var key in color) {
        clone[key] = color[key];
    }

    return clone;
};

/**
 * Clones an attributes object.
 *
 * @param attrs Attributes object to clone
 * @return Cloned attributes object
 */
WeeChatColors._cloneAttrs = function (attrs) {
    var clone = {};

    clone.name = attrs.name;
    clone.override = {};
    for (var attr in attrs.override) {
        clone.override[attr] = attrs.override[attr];
    }

    return clone;
};

/**
 * Gets the name of an attribute from its character.
 *
 * @param ch Character of attribute
 * @return Name of attribute
 */
WeeChatColors._attrNameFromChar = function (ch) {
    var chars = {
        // WeeChat protocol
        '*': 'b',
        '!': 'r',
        '/': 'i',
        _: 'u',

        // some extension often used (IRC?)
        '\x01': 'b',
        '\x02': 'r',
        '\x03': 'i',
        '\x04': 'u',
    };

    if (ch in chars) {
        return chars[ch];
    }

    return null;
};

/**
 * Gets an attributes object from a string of attribute characters.
 *
 * @param str String of attribute characters
 * @return Attributes object (null if unchanged)
 */
WeeChatColors._attrsFromStr = function (str) {
    var attrs = WeeChatColors._getDefaultAttributes();

    for (var i = 0; i < str.length; ++i) {
        var ch = str.charAt(i);
        if (ch === '|') {
            // means keep attributes, so unchanged
            return null;
        }
        var attrName = WeeChatColors._attrNameFromChar(ch);
        if (attrName !== null) {
            attrs.override[attrName] = true;
        }
    }

    return attrs;
};

/**
 * Gets a single color from a string representing its index (WeeChat and
 * extended colors only, NOT colors options).
 *
 * @param str Color string (e.g., "05" or "00134")
 * @return Color object
 */
WeeChatColors._getColorObj = function (str) {
    if (str.length === 2) {
        var code = parseInt(str);
        if (code > 16) {
            // should never happen
            return WeeChatColors._getDefaultColor();
        } else {
            return {
                type: 'weechat',
                name: WeeChatColors._weeChatColorsNames[code],
            };
        }
    } else {
        var codeStr = str.substring(1);
        return {
            type: 'ext',
            name: parseInt(codeStr).toString(),
        };
    }
};

/**
 * Gets colors and attributes of text element.
 *
 * See <http://www.weechat.org/files/doc/devel/weechat_dev.en.html#color_codes_in_strings>.
 *
 * @param txt Text element
 * @return Colors, attributes and plain text of this text element:
 *          fgColor: Foreground color (null if unchanged)
 *          bgColor: Background color (null if unchanged)
 *          attrs: Attributes (null if unchanged)
 *          text: Plain text element
 */
WeeChatColors._getStyle = function (txt) {
    var matchers = [
        {
            // color option
            //   STD
            regex: /^(\d{2})/,
            fn: function (m) {
                var ret = {};
                var optionCode = parseInt(m[1]);

                if (optionCode >= WeeChatColors._colorsOptionsNames.length) {
                    // should never happen
                    return {
                        fgColor: null,
                        bgColor: null,
                        attrs: null,
                    };
                }
                var optionName = WeeChatColors._colorsOptionsNames[optionCode];
                ret.fgColor = {
                    type: 'option',
                    name: optionName,
                };
                ret.bgColor = WeeChatColors._cloneColor(ret.fgColor);
                ret.attrs = {
                    name: optionName,
                    override: {},
                };

                return ret;
            },
        },
        {
            // ncurses pair
            //   EXT
            regex: /^@(\d{5})/,
            fn: function (m) {
                // unimplemented case
                return {
                    fgColor: null,
                    bgColor: null,
                    attrs: null,
                };
            },
        },
        {
            // foreground color with F
            //   "F" + (A)STD
            //   "F" + (A)EXT
            regex: /^F(?:([*!\/_|]*)(\d{2})|@([\x01\x02\x03\x04*!\/_|]*)(\d{5}))/,
            fn: function (m) {
                var ret = {
                    bgColor: null,
                };

                if (m[2]) {
                    ret.attrs = WeeChatColors._attrsFromStr(m[1]);
                    ret.fgColor = WeeChatColors._getColorObj(m[2]);
                } else {
                    ret.attrs = WeeChatColors._attrsFromStr(m[3]);
                    ret.fgColor = WeeChatColors._getColorObj(m[4]);
                }

                return ret;
            },
        },
        {
            // background color (no attributes)
            //   "B" + STD
            //   "B" + EXT
            regex: /^B(\d{2}|@\d{5})/,
            fn: function (m) {
                return {
                    fgColor: null,
                    bgColor: WeeChatColors._getColorObj(m[1]),
                    attrs: null,
                };
            },
        },
        {
            // foreground, background (+ attributes)
            //   "*" + (A)STD + "," + STD
            //   "*" + (A)STD + "," + EXT
            //   "*" + (A)EXT + "," + STD
            //   "*" + (A)EXT + "," + EXT
            // WeeChat 2.6+ use a tilde (~) instead of a comma (,) so recognise both
            regex: /^\*(?:([\x01\x02\x03\x04*!\/_|]*)(\d{2})|@([\x01\x02\x03\x04*!\/_|]*)(\d{5}))[,~](\d{2}|@\d{5})/,
            fn: function (m) {
                var ret = {};

                if (m[2]) {
                    ret.attrs = WeeChatColors._attrsFromStr(m[1]);
                    ret.fgColor = WeeChatColors._getColorObj(m[2]);
                } else {
                    ret.attrs = WeeChatColors._attrsFromStr(m[3]);
                    ret.fgColor = WeeChatColors._getColorObj(m[4]);
                }
                ret.bgColor = WeeChatColors._getColorObj(m[5]);

                return ret;
            },
        },
        {
            // foreground color with * (+ attributes) (fall back, must be checked before previous case)
            //   "*" + (A)STD
            //   "*" + (A)EXT
            regex: /^\*([\x01\x02\x03\x04*!\/_|]*)(\d{2}|@\d{5})/,
            fn: function (m) {
                return {
                    fgColor: WeeChatColors._getColorObj(m[2]),
                    bgColor: null,
                    attrs: WeeChatColors._attrsFromStr(m[1]),
                };
            },
        },
        {
            // emphasis
            //   "E"
            regex: /^E/,
            fn: function (m) {
                var ret = {};

                ret.fgColor = {
                    type: 'option',
                    name: 'emphasis',
                };
                ret.bgColor = WeeChatColors._cloneColor(ret.fgColor);
                ret.attrs = {
                    name: 'emphasis',
                    override: {},
                };

                return ret;
            },
        },
    ];

    // parse
    var ret = {
        fgColor: null,
        bgColor: null,
        attrs: null,
        text: txt,
    };
    matchers.some(function (matcher) {
        var m = txt.match(matcher.regex);
        if (m) {
            ret = matcher.fn(m);
            ret.text = txt.substring(m[0].length);
            return true;
        }

        return false;
    });

    return ret;
};

/**
 * Transforms a raw text into an array of text elements with integrated
 * colors and attributes.
 *
 * @param rawText Raw text to transform
 * @return Array of text elements
 */
WeeChatColors.rawText2Rich = function (rawText) {
    /* This is subtle, but JavaScript adds the token to the output list
     * when it's surrounded by capturing parentheses.
     */
    var parts = rawText.split(/(\x19|\x1a|\x1b|\x1c)/);

    // no colors/attributes
    if (parts.length === 1) {
        return [
            {
                attrs: WeeChatColors._getDefaultAttributes(),
                fgColor: WeeChatColors._getDefaultColor(),
                bgColor: WeeChatColors._getDefaultColor(),
                text: parts[0],
            },
        ];
    }

    // find the style of every part
    var curFgColor = WeeChatColors._getDefaultColor();
    var curBgColor = WeeChatColors._getDefaultColor();
    var curAttrs = WeeChatColors._getDefaultAttributes();
    var curSpecialToken = null;
    var curAttrsOnlyFalseOverrides = true;

    return parts
        .map(function (p) {
            if (p.length === 0) {
                return null;
            }
            var firstCharCode = p.charCodeAt(0);
            var firstChar = p.charAt(0);

            if (firstCharCode >= 0x19 && firstCharCode <= 0x1c) {
                // special token
                if (firstCharCode === 0x1c) {
                    // always reset colors
                    curFgColor = WeeChatColors._getDefaultColor();
                    curBgColor = WeeChatColors._getDefaultColor();
                    if (curSpecialToken !== 0x19) {
                        // also reset attributes
                        curAttrs = WeeChatColors._getDefaultAttributes();
                    }
                }
                curSpecialToken = firstCharCode;
                return null;
            }

            var text = p;
            if (curSpecialToken === 0x19) {
                // get new style
                var style = WeeChatColors._getStyle(p);

                // set foreground color if changed
                if (style.fgColor !== null) {
                    curFgColor = style.fgColor;
                }

                // set background color if changed
                if (style.bgColor !== null) {
                    curBgColor = style.bgColor;
                }

                // set attibutes if changed
                if (style.attrs !== null) {
                    curAttrs = style.attrs;
                }

                // set plain text
                text = style.text;
            } else if (curSpecialToken === 0x1a || curSpecialToken === 0x1b) {
                // set/reset attribute
                var orideVal = curSpecialToken === 0x1a;

                // set attribute override if we don't have to keep all of them
                if (firstChar !== '|') {
                    var orideName = WeeChatColors._attrNameFromChar(firstChar);
                    if (orideName) {
                        // known attribute
                        curAttrs.override[orideName] = orideVal;
                        text = p.substring(1);
                    }
                }
            }

            // reset current special token
            curSpecialToken = null;

            // if text is empty, don't bother returning it
            if (text.length === 0) {
                return null;
            }

            /* As long as attributes are only false overrides, without any option
             * name, it's safe to remove them.
             */
            if (curAttrsOnlyFalseOverrides && curAttrs.name === null) {
                var allReset = true;
                for (var attr in curAttrs.override) {
                    if (curAttrs.override[attr]) {
                        allReset = false;
                        break;
                    }
                }
                if (allReset) {
                    curAttrs.override = {};
                } else {
                    curAttrsOnlyFalseOverrides = false;
                }
            }

            // parsed text element
            return {
                fgColor: WeeChatColors._cloneColor(curFgColor),
                bgColor: WeeChatColors._cloneColor(curBgColor),
                attrs: WeeChatColors._cloneAttrs(curAttrs),
                text: text,
            };
        })
        .filter(function (p) {
            return p !== null;
        });
};

export const rawText2Rich = WeeChatColors.rawText2Rich;
