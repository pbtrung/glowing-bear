import { memo, type KeyboardEvent } from 'react';
import {
    ChevronDown,
    Merge,
    MessagesSquare,
    Pin,
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
import { useSettings } from '../settings';
import { useSwipe } from '../swipe';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { SearchBox } from './SearchBox';

function onSearchKey(
    event: KeyboardEvent<HTMLInputElement>,
    count: number,
    ids: number[],
): void {
    const ui = uiStore.getState();
    switch (event.key) {
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
        case 'Tab':
            // moves in the results while searching, else leaves the field
            if (ui.search === '' || event.shiftKey) {
                break;
            }
            event.preventDefault();
            setUi({
                searchIndex: Math.max(0, Math.min(count - 1, ui.searchIndex + 1)),
            });
            break;
        case 'ArrowDown':
            event.preventDefault();
            setUi({
                searchIndex: Math.max(0, Math.min(count - 1, ui.searchIndex + 1)),
            });
            break;
    }
}

/** Icon of a buffer: server, channel, avatar of a private chat... */
function BufferIcon({ buffer }: { buffer: Buffer }) {
    if (buffer.type === 'private') {
        return (
            <Avatar
                name={buffer.shortName || buffer.fullName}
                className="buffer-avatar"
            />
        );
    }
    let icon: LucideIcon | null = null;
    if (buffer.type === 'server') {
        icon = Server;
    } else if (buffer.type === 'channel') {
        icon = MessagesSquare;
    } else if (buffer.plugin === 'core') {
        icon = SquareTerminal;
    }
    return <span className="buffer-icon">{icon && <Icon icon={icon} />}</span>;
}

type RowProps = { item: ListedBuffer; active: boolean; highlighted: boolean };

/** A row changes with its buffer (buffers not changed keep their object) */
function sameRow(a: RowProps, b: RowProps): boolean {
    const x = a.item;
    const y = b.item;
    return (
        a.active === b.active &&
        a.highlighted === b.highlighted &&
        x.buffer === y.buffer &&
        x.quickKey === y.quickKey &&
        x.jumpKey === y.jumpKey &&
        x.group === y.group &&
        x.collapsed === y.collapsed &&
        x.hiddenUnread === y.hiddenUnread &&
        x.hiddenNotification === y.hiddenNotification &&
        x.mergedWith.join() === y.mergedWith.join()
    );
}

const BufferRow = memo(function BufferRow({
    item,
    active,
    highlighted,
}: {
    item: ListedBuffer;
    active: boolean;
    highlighted: boolean;
}) {
    const showNumber = useSettings((s) => s.showBufferNumbers);
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
    const merged = item.mergedWith.length > 0;
    if (merged) classes.push('merged');

    return (
        <li className={classes.join(' ')}>
            <a
                href="#"
                title={
                    buffer.fullName +
                    (merged ? ` (merged with ${item.mergedWith.join(', ')})` : '')
                }
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
                {showNumber && <span className="buffer-number">{buffer.number}</span>}
                <BufferIcon buffer={buffer} />
                {merged && <Icon icon={Merge} className="buffer-merged" />}
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
}, sameRow);

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
                <SearchBox
                    id="bufferFilter"
                    className={ui.jumpMode ? 'showjumpkeys' : ''}
                    prefix={
                        ui.jumpMode ? (
                            <span className="search-box-jump">Jump</span>
                        ) : undefined
                    }
                    value={ui.jumpMode ? (ui.jumpDigit ?? '').toString() : ui.search}
                    onChange={(search) => setUi({ search, searchIndex: 0 })}
                    onClear={() => setUi({ search: '', searchIndex: 0 })}
                    onKeyDown={(e) => onSearchKey(e, list.length, ids)}
                    placeholder={ui.jumpMode ? 'Number' : 'Search buffers'}
                    label="Search buffers"
                />
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
