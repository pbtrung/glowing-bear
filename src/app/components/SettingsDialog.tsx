import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
    BellRing,
    EllipsisVertical,
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
import {
    notificationPermission,
    requestNotificationPermission,
    type NotificationPermissionState,
} from '../notifications';
import { THEMES } from '../theme';
import { Icon } from './Icon';
import { Modal } from './Modal';

type Tab = 'appearance' | 'chat' | 'notifications' | 'shortcuts' | 'about';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'chat', label: 'Chat', icon: MessagesSquare },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
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
            <kbd>Alt</kbd> <kbd>1</kbd>–<kbd>9</kbd>, <kbd>0</kbd>
        </>,
        'Switch to the Nth buffer of the list (10th with 0)',
    ],
    [
        <>
            <kbd>Alt</kbd> <kbd>j</kbd> <kbd>NN</kbd>
        </>,
        'Switch to the buffer with jump key NN (shown after Alt j)',
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
            <kbd>Alt</kbd> <kbd>&lt;</kbd> / <kbd>`</kbd>
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
    [
        <>
            <kbd>Tab</kbd> / <kbd>Shift</kbd> <kbd>Tab</kbd>
        </>,
        'Complete nick or command (next / previous)',
    ],
    [
        <>
            <kbd>PgUp</kbd> / <kbd>PgDn</kbd>
        </>,
        'Scroll the lines (loads older lines at the top)',
    ],
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
            <div
                className="theme-grid"
                role="radiogroup"
                aria-label="Theme"
                onKeyDown={(event) => {
                    // Arrows choose the previous / next theme
                    const step = {
                        ArrowRight: 1,
                        ArrowDown: 1,
                        ArrowLeft: -1,
                        ArrowUp: -1,
                    }[event.key];
                    if (step === undefined) {
                        return;
                    }
                    event.preventDefault();
                    const at = Math.max(
                        0,
                        THEMES.findIndex((t) => t.id === theme),
                    );
                    const next = THEMES[(at + step + THEMES.length) % THEMES.length];
                    updateSettings({ theme: next.id });
                    document.getElementById(`theme-${next.id}`)?.focus();
                }}
            >
                {THEMES.map((t) => (
                    <button
                        key={t.id}
                        id={`theme-${t.id}`}
                        type="button"
                        role="radio"
                        aria-checked={theme === t.id}
                        tabIndex={theme === t.id ? 0 : -1}
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
                    setting="showBufferNumbers"
                    title="Buffer numbers"
                    help="Show WeeChat's numbers (merged buffers share theirs)."
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
                    setting="syncInput"
                    title="Share the input with WeeChat"
                    help="What you type appears in WeeChat and its other clients, and the other way around."
                />
                <SwitchRow
                    setting="hideSmartFiltered"
                    title="Hide joins, parts and quits of inactive users"
                    help="The ones WeeChat's smart filter marks (otherwise they are dimmed)."
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
                            Render math between <code>$$</code>, <code>\[ \]</code> or{' '}
                            <code>\( \)</code> delimiters with KaTeX.
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
            <NotificationPermissionRow />
        </>
    );
}

const PERMISSION_TEXT: Record<NotificationPermissionState, string> = {
    granted: 'Allowed.',
    denied: "Blocked: allow them in your browser's site settings.",
    default: 'Not allowed yet.',
    unsupported: "This browser doesn't support them.",
};

function NotificationPermissionRow() {
    const [permission, setPermission] = useState(notificationPermission);
    return (
        <p className="settings-note">
            <Icon icon={Info} /> Desktop notifications for highlights and private
            messages: {PERMISSION_TEXT[permission]}{' '}
            {permission === 'default' && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                        void requestNotificationPermission().then(setPermission)
                    }
                >
                    Allow notifications
                </button>
            )}
        </p>
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

/** On phones: the sections in a menu behind a ⋮ button */
function SectionMenu({ tab, onSelect }: { tab: Tab; onSelect: (tab: Tab) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close when clicking elsewhere
    useEffect(() => {
        if (!open) {
            return;
        }
        const onPointerDown = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    // Escape closes the menu (not the dialog); arrows move between items
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!open) {
            return;
        }
        const items = [
            ...(ref.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ??
                []),
        ];
        const at = items.indexOf(document.activeElement as HTMLElement);
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            ref.current?.querySelector<HTMLElement>('button')?.focus();
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            items[(at + step + items.length) % items.length]?.focus();
        }
    };

    return (
        <div className="dropdown settings-menu" ref={ref} onKeyDown={onKeyDown}>
            <button
                type="button"
                className={`btn btn-icon${open ? ' active' : ''}`}
                aria-label="Settings sections"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                <Icon icon={EllipsisVertical} />
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-end${open ? ' show' : ''}`}
                role="menu"
            >
                {TABS.map((t) => (
                    <li key={t.id} role="none">
                        <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={tab === t.id}
                            className={`dropdown-item d-flex align-items-center gap-2${tab === t.id ? ' active' : ''}`}
                            onClick={() => {
                                onSelect(t.id);
                                setOpen(false);
                            }}
                        >
                            <Icon icon={t.icon} />
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function SettingsDialog() {
    const open = useUi((s) => s.modal === 'settings');
    const [tab, setTab] = useState<Tab>('appearance');
    const Pane = PANES[tab];
    const current = TABS.find((t) => t.id === tab)!;
    // Arrow keys, Home and End move between the tabs
    const onTabKey = (event: KeyboardEvent<HTMLElement>) => {
        const index = TABS.findIndex((t) => t.id === tab);
        const moves: Record<string, number> = {
            ArrowDown: index + 1,
            ArrowRight: index + 1,
            ArrowUp: index - 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: TABS.length - 1,
        };
        if (!(event.key in moves)) {
            return;
        }
        event.preventDefault();
        const next = TABS[(moves[event.key] + TABS.length) % TABS.length];
        setTab(next.id);
        document.getElementById(`settings-tab-${next.id}`)?.focus();
    };
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
                    <span className="settings-current">· {current.label}</span>
                </h2>
                <div className="d-flex align-items-center gap-1 ms-auto">
                    <SectionMenu tab={tab} onSelect={setTab} />
                    <button
                        type="button"
                        className="btn-close"
                        onClick={closeModal}
                        aria-label="Close"
                    />
                </div>
            </div>
            <div className="settings-layout">
                <nav
                    className="settings-nav"
                    role="tablist"
                    aria-label="Settings sections"
                    aria-orientation="vertical"
                    onKeyDown={onTabKey}
                >
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            id={`settings-tab-${t.id}`}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.id}
                            aria-controls="settings-pane"
                            tabIndex={tab === t.id ? 0 : -1}
                            className={`settings-nav-item${tab === t.id ? ' active' : ''}`}
                            onClick={() => setTab(t.id)}
                        >
                            <Icon icon={t.icon} />
                            <span>{t.label}</span>
                        </button>
                    ))}
                </nav>
                <div
                    id="settings-pane"
                    className="settings-panes modal-body"
                    role="tabpanel"
                    aria-labelledby={`settings-tab-${tab}`}
                >
                    <Pane />
                </div>
            </div>
        </Modal>
    );
}
