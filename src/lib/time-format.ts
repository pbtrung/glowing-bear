/*
 * Format line times like WeeChat, from its strftime-style format
 * (option weechat.look.buffer_time_format).
 */

export interface TimePart {
    text: string;
    /** Literal text between fields (colored with chat_time_delimiters) */
    delimiter: boolean;
}

export const DEFAULT_TIME_FORMAT = '%H:%M:%S';

const pad = (n: number, width = 2, char = '0'): string =>
    String(n).padStart(width, char);

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const hour12 = (d: Date): number => d.getHours() % 12 || 12;

/** Value of a conversion specifier, or null if unknown */
function field(spec: string, d: Date): string | null {
    switch (spec) {
        case 'H':
            return pad(d.getHours());
        case 'k':
            return pad(d.getHours(), 2, ' ');
        case 'I':
            return pad(hour12(d));
        case 'l':
            return pad(hour12(d), 2, ' ');
        case 'M':
            return pad(d.getMinutes());
        case 'S':
            return pad(d.getSeconds());
        case 'p':
            return d.getHours() < 12 ? 'AM' : 'PM';
        case 'P':
            return d.getHours() < 12 ? 'am' : 'pm';
        case 'd':
            return pad(d.getDate());
        case 'e':
            return pad(d.getDate(), 2, ' ');
        case 'm':
            return pad(d.getMonth() + 1);
        case 'y':
            return pad(d.getFullYear() % 100);
        case 'Y':
            return String(d.getFullYear());
        case 'a':
            return DAYS[d.getDay()].substring(0, 3);
        case 'A':
            return DAYS[d.getDay()];
        case 'b':
        case 'h':
            return MONTHS[d.getMonth()].substring(0, 3);
        case 'B':
            return MONTHS[d.getMonth()];
        case 's':
            return String(Math.floor(d.getTime() / 1000));
        default:
            return null;
    }
}

/** Composite specifiers, expanded before formatting */
const COMPOSITES: Record<string, string> = {
    T: '%H:%M:%S',
    R: '%H:%M',
    r: '%I:%M:%S %p',
    D: '%m/%d/%y',
    F: '%Y-%m-%d',
};

/**
 * Format a date with a strftime-style format.
 *
 * WeeChat evaluates the option, so it may contain ${...} expressions such as
 * colors: they are removed. "%.N" (sub-second digits, WeeChat >= 4.2) is
 * supported, other unknown specifiers are kept as text.
 */
export function formatTime(
    date: Date,
    format: string = DEFAULT_TIME_FORMAT,
): TimePart[] {
    let fmt = (format || DEFAULT_TIME_FORMAT).replace(/\$\{[^}]*\}/g, '');
    // (matching "%%" too, so that "%%T" stays a literal "%T")
    fmt = fmt.replace(/%([%TRrDF])/g, (all, spec: string) => COMPOSITES[spec] ?? all);

    const parts: TimePart[] = [];
    const push = (text: string, delimiter: boolean) => {
        if (text === '') {
            return;
        }
        const last = parts[parts.length - 1];
        if (last && last.delimiter === delimiter) {
            last.text += text;
        } else {
            parts.push({ text, delimiter });
        }
    };

    for (let i = 0; i < fmt.length; i++) {
        const ch = fmt[i];
        if (ch !== '%' || i === fmt.length - 1) {
            push(ch, true);
            continue;
        }
        const spec = fmt[++i];
        if (spec === '%') {
            push('%', true);
        } else if (spec === '.' && /\d/.test(fmt[i + 1] ?? '')) {
            // %.N: first N digits of the microseconds (we only have millis)
            const digits = parseInt(fmt[++i], 10);
            push(
                pad(date.getMilliseconds(), 3).padEnd(6, '0').substring(0, digits),
                false,
            );
        } else {
            const value = field(spec, date);
            push(value ?? '%' + spec, value === null);
        }
    }
    return parts;
}

/** Plain text of formatTime() */
export function formatTimeText(date: Date, format?: string): string {
    return formatTime(date, format)
        .map((part) => part.text)
        .join('');
}
