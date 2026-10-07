import type { KeyboardEvent, CSSProperties } from 'react';
import {
    ChevronDown,
    Hash,
    Pin,
    Search,
    Server,
    SquareTerminal,
    type LucideIcon,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { Buffer } from '../../lib/state/model';
import {
    activateBuffer,
    listBuffers,
    setUi,
    toggleServerCollapsed,
    uiStore,
    useChat,
    useUi,
    type ListedBuffer,
} from '../chat';
import { initial, nameHue } from '../nicks';
import { useSettings } from '../settings';
import { useSwipe } from '../swipe';
import { Icon } from './Icon';

function onSearchKey(
    event: KeyboardEvent<HTMLInputElement>,
    count: number,
    ids: number[],
): void {
    const ui = uiStore.getState();
    switch (event.key) {
        case 'Escape':
            event.preventDefault();
            setUi({ search: '', searchIndex: 0 });
            break;
        case 'Enter':
            event.preventDefault();
            if (count > 0) {
                activateBuffer(ids[Math.min(ui.searchIndex, count - 1)]);
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            setUi({ searchIndex: Math.max(0, ui.searchIndex - 1) });
            break;
        case 'ArrowDown':
        case 'Tab':
            event.preventDefault();
            setUi({ searchIndex: Math.min(count - 1, ui.searchIndex + 1) });
            break;
    }
}

/** Icon of a buffer: server, channel prefix, avatar of a private chat... */
function BufferIcon({ buffer }: { buffer: Buffer }) {
    if (buffer.type === 'private') {
        return (
            <span
                className="buffer-avatar avatar"
                style={{ '--avatar-hue': nameHue(buffer.shortName) } as CSSProperties}
                aria-hidden="true"
            >
                {initial(buffer.shortName || buffer.fullName)}
            </span>
        );
    }
    if (buffer.channelPrefix === '#') {
        return (
            <span className="buffer-icon">
                <Icon icon={Hash} />
            </span>
        );
    }
    // Other channel types (&, +, !) keep their prefix as text
    if (buffer.channelPrefix) {
        return (
            <span className="buffer-icon buffer-prefix" aria-hidden="true">
                {buffer.channelPrefix}
            </span>
        );
    }
    let icon: LucideIcon | null = null;
    if (buffer.type === 'server') {
        icon = Server;
    } else if (buffer.plugin === 'core') {
        icon = SquareTerminal;
    }
    return <span className="buffer-icon">{icon && <Icon icon={icon} />}</span>;
}

function BufferRow({
    item,
    active,
    highlighted,
}: {
    item: ListedBuffer;
    active: boolean;
    highlighted: boolean;
}) {
    const { buffer, quickKey, jumpKey } = item;
    const classes = ['buffer', `type-${buffer.type}`];
    if (active) classes.push('active');
    if (buffer.unread || item.hiddenUnread) classes.push('unread');
    if (buffer.notification || item.hiddenNotification) classes.push('notification');
    if (highlighted) classes.push('highlight');
    if (buffer.type === 'channel' || buffer.type === 'private') classes.push('indent');
    if (item.group) classes.push('group');

    const notification = buffer.notification + item.hiddenNotification;
    const unread = buffer.unread + item.hiddenUnread;
    const count = notification || unread;
    const label = buffer.trimmedName || buffer.fullName;

    return (
        <li className={classes.join(' ')}>
            <a
                href="#"
                title={buffer.fullName}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => {
                    e.preventDefault();
                    activateBuffer(buffer.id);
                }}
            >
                <span className="buffer-quick-key">{quickKey}</span>
                <span className="buffer-jump-key">
                    {jumpKey !== null ? String(jumpKey).padStart(2, '0') : ''}
                </span>
                <BufferIcon buffer={buffer} />
                <span className={`buffername ${buffer.nameClasses.join(' ')}`}>
                    {label}
                </span>
                {buffer.pinned && <Icon icon={Pin} className="buffer-pin" />}
                {count > 0 && (
                    <span className={`buffer-badge${notification ? ' highlight' : ''}`}>
                        {count > 999 ? '999+' : count}
                    </span>
                )}
            </a>
            {item.group && (
                <button
                    type="button"
                    className={`buffer-collapse${item.collapsed ? ' collapsed' : ''}`}
                    aria-label={`${item.collapsed ? 'Expand' : 'Collapse'} ${label}`}
                    aria-expanded={!item.collapsed}
                    onClick={() => toggleServerCollapsed(buffer)}
                >
                    <Icon icon={ChevronDown} />
                </button>
            )}
        </li>
    );
}

export function BufferList() {
    const buffers = useChat((s) => s.buffers);
    const activeId = useChat((s) => s.activeBufferId);
    const settings = useSettings(
        useShallow((s) => ({
            orderbyserver: s.orderbyserver,
            onlyUnread: s.onlyUnread,
            collapsedServers: s.collapsedServers,
        })),
    );
    const ui = useUi(
        useShallow((s) => ({
            search: s.search,
            searchIndex: s.searchIndex,
            jumpMode: s.jumpMode,
            jumpDigit: s.jumpDigit,
            showQuickKeys: s.showQuickKeys,
            sidebarOpen: s.sidebarOpen,
        })),
    );
    const swipe = useSwipe();
    const list = listBuffers(buffers, activeId, settings, ui);
    const ids = list.map((l) => l.buffer.id);

    const listClasses = ['buffer-list'];
    if (settings.orderbyserver && !ui.jumpMode && !ui.search)
        listClasses.push('indented');
    if (ui.showQuickKeys) listClasses.push('showquickkeys');
    if (ui.jumpMode) listClasses.push('showjumpkeys');

    return (
        <nav
            id="sidebar"
            data-state={ui.sidebarOpen ? 'visible' : 'hidden'}
            aria-label="Buffers"
            {...swipe}
        >
            <form
                role="search"
                className="bufferfilter"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className={`search-box${ui.jumpMode ? ' showjumpkeys' : ''}`}>
                    {ui.jumpMode ? (
                        <span className="search-box-jump">Jump</span>
                    ) : (
                        <Icon icon={Search} className="search-box-icon" />
                    )}
                    <input
                        className="form-control form-control-sm"
                        type="search"
                        id="bufferFilter"
                        value={
                            ui.jumpMode ? (ui.jumpDigit ?? '').toString() : ui.search
                        }
                        onChange={(e) =>
                            setUi({ search: e.target.value, searchIndex: 0 })
                        }
                        onKeyDown={(e) => onSearchKey(e, list.length, ids)}
                        placeholder={ui.jumpMode ? 'Number' : 'Search buffers'}
                        autoComplete="off"
                        aria-label="Search buffers"
                    />
                </div>
            </form>
            <ul className={listClasses.join(' ')}>
                {list.map((item, index) => (
                    <BufferRow
                        key={item.buffer.id}
                        item={item}
                        active={item.buffer.id === activeId}
                        highlighted={Boolean(ui.search) && ui.searchIndex === index}
                    />
                ))}
                {list.length === 0 && (
                    <li className="buffer-empty">
                        {ui.search ? 'No buffer matches the search.' : 'No buffers.'}
                    </li>
                )}
            </ul>
        </nav>
    );
}
