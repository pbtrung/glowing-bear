import { Menu, Power, Settings, Users } from 'lucide-react';
import {
    session,
    setUi,
    toggleNicklistPanel,
    uiStore,
    useActiveBuffer,
    useUnreadTotals,
} from '../chat';
import { useSettings } from '../settings';
import { Icon } from './Icon';
import { RichText } from './RichText';

export function TopBar({ showNicklist }: { showNicklist: boolean }) {
    const buffer = useActiveBuffer();
    const { unread, notifications } = useUnreadTotals();
    const host = useSettings((s) => `${s.host}:${s.port}`);

    const nameClasses = ['buffer-name'];
    if (buffer?.type === 'channel') nameClasses.push('channel');
    if (buffer?.channelPrefix === '#') nameClasses.push('channel_hash');
    if (buffer?.channelPrefix === '+') nameClasses.push('channel_plus');
    if (buffer?.channelPrefix === '&') nameClasses.push('channel_ampersand');

    return (
        <header id="topbar">
            <button
                type="button"
                className="btn btn-icon brand"
                title={`Connected to ${host}`}
                aria-label="Buffers"
                onClick={() =>
                    setUi({
                        sidebarOpen: !uiStore.getState().sidebarOpen,
                        nicklistOpen: false,
                    })
                }
            >
                <Icon icon={Menu} className="mobile" />
                <img alt="" src="assets/img/favicon.png" className="desktop" />
            </button>

            <button
                type="button"
                className="title"
                onClick={() => setUi({ modal: 'topic' })}
                title={buffer?.titleText}
                aria-label={
                    buffer ? `Topic of ${buffer.shortName || buffer.fullName}` : 'Topic'
                }
            >
                {buffer && (
                    <>
                        <span className={nameClasses.join(' ')}>
                            {buffer.trimmedName || buffer.fullName}
                        </span>
                        {buffer.modes && (
                            <span className="buffer-modes">{buffer.modes}</span>
                        )}
                        <span className="buffer-title desktop">
                            <RichText parts={buffer.title} />
                        </span>
                    </>
                )}
            </button>

            <div className="actions">
                {(unread > 0 || notifications > 0) && (
                    <div
                        className="totals"
                        aria-label={`${unread} unread, ${notifications} highlights`}
                    >
                        {unread > 0 && (
                            <span className="badge rounded-pill text-bg-secondary">
                                {unread}
                            </span>
                        )}
                        {notifications > 0 && (
                            <span className="badge rounded-pill text-bg-danger">
                                {notifications}
                            </span>
                        )}
                    </div>
                )}
                {buffer?.hasNicklist && (
                    <button
                        type="button"
                        className={`btn btn-icon${showNicklist ? ' active' : ''}`}
                        title="Nicklist"
                        aria-label="Toggle nicklist"
                        onClick={toggleNicklistPanel}
                    >
                        <Icon icon={Users} />
                    </button>
                )}
                <button
                    type="button"
                    className="btn btn-icon settings-toggle"
                    title="Settings"
                    aria-label="Settings"
                    onClick={() => setUi({ modal: 'settings' })}
                >
                    <Icon icon={Settings} />
                </button>
                <button
                    type="button"
                    className="btn btn-icon"
                    title="Disconnect from WeeChat"
                    aria-label="Disconnect"
                    onClick={() => session.disconnect()}
                >
                    <Icon icon={Power} />
                </button>
            </div>
        </header>
    );
}
