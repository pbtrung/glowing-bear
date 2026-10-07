/*
 * Themes, fonts and custom CSS, applied from the settings.
 */
import { settingsStore, type Settings } from './settings';

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
        id: 'base16-default',
        label: 'Base16',
        light: false,
        preview: ['#181818', '#282828', '#d8d8d8', '#7cafc2'],
    },
    {
        id: 'base16-light',
        label: 'Base16 light',
        light: true,
        preview: ['#f8f8f8', '#e8e8e8', '#383838', '#3e7184'],
    },
    {
        id: 'base16-mocha',
        label: 'Mocha',
        light: false,
        preview: ['#3b3228', '#534636', '#d0c8c6', '#8ab3b5'],
    },
    {
        id: 'base16-ocean-dark',
        label: 'Ocean dark',
        light: false,
        preview: ['#2b303b', '#343d46', '#c0c5ce', '#8fa1b3'],
    },
    {
        id: 'base16-solarized-dark',
        label: 'Solarized dark',
        light: false,
        preview: ['#002b36', '#073642', '#839496', '#268bd2'],
    },
    {
        id: 'base16-solarized-light',
        label: 'Solarized light',
        light: true,
        preview: ['#fdf6e3', '#eee8d5', '#657b83', '#268bd2'],
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

function applyTheme(themeId: string): void {
    const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    let link = document.getElementById('themeCSS') as HTMLLinkElement | null;
    const href = `css/themes/${theme.id}.css`;
    if (!link) {
        link = document.createElement('link');
        link.id = 'themeCSS';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== href) {
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

/** Apply the appearance settings now and whenever they change */
export function initAppearance(): void {
    apply(settingsStore.getState());
    settingsStore.subscribe((settings, previous) => apply(settings, previous));
}
