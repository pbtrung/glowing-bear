/*
 * Global keyboard shortcuts (see the Shortcuts section of the settings).
 */
import {
    activateBuffer,
    currentBufferList,
    session,
    setUi,
    switchToActivityBuffer,
    switchToAdjacentBuffer,
    toggleNicklistPanel,
    uiStore,
} from './chat';
import { getSettings } from './settings';

let lastEscape = 0;
let quickKeysTimer: ReturnType<typeof setTimeout> | undefined;

const focusInput = () => {
    const input = document.getElementById('sendMessage') as HTMLTextAreaElement | null;
    if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
};

/** Digit of a key event (layout independent), or null */
function digitOf(event: KeyboardEvent): number | null {
    const m = /^Digit(\d)$/.exec(event.code) ?? /^Numpad(\d)$/.exec(event.code);
    if (m) {
        return Number(m[1]);
    }
    return /^\d$/.test(event.key) ? Number(event.key) : null;
}

function onKeyDown(event: KeyboardEvent): void {
    if (
        session.state.status !== 'connected' &&
        session.state.status !== 'reconnecting'
    ) {
        return;
    }
    // AltGr is used to type characters: never a shortcut
    if (event.getModifierState?.('AltGraph')) {
        return;
    }
    const ui = uiStore.getState();
    const settings = getSettings();
    const alt = event.altKey && !event.ctrlKey && !event.metaKey;
    const key = event.key.toLowerCase();
    const digit = digitOf(event);

    if (ui.showQuickKeys) {
        setUi({ showQuickKeys: false });
    }

    // Alt+J then two digits: jump to a buffer by number
    if (ui.jumpMode) {
        if (!event.altKey && digit !== null) {
            event.preventDefault();
            if (ui.jumpDigit === null) {
                setUi({ jumpDigit: digit });
                return;
            }
            const target = currentBufferList().find(
                (b) => b.jumpKey === ui.jumpDigit! * 10 + digit,
            );
            setUi({ jumpMode: false, jumpDigit: null });
            if (target) {
                activateBuffer(target.buffer.id);
            }
            return;
        }
        setUi({ jumpMode: false, jumpDigit: null });
    }

    if (event.key === 'Escape') {
        if (ui.modal) {
            event.preventDefault();
            setUi({ modal: null });
            return;
        }
        if (Date.now() - lastEscape <= 500) {
            session.disconnect();
        }
        lastEscape = Date.now();
        return;
    }

    if (!alt) {
        return;
    }

    // Alt+1..9,0: quick switch (in the list order when filtering)
    if (digit !== null && settings.enableQuickKeys) {
        const target = currentBufferList().find((b) => b.quickKey === String(digit));
        if (target) {
            event.preventDefault();
            activateBuffer(target.buffer.id);
        }
        return;
    }

    switch (key) {
        case 'n':
            event.preventDefault();
            toggleNicklistPanel();
            break;
        case 'a':
            event.preventDefault();
            switchToActivityBuffer();
            break;
        case 'arrowup':
        case 'arrowdown':
            event.preventDefault();
            switchToAdjacentBuffer(key === 'arrowup' ? -1 : 1);
            break;
        case 'l':
            event.preventDefault();
            focusInput();
            break;
        case 'g':
            event.preventDefault();
            setUi({ sidebarOpen: true });
            setTimeout(() => document.getElementById('bufferFilter')?.focus());
            break;
        case 'h':
            event.preventDefault();
            session.clearAllHotlists();
            break;
        case 'j':
            event.preventDefault();
            setUi({ jumpMode: true, jumpDigit: null, search: '' });
            break;
        case 'alt':
            // Show the quick keys while Alt is held
            if (settings.enableQuickKeys && !event.shiftKey) {
                setUi({ showQuickKeys: true });
            }
            break;
        default:
            // Alt+< (IntlBackslash) or Alt+` (macOS): previous buffer
            if (
                event.key === '<' ||
                event.code === 'IntlBackslash' ||
                event.code === 'Backquote'
            ) {
                event.preventDefault();
                if (session.state.previousBufferId !== null) {
                    activateBuffer(session.state.previousBufferId);
                }
            }
    }
}

function onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
        clearTimeout(quickKeysTimer);
        quickKeysTimer = setTimeout(() => setUi({ showQuickKeys: false }), 1000);
    }
}

export function initKeyboard(): () => void {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    };
}
