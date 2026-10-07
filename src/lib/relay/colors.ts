/* eslint-disable no-control-regex -- WeeChat color codes are control characters */

/*
 * Parser for WeeChat's internal color and attribute codes.
 *
 * All requests use colors=weechat, so strings sent by the relay keep these
 * codes. parseRichText() turns them into text parts with the CSS classes the
 * themes style:
 *   cof-/cob-/coa-<option>   color option (foreground, background, attributes)
 *   cwf-/cwb-<name>          WeeChat basic color (foreground, background)
 *   cef-/ceb-<number>        extended color (foreground, background)
 *   a-<attr> / a-no-<attr>   attribute override (b, r, i, u, k: blink, d: dim)
 * See https://weechat.org/files/doc/devel/weechat_dev.en.html#color_codes_in_strings
 */

type ColorType = 'weechat' | 'ext' | 'option';

interface Color {
    type: ColorType;
    name: string;
}

interface Attributes {
    /** Color option the attributes come from (null: none) */
    name: string | null;
    override: Record<string, boolean>;
}

interface Style {
    fgColor: Color | null;
    bgColor: Color | null;
    attrs: Attributes | null;
}

export interface RichText {
    text: string;
    classes: string[];
}

const WEECHAT_COLOR_NAMES = [
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

/** Color options, in the order of WeeChat's t_gui_color_enum (gui-color.h) */
export const COLOR_OPTION_NAMES = [
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

const defaultColor = (): Color => ({ type: 'weechat', name: 'default' });

const defaultAttributes = (): Attributes => ({
    name: null,
    override: { b: false, r: false, i: false, u: false, k: false, d: false },
});

const cloneAttrs = (attrs: Attributes): Attributes => ({
    name: attrs.name,
    override: { ...attrs.override },
});

const ATTR_CHARS: Record<string, string> = {
    // WeeChat protocol
    '*': 'b',
    '!': 'r',
    '/': 'i',
    _: 'u',
    '%': 'k',
    '.': 'd',
    // attribute codes, used after \x1a (set) and \x1b (remove)
    '\x01': 'b',
    '\x02': 'r',
    '\x03': 'i',
    '\x04': 'u',
    '\x05': 'k',
    '\x06': 'd',
};

/** Attributes from a string of attribute characters (null: keep current) */
function attrsFromStr(str: string): Attributes | null {
    const attrs = defaultAttributes();
    for (const ch of str) {
        if (ch === '|') {
            // means keep attributes, so unchanged
            return null;
        }
        const attrName = ATTR_CHARS[ch];
        if (attrName !== undefined) {
            attrs.override[attrName] = true;
        }
    }
    return attrs;
}

/** A WeeChat ("05") or extended ("@00134") color, not color options */
function colorObj(str: string): Color {
    if (str.length === 2) {
        const code = parseInt(str, 10);
        if (code > 16) {
            // should never happen
            return defaultColor();
        }
        return { type: 'weechat', name: WEECHAT_COLOR_NAMES[code] };
    }
    return { type: 'ext', name: String(parseInt(str.substring(1), 10)) };
}

const optionStyle = (name: string): Style => ({
    fgColor: { type: 'option', name },
    bgColor: { type: 'option', name },
    attrs: { name, override: {} },
});

const NO_CHANGE: Style = { fgColor: null, bgColor: null, attrs: null };

const MATCHERS: Array<{ regex: RegExp; fn: (m: RegExpMatchArray) => Style }> = [
    {
        // color option: STD
        regex: /^(\d{2})/,
        fn: (m) => {
            const optionName = COLOR_OPTION_NAMES[parseInt(m[1], 10)];
            // unknown option: should never happen
            return optionName === undefined ? NO_CHANGE : optionStyle(optionName);
        },
    },
    {
        // ncurses pair: EXT (unimplemented)
        regex: /^@(\d{5})/,
        fn: () => NO_CHANGE,
    },
    {
        // foreground color with F: "F" + (A)STD, "F" + (A)EXT
        regex: /^F(?:([*!/_%.|]*)(\d{2})|@([*!/_%.|]*)(\d{5}))/,
        fn: (m) =>
            m[2]
                ? { fgColor: colorObj(m[2]), bgColor: null, attrs: attrsFromStr(m[1]) }
                : { fgColor: colorObj(m[4]), bgColor: null, attrs: attrsFromStr(m[3]) },
    },
    {
        // background color (no attributes): "B" + STD, "B" + EXT
        regex: /^B(\d{2}|@\d{5})/,
        fn: (m) => ({ fgColor: null, bgColor: colorObj(m[1]), attrs: null }),
    },
    {
        // foreground, background (+ attributes): "*" + (A)STD|(A)EXT + "," + STD|EXT
        // WeeChat 2.6+ uses a tilde (~) instead of a comma (,): recognize both
        regex: /^\*(?:([*!/_%.|]*)(\d{2})|@([*!/_%.|]*)(\d{5}))[,~](\d{2}|@\d{5})/,
        fn: (m) => ({
            fgColor: colorObj(m[2] ? m[2] : m[4]),
            bgColor: colorObj(m[5]),
            attrs: attrsFromStr(m[2] ? m[1] : m[3]),
        }),
    },
    {
        // foreground color with * (+ attributes): "*" + (A)STD, "*" + (A)EXT
        regex: /^\*([*!/_%.|]*)(\d{2}|@\d{5})/,
        fn: (m) => ({
            fgColor: colorObj(m[2]),
            bgColor: null,
            attrs: attrsFromStr(m[1]),
        }),
    },
    {
        // emphasis: "E"
        regex: /^E/,
        fn: () => optionStyle('emphasis'),
    },
    {
        // bar codes: "b" + F (bar_fg), D (bar_delim), B (bar_bg), _ - # (input),
        // i l (items), s (spacer); used in bar items like the input prompt, and
        // with no meaning outside WeeChat's bars
        regex: /^b[FDB_\-#ils]/,
        fn: () => NO_CHANGE,
    },
];

/** Style set by a text element following a \x19 code, and the remaining text */
function parseStyle(txt: string): Style & { text: string } {
    for (const matcher of MATCHERS) {
        const m = txt.match(matcher.regex);
        if (m) {
            return { ...matcher.fn(m), text: txt.substring(m[0].length) };
        }
    }
    return { ...NO_CHANGE, text: txt };
}

interface StyledText {
    fgColor: Color;
    bgColor: Color;
    attrs: Attributes;
    text: string;
}

/** Split a string with WeeChat color codes into styled text elements */
export function rawText2Rich(rawText: string): StyledText[] {
    // Capturing parentheses keep the separators in the output
    const parts = rawText.split(/(\x19|\x1a|\x1b|\x1c)/);

    // no colors/attributes
    if (parts.length === 1) {
        return [
            {
                attrs: { name: null, override: {} },
                fgColor: defaultColor(),
                bgColor: defaultColor(),
                text: parts[0],
            },
        ];
    }

    let curFgColor = defaultColor();
    let curBgColor = defaultColor();
    let curAttrs = defaultAttributes();
    let curSpecialToken: number | null = null;
    let curAttrsOnlyFalseOverrides = true;
    const result: StyledText[] = [];

    for (const p of parts) {
        if (p.length === 0) {
            continue;
        }
        const firstCharCode = p.charCodeAt(0);
        const firstChar = p.charAt(0);

        if (firstCharCode >= 0x19 && firstCharCode <= 0x1c) {
            // special token
            if (firstCharCode === 0x1c) {
                // always reset colors
                curFgColor = defaultColor();
                curBgColor = defaultColor();
                if (curSpecialToken !== 0x19) {
                    // also reset attributes
                    curAttrs = defaultAttributes();
                }
            }
            curSpecialToken = firstCharCode;
            continue;
        }

        let text = p;
        if (curSpecialToken === 0x19) {
            const style = parseStyle(p);
            if (style.fgColor !== null) {
                curFgColor = style.fgColor;
            }
            if (style.bgColor !== null) {
                curBgColor = style.bgColor;
            }
            if (style.attrs !== null) {
                curAttrs = style.attrs;
            }
            text = style.text;
        } else if (curSpecialToken === 0x1a || curSpecialToken === 0x1b) {
            // set/reset attribute; "|" means keep them all
            if (firstChar !== '|') {
                const orideName = ATTR_CHARS[firstChar];
                if (orideName !== undefined) {
                    curAttrs.override[orideName] = curSpecialToken === 0x1a;
                    text = p.substring(1);
                }
            }
        }

        curSpecialToken = null;

        if (text.length === 0) {
            continue;
        }

        // As long as attributes are only false overrides, without any option
        // name, it's safe to remove them.
        if (curAttrsOnlyFalseOverrides && curAttrs.name === null) {
            if (Object.values(curAttrs.override).every((v) => !v)) {
                curAttrs.override = {};
            } else {
                curAttrsOnlyFalseOverrides = false;
            }
        }

        result.push({
            fgColor: { ...curFgColor },
            bgColor: { ...curBgColor },
            attrs: cloneAttrs(curAttrs),
            text,
        });
    }
    return result;
}

const FG_PREFIX: Record<ColorType, string> = {
    option: 'cof-',
    weechat: 'cwf-',
    ext: 'cef-',
};
const BG_PREFIX: Record<ColorType, string> = {
    option: 'cob-',
    weechat: 'cwb-',
    ext: 'ceb-',
};

/** Parse a string with WeeChat color codes into text parts with CSS classes */
export function parseRichText(text: string | null | undefined): RichText[] {
    if (!text) {
        return [{ text: '', classes: [] }];
    }
    const parts = rawText2Rich(text).map((el) => {
        const classes = [FG_PREFIX[el.fgColor.type] + el.fgColor.name];
        classes.push(BG_PREFIX[el.bgColor.type] + el.bgColor.name);
        if (el.attrs.name !== null) {
            classes.push('coa-' + el.attrs.name);
        }
        for (const [attr, val] of Object.entries(el.attrs.override)) {
            classes.push((val ? 'a-' : 'a-no-') + attr);
        }
        return { text: el.text, classes };
    });
    return parts.length > 0 ? parts : [{ text: '', classes: [] }];
}

/** Text of rich text parts, without the colors */
export function plainText(rich: RichText[]): string {
    return rich.map((part) => part.text).join('');
}

/** Remove WeeChat color codes from a string */
export function stripColors(text: string): string {
    return plainText(parseRichText(text));
}
