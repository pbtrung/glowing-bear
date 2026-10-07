import { useState, type ReactNode } from 'react';
import {
    BellRing,
    Info,
    Keyboard,
    Lock,
    LockOpen,
    MessagesSquare,
    Palette,
    SlidersHorizontal,
    type LucideIcon,
} from 'lucide-react';
import { closeModal, useChat, useUi } from '../chat';
import { DEFAULT_FONT, updateSettings, useSettings, type Settings } from '../settings';
import { THEMES } from '../theme';
import { Icon } from './Icon';
import { Modal } from './Modal';

type Tab = 'appearance' | 'chat' | 'notifications' | 'shortcuts' | 'about';

const TABS: { id: Tab; label: string; icon: LucideIcon; desktop?: boolean }[] = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'chat', label: 'Chat', icon: MessagesSquare },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard, desktop: true },
    { id: 'about', label: 'About', icon: Info },
];

const FONT_PRESETS = [
    { label: 'Inter', value: DEFAULT_FONT },
    { label: 'System', value: 'system-ui, -apple-system, sans-serif' },
    {
        label: 'Monospace',
        value: "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace",
    },
];

const SHORTCUTS: [ReactNode, string][] = [
    [
        <>
            <kbd>Alt</kbd> <kbd>0</kbd>–<kbd>9</kbd>
        </>,
        'Switch to buffer number N',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>j</kbd> <kbd>NN</kbd>
        </>,
        'Switch to buffer number NN',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>↑</kbd> / <kbd>↓</kbd>
        </>,
        'Previous / next buffer',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>a</kbd>
        </>,
        'Next buffer with activity',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>&lt;</kbd>
        </>,
        'Previously active buffer',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>g</kbd>
        </>,
        'Search buffers',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>n</kbd>
        </>,
        'Toggle nicklist',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>l</kbd>
        </>,
        'Focus the input bar',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>h</kbd>
        </>,
        'Clear all unread counters',
    ],
    [<kbd>Tab</kbd>, 'Complete nick or command'],
    [
        <>
            <kbd>↑</kbd> / <kbd>↓</kbd>
        </>,
        'Input history',
    ],
    [
        <>
            <kbd>Esc</kbd> <kbd>Esc</kbd>
        </>,
        'Disconnect',
    ],
];

type BooleanSetting = {
    [K in keyof Settings]: Settings[K] extends boolean ? K : never;
}[keyof Settings];

function SwitchRow(props: {
    setting: BooleanSetting;
    title: string;
    help: ReactNode;
    className?: string;
}) {
    const value = useSettings((s) => s[props.setting]);
    return (
        <label
            className={`settings-row ${props.className ?? ''}`}
            htmlFor={props.setting}
        >
            <span className="settings-row-text">
                <span className="settings-row-title">{props.title}</span>
                <span className="settings-row-help">{props.help}</span>
            </span>
            <span className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={props.setting}
                    checked={value}
                    onChange={(e) =>
                        updateSettings({ [props.setting]: e.target.checked })
                    }
                />
            </span>
        </label>
    );
}

