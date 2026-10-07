import { describe, expect, it } from 'vitest';
import { shortcutKey, typesCharacter } from './keyboard';

describe('shortcut keys', () => {
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
