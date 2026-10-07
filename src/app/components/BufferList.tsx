import type { KeyboardEvent } from 'react';
import { Pin, Search } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { activateBuffer, listBuffers, setUi, uiStore, useChat, useUi } from '../chat';
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

export function BufferList() {
    const buffers = useChat((s) => s.buffers);
    const activeId = useChat((s) => s.activeBufferId);
    const settings = useSettings(
        useShallow((s) => ({
            orderbyserver: s.orderbyserver,
            onlyUnread: s.onlyUnread,
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
    if (settings.orderbyserver && !ui.jumpMode) listClasses.push('indented');
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
                {list.map(({ buffer, quickKey, jumpKey }, index) => {
                    const classes = ['buffer'];
                    if (buffer.id === activeId) classes.push('active');
                    if (buffer.unread) classes.push('unread');
                    if (buffer.notification) classes.push('notification');
                    if (ui.search && ui.searchIndex === index)
                        classes.push('highlight');
                    if (buffer.type === 'channel' || buffer.type === 'private')
                        classes.push('indent');
                    if (buffer.type === 'server') classes.push('server');
                    if (buffer.type === 'channel') classes.push('channel');
                    if (buffer.type === 'private') classes.push('private');
                    if (buffer.channelPrefix === '#') classes.push('channel_hash');
                    if (buffer.channelPrefix === '+') classes.push('channel_plus');
                    if (buffer.channelPrefix === '&') classes.push('channel_ampersand');
                    const count = buffer.notification || buffer.unread;
                    return (
                        <li key={buffer.id} className={classes.join(' ')}>
                            <a
                                href="#"
                                title={buffer.fullName}
                                aria-current={
                                    buffer.id === activeId ? 'page' : undefined
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    activateBuffer(buffer.id);
                                }}
                            >
                                <span className="buffer-quick-key">{quickKey}</span>
                                <span className="buffer-jump-key">
                                    {jumpKey !== null
                                        ? String(jumpKey).padStart(2, '0')
                                        : ''}
                                </span>
                                <span
                                    className={`buffername ${buffer.nameClasses.join(' ')}`}
                                >
                                    {buffer.trimmedName || buffer.fullName}
                                </span>
                                {buffer.pinned && (
                                    <Icon icon={Pin} className="buffer-pin" />
                                )}
                                {count > 0 && (
                                    <span
                                        className={`badge rounded-pill ${buffer.notification ? 'text-bg-danger' : 'text-bg-secondary'}`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
