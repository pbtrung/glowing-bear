import { describe, expect, it, vi } from 'vitest';
import { initKeyboard, shortcutKey, typesCharacter } from './keyboard';
import { session, setUi, uiStore } from './chat';

describe('shortcut keys', () => {
    it('ignores chat shortcuts while a dialog is open and respects handled Escape', () => {
        const previous = session.state;
        const previousUi = uiStore.getState();
        const disconnect = vi
            .spyOn(session, 'disconnect')
            .mockImplementation(() => undefined);
        const clear = vi
            .spyOn(session, 'clearAllHotlists')
            .mockImplementation(() => undefined);
        const stop = initKeyboard();
        try {
            session.store.setState({ status: 'connected' });
            setUi({ modal: 'settings' });
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'h', altKey: true }),
            );
            expect(clear).not.toHaveBeenCalled();
            const handled = new KeyboardEvent('keydown', {
                key: 'Escape',
                cancelable: true,
            });
            handled.preventDefault();
            document.dispatchEvent(handled);
            expect(uiStore.getState().modal).toBe('settings');
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(uiStore.getState().modal).toBeNull();
            expect(disconnect).not.toHaveBeenCalled();
        } finally {
            stop();
            disconnect.mockRestore();
            clear.mockRestore();
            session.store.setState(previous, true);
            uiStore.setState(previousUi, true);
        }
    });

    it('uses the key, or the physical key when Option changed it (macOS)', () => {
        expect(shortcutKey({ key: 'n', code: 'KeyN' })).toBe('n');
        expect(shortcutKey({ key: 'N', code: 'KeyN' })).toBe('n');
        expect(shortcutKey({ key: '˜', code: 'KeyN' })).toBe('n');
        expect(shortcutKey({ key: 'å', code: 'KeyA' })).toBe('a');
        expect(shortcutKey({ key: 'ArrowUp', code: 'ArrowUp' })).toBe('arrowup');
        // AZERTY: the key, not the position
        expect(shortcutKey({ key: 'a', code: 'KeyQ' })).toBe('a');
        expect(shortcutKey({ key: '<', code: 'IntlBackslash' })).toBe('<');
    });

    it('lets Option type ASCII characters in text fields', () => {
        const input = document.createElement('textarea');
        const div = document.createElement('div');
        expect(typesCharacter({ key: '@', target: input })).toBe(true);
        expect(typesCharacter({ key: '[', target: input })).toBe(true);
        expect(typesCharacter({ key: '@', target: div })).toBe(false);
        // Shortcuts
        for (const key of ['n', '5', '<', '`', '˜', '∞', 'ArrowUp']) {
            expect(typesCharacter({ key, target: input })).toBe(false);
        }
    });
});
