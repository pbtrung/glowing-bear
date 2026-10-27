/*
 * Themes, fonts and custom CSS, applied from the settings.
 */
import { DEFAULT_SETTINGS, settingsStore, type Settings } from './settings';

export interface Theme {
    id: string;
    label: string;
    /** Light background (Bootstrap light color mode) */
    light: boolean;
    /** Preview colors: background, panels, text, accent */
    preview: [string, string, string, string];
}

/** Themes in public/css/themes/ */
export const THEMES: Theme[] = [
    {
        id: 'dark',
        label: 'Dark',
        light: false,
        preview: ['#181818', '#232323', '#dddddd', '#4f8fd6'],
    },
    {
        id: 'light',
        label: 'Light',
        light: true,
        preview: ['#fdfdfd', '#f1f2f4', '#181818', '#2f6fb5'],
    },
    {
        id: 'black',
        label: 'Black',
        light: false,
        preview: ['#000000', '#080808', '#dddddd', '#4f8fd6'],
    },
    {
        id: 'dark-spacious',
        label: 'Dark spacious',
        light: false,
        preview: ['#181818', '#232323', '#dddddd', '#4f8fd6'],
    },
    {
        id: 'blue',
        label: 'Blue',
        light: false,
        preview: ['#1d222c', '#283244', '#dfdfcf', '#0f99d9'],
    },
    {
        id: 'zenburn',
        label: 'Zenburn',
        light: false,
        preview: ['#3f3f3f', '#353535', '#dcdccc', '#8cd0d3'],
    },
    {
        id: 'monokai-pro',
        label: 'Monokai Pro',
        light: false,
        preview: ['#2d2a2e', '#221f22', '#fcfcfa', '#a9dc76'],
    },
    {
        id: 'dracula',
        label: 'Dracula',
        light: false,
        preview: ['#282a36', '#21222c', '#f8f8f2', '#bd93f9'],
    },
    {
        id: 'catppuccin-latte',
        label: 'Catppuccin Latte',
        light: true,
        preview: ['#eff1f5', '#e6e9ef', '#4c4f69', '#8839ef'],
    },
    {
        id: 'catppuccin-frappe',
        label: 'Catppuccin Frappé',
        light: false,
        preview: ['#303446', '#292c3c', '#c6d0f5', '#ca9ee6'],
    },
    {
        id: 'catppuccin-macchiato',
        label: 'Catppuccin Macchiato',
        light: false,
        preview: ['#24273a', '#1e2030', '#cad3f5', '#c6a0f6'],
    },
    {
        id: 'catppuccin-mocha',
        label: 'Catppuccin Mocha',
        light: false,
        preview: ['#1e1e2e', '#181825', '#cdd6f4', '#cba6f7'],
    },
];

/** Resolves when the stylesheet of the theme is loaded (or failed) */
function applyTheme(themeId: string): Promise<void> {
    const theme =
        THEMES.find((t) => t.id === themeId) ??
        THEMES.find((t) => t.id === DEFAULT_SETTINGS.theme)!;
    let link = document.getElementById('themeCSS') as HTMLLinkElement | null;
    const href = `css/themes/${theme.id}.css`;
    if (!link) {
        link = document.createElement('link');
        link.id = 'themeCSS';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    let loaded = Promise.resolve();
    if (link.getAttribute('href') !== href) {
        const element = link;
        loaded = new Promise((resolve) => {
            element.addEventListener('load', () => resolve(), { once: true });
            element.addEventListener('error', () => resolve(), { once: true });
        });
        link.onload = () => {
            // Tint the browser UI (e.g. the mobile status bar) like the top bar
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue('--gb-chrome-bg')
                .trim();
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', color);
        };
        link.setAttribute('href', href);
    }
    document.documentElement.setAttribute(
        'data-bs-theme',
        theme.light ? 'light' : 'dark',
    );
    return loaded;
}

function applyCustomCss(css: string): void {
    let style = document.getElementById('custom-css-tag');
    if (!style) {
        style = document.createElement('style');
        style.id = 'custom-css-tag';
        document.head.appendChild(style);
    }
    style.textContent = css;
}

function applyFont(family: string, size: string): void {
    const root = document.documentElement.style;
    root.setProperty('--gb-chat-font', family);
    // A size without unit is in pixels
    root.setProperty('--gb-chat-size', /^\d+$/.test(size) ? size + 'px' : size);
}

function apply(settings: Settings, previous?: Settings): void {
    if (settings.theme !== previous?.theme) {
        applyTheme(settings.theme);
    }
    if (settings.customCSS !== previous?.customCSS) {
        applyCustomCss(settings.customCSS);
    }
    if (
        settings.fontfamily !== previous?.fontfamily ||
        settings.fontsize !== previous?.fontsize
    ) {
        applyFont(settings.fontfamily, settings.fontsize);
    }
}

/**
 * Apply the appearance settings now and whenever they change. Resolves when
 * the theme is loaded (at most after `timeout` ms), to render without a flash
 * of the default colors.
 */
export function initAppearance(timeout = 1500): Promise<void> {
    const settings = settingsStore.getState();
    const theme = applyTheme(settings.theme);
    applyCustomCss(settings.customCSS);
    applyFont(settings.fontfamily, settings.fontsize);
    settingsStore.subscribe((settings, previous) => apply(settings, previous));
    return Promise.race([theme, new Promise<void>((r) => setTimeout(r, timeout))]);
}