function Appearance() {
    const theme = useSettings((s) => s.theme);
    const fontfamily = useSettings((s) => s.fontfamily);
    const fontsize = useSettings((s) => s.fontsize);
    const customCSS = useSettings((s) => s.customCSS);
    const size = parseInt(fontsize, 10) || 14;
    return (
        <>
            <h3 className="settings-heading">Theme</h3>
            <div className="theme-grid" role="radiogroup" aria-label="Theme">
                {THEMES.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={theme === t.id}
                        className={`theme-card${theme === t.id ? ' active' : ''}`}
                        title={t.label}
                        onClick={() => updateSettings({ theme: t.id })}
                    >
                        <span
                            className="theme-preview"
                            style={{ background: t.preview[0] }}
                        >
                            <span
                                className="theme-preview-side"
                                style={{ background: t.preview[1] }}
                            />
                            <span className="theme-preview-lines">
                                <span style={{ background: t.preview[2] }} />
                                <span style={{ background: t.preview[3] }} />
                                <span style={{ background: t.preview[2] }} />
                            </span>
                        </span>
                        <span className="theme-name">{t.label}</span>
                    </button>
                ))}
            </div>

            <h3 className="settings-heading">Chat text</h3>
            <div className="settings-group">
                <div className="settings-row settings-row-stacked">
                    <div className="settings-row-text">
                        <label className="settings-row-title" htmlFor="font">
                            Font
                        </label>
                        <div className="settings-row-help">
                            Used for messages and the input bar.
                        </div>
                    </div>
                    <div
                        className="btn-group btn-group-sm font-presets"
                        role="group"
                        aria-label="Font presets"
                    >
                        {FONT_PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                className={`btn btn-outline-secondary${fontfamily === preset.value ? ' active' : ''}`}
                                style={{ fontFamily: preset.value }}
                                onClick={() =>
                                    updateSettings({ fontfamily: preset.value })
                                }
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        id="font"
                        className="form-control form-control-sm font-monospace"
                        value={fontfamily}
                        spellCheck={false}
                        aria-label="Font family"
                        onChange={(e) => updateSettings({ fontfamily: e.target.value })}
                    />
                </div>
                <div className="settings-row settings-row-stacked">
                    <div className="settings-row-text">
                        <label className="settings-row-title" htmlFor="size">
                            Size
                        </label>
                        <div className="settings-row-help">{fontsize}</div>
                    </div>
                    <input
                        type="range"
                        className="form-range"
                        id="size"
                        min={11}
                        max={22}
                        step={1}
                        value={size}
                        onChange={(e) =>
                            updateSettings({ fontsize: e.target.value + 'px' })
                        }
                    />
                    <p className="font-sample favorite-font mb-0">
                        <span className="font-sample-nick">alice</span> The quick brown
                        fox jumps over the lazy dog.
                    </p>
                </div>
            </div>

            <details className="settings-advanced">
                <summary>Custom CSS</summary>
                <textarea
                    id="custom-css"
                    className="form-control font-monospace mt-2"
                    rows={4}
                    spellCheck={false}
                    aria-label="Custom CSS"
                    placeholder="#bufferlines { letter-spacing: 0.01em; }"
                    value={customCSS}
                    onChange={(e) => updateSettings({ customCSS: e.target.value })}
                />
            </details>
        </>
    );
}

function Chat() {
    return (
        <>
            <h3 className="settings-heading">Buffer list</h3>
            <div className="settings-group">
                <SwitchRow
                    setting="orderbyserver"
                    title="Group by server"
                    help="Show channels and queries under their server."
                />
                <SwitchRow
                    setting="onlyUnread"
                    title="Only buffers with unread messages"
                    help="Pinned buffers and the core buffer stay visible."
                />
                <SwitchRow
                    setting="enableQuickKeys"
                    title="Quick buffer switching"
                    className="desktop"
                    help={
                        <>
                            Use <kbd>Alt</kbd>+<kbd>0</kbd>–<kbd>9</kbd> to switch
                            buffers.
                        </>
                    }
                />
            </div>
            <h3 className="settings-heading">Nicklist</h3>
            <div className="settings-group">
                <SwitchRow
                    setting="nonicklist"
                    title="Hide nicklist"
                    className="desktop"
                    help={
                        <>
                            Toggle it anytime with <kbd>Alt</kbd>+<kbd>n</kbd>.
                        </>
                    }
                />
                <SwitchRow
                    setting="alwaysnicklist"
                    title="Always show nicklist"
                    className="mobile"
                    help="Otherwise open it from the top bar."
                />
            </div>
            <h3 className="settings-heading">Messages</h3>
            <div className="settings-group">
                <SwitchRow
                    setting="hotlistsync"
                    title="Mark messages as read in WeeChat"
                    help="Clear the hotlist and move the read marker when you view a buffer."
                />
                <SwitchRow
                    setting="readlineBindings"
                    title="Readline keybindings"
                    help={
                        <>
                            <kbd>Ctrl</kbd>+<kbd>a</kbd>/<kbd>e</kbd>/<kbd>u</kbd>/
                            <kbd>k</kbd>/<kbd>w</kbd> in the input bar.
                        </>
                    }
                />
                <SwitchRow
                    setting="enableMathjax"
                    title="LaTeX math"
                    help={
                        <>
                            Render math between <code>$$</code> delimiters with KaTeX.
                        </>
                    }
                />
            </div>
        </>
    );
}

function Notifications() {
    return (
        <>
            <h3 className="settings-heading">Notifications</h3>
            <div className="settings-group">
                <SwitchRow
                    setting="soundnotification"
                    title="Sound"
                    help="Play a sound on highlights and private messages."
                />
                <SwitchRow
                    setting="useFavico"
                    title="Unread count in the tab icon"
                    help="Also shown on the app icon when installed."
                />
            </div>
            <p className="settings-note">
                <Icon icon={Info} /> Desktop notifications for highlights and private
                messages use your browser's permission for this site.
            </p>
        </>
    );
}

