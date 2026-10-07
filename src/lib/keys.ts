/*
 * Keys of WeeChat (buffer property "keys": key bindings of free buffers such
 * as /fset or /script, e.g. "up", "ctrl-l", "meta-return", "meta-f,meta-a")
 * and browser keyboard events.
 */

/** A key event, as given by the browser */
export interface KeyInput {
    key: string;
    code?: string;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey?: boolean;
}

/** One key: modifiers (sorted) and the key itself, e.g. "ctrl+meta|x" */
type Combo = string;

const NAMED: Record<string, string> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Home: 'home',
    End: 'end',
    PageUp: 'pgup',
    PageDown: 'pgdn',
    Insert: 'insert',
    Delete: 'delete',
    Backspace: 'backspace',
    Tab: 'tab',
    Enter: 'return',
    Escape: 'escape',
    ' ': 'space',
    ',': 'comma',
};

const combo = (modifiers: Iterable<string>, key: string): Combo =>
    [...new Set(modifiers)].sort().join('+') + '|' + key;

/** Key of a browser event, null for a lone modifier or a Cmd shortcut */
export function comboOf(event: KeyInput): Combo | null {
    if (event.metaKey || ['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
        return null;
    }
    const modifiers: string[] = [];
    if (event.ctrlKey) {
        modifiers.push('ctrl');
    }
    if (event.altKey) {
        modifiers.push('meta');
    }
    let key =
        // (Option+Space gives a non-breaking space on macOS)
        (event.code === 'Space' ? 'space' : NAMED[event.key]) ??
        (/^F\d{1,2}$/.test(event.key) ? event.key.toLowerCase() : null);
    if (key !== null) {
        if (event.shiftKey) {
            modifiers.push('shift');
        }
    } else if ([...event.key].length === 1) {
        // A character (shift is in the character itself); with Option, macOS
        // gives another character: take the letter of the key
        key = event.key;
        const letter = /^Key([A-Z])$/.exec(event.code ?? '')?.[1];
        if (event.altKey && letter && !/^[a-z]$/i.test(key)) {
            key = event.shiftKey ? letter : letter.toLowerCase();
        } else if (event.ctrlKey && /^[A-Z]$/.test(key) && !event.shiftKey) {
            key = key.toLowerCase();
        }
    } else {
        return null;
    }
    return combo(modifiers, key);
}

/** Keys of a WeeChat key name ("meta-f,meta-a" has two) */
export function parseKeyName(name: string): Combo[] {
    return name.split(',').map((part) => {
        const modifiers: string[] = [];
        let rest = part;
        for (let m = /^(meta|ctrl|shift)-(.+)$/.exec(rest); m;) {
            modifiers.push(m[1]);
            rest = m[2];
            m = /^(meta|ctrl|shift)-(.+)$/.exec(rest);
        }
        return combo(modifiers, rest === 'comma' ? 'comma' : rest);
    });
}

export interface KeyBinding {
    key: string;
    command: string;
}

export type KeyMatch =
    /** A binding: run its command */
    | { type: 'command'; command: string }
    /** The first key of a sequence: wait for the next one */
    | { type: 'prefix'; prefix: Combo[] }
    | { type: 'none' };

/**
 * Match a key (after the keys of a sequence in progress) with the bindings of
 * a buffer.
 */
export function matchKey(
    bindings: KeyBinding[],
    event: KeyInput,
    prefix: Combo[] = [],
): KeyMatch {
    const key = comboOf(event);
    if (key === null) {
        return { type: 'none' };
    }
    const typed = [...prefix, key];
    let isPrefix = false;
    for (const binding of bindings) {
        const keys = parseKeyName(binding.key);
        if (keys.length < typed.length || typed.some((k, i) => keys[i] !== k)) {
            continue;
        }
        if (keys.length === typed.length) {
            return { type: 'command', command: binding.command };
        }
        isPrefix = true;
    }
    return isPrefix ? { type: 'prefix', prefix: typed } : { type: 'none' };
}

/** The commands of a binding ("/fset -mark; /fset -down" has two) */
export function bindingCommands(command: string): string[] {
    return command
        .split(/;\s*(?=\/)/)
        .map((c) => c.trim())
        .filter((c) => c !== '');
}
