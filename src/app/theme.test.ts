import { expect, it } from 'vitest';
import { DEFAULT_SETTINGS, settingsStore } from './settings';
import { initAppearance } from './theme';

it('uses the default theme when a stored theme no longer exists', async () => {
    const previous = settingsStore.getState();
    settingsStore.setState({ theme: 'removed-theme' });
    try {
        await initAppearance(0);
        expect(document.getElementById('themeCSS')?.getAttribute('href')).toBe(
            `css/themes/${DEFAULT_SETTINGS.theme}.css`,
        );
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
        expect(
            document
                .getElementById('themeCSS')!
                .compareDocumentPosition(document.getElementById('custom-css-tag')!) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).not.toBe(0);
    } finally {
        settingsStore.setState(previous, true);
    }
});