function Shortcuts() {
    return (
        <>
            <h3 className="settings-heading">Keyboard shortcuts</h3>
            <dl className="shortcut-table">
                {SHORTCUTS.map(([keys, label]) => (
                    <div key={label} className="contents">
                        <dt>{keys}</dt>
                        <dd>{label}</dd>
                    </div>
                ))}
            </dl>
        </>
    );
}

function About() {
    const version = useChat((s) => s.version);
    const scripts = useChat((s) => s.scripts);
    const relay = useSettings((s) => `${s.host}:${s.port}/${s.path}`);
    const tls = useSettings((s) => s.tls);
    return (
        <>
            <div className="about-header">
                <img alt="" src="assets/img/glowing-bear.svg" />
                <div>
                    <div className="fw-semibold">Glowing Bear {__APP_VERSION__}</div>
                    <div className="small text-body-secondary">
                        WeeChat web frontend
                    </div>
                </div>
            </div>
            <h3 className="settings-heading">Connection</h3>
            <div className="settings-group">
                <div className="settings-row">
                    <span className="settings-row-title">WeeChat</span>
                    <span className="settings-row-value">
                        {version?.weechat_version ?? '–'}
                    </span>
                </div>
                <div className="settings-row">
                    <span className="settings-row-title">Relay API</span>
                    <span className="settings-row-value">
                        {version?.relay_api_version ?? '–'}
                    </span>
                </div>
                <div className="settings-row">
                    <span className="settings-row-title">Relay</span>
                    <span className="settings-row-value text-break">{relay}</span>
                </div>
                <div className="settings-row">
                    <span className="settings-row-title">Encryption</span>
                    <span className="settings-row-value">
                        <Icon icon={tls ? Lock : LockOpen} /> {tls ? 'TLS' : 'None'}
                    </span>
                </div>
            </div>
            {scripts.length > 0 && (
                <>
                    <h3 className="settings-heading">
                        Scripts{' '}
                        <span className="badge rounded-pill text-bg-secondary">
                            {scripts.length}
                        </span>
                    </h3>
                    <div className="settings-group scripts-list">
                        {[...scripts]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((script) => (
                                <div className="settings-row" key={script.name}>
                                    <span className="settings-row-text">
                                        <span className="settings-row-title">
                                            {script.name}
                                        </span>
                                        <span className="settings-row-help">
                                            {script.description}
                                        </span>
                                    </span>
                                    <span className="settings-row-value">
                                        {script.version}
                                    </span>
                                </div>
                            ))}
                    </div>
                </>
            )}
            <p className="settings-note">
                <Icon icon={Info} /> Settings are stored in this browser only.
            </p>
        </>
    );
}

const PANES: Record<Tab, () => ReactNode> = {
    appearance: Appearance,
    chat: Chat,
    notifications: Notifications,
    shortcuts: Shortcuts,
    about: About,
};

export function SettingsDialog() {
    const open = useUi((s) => s.modal === 'settings');
    const [tab, setTab] = useState<Tab>('appearance');
    const Pane = PANES[tab];
    return (
        <Modal
            id="settingsModal"
            open={open}
            labelledBy="settingsTitle"
            className="settings-modal"
            dialogClassName="modal-lg modal-fullscreen-sm-down"
        >
            <div className="modal-header">
                <h2
                    className="modal-title h5 d-flex align-items-center gap-2"
                    id="settingsTitle"
                >
                    <Icon icon={SlidersHorizontal} /> Settings
                </h2>
                <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                />
            </div>
            <div className="settings-layout">
                <nav
                    className="settings-nav"
                    role="tablist"
                    aria-label="Settings sections"
                >
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.id}
                            className={`settings-nav-item${tab === t.id ? ' active' : ''}${t.desktop ? ' desktop' : ''}`}
                            onClick={(e) => {
                                setTab(t.id);
                                e.currentTarget.scrollIntoView({
                                    block: 'nearest',
                                    inline: 'nearest',
                                });
                            }}
                        >
                            <Icon icon={t.icon} />
                            <span>{t.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="settings-panes modal-body" role="tabpanel">
                    <Pane />
                </div>
            </div>
        </Modal>
    );
}
