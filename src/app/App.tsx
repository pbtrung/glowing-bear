import { useEffect } from 'react';
import { Info, RefreshCw } from 'lucide-react';
import {
    isMobileUi,
    session,
    setUi,
    uiStore,
    useActiveBuffer,
    useChat,
    useUi,
    useUnreadTotals,
} from './chat';
import { updateAppBadge, updateFavicon, updateTitle } from './notifications';
import { useSettings } from './settings';
import { BufferLines } from './components/BufferLines';
import { BufferList } from './components/BufferList';
import { Icon } from './components/Icon';
import { InputBar } from './components/InputBar';
import { Login } from './components/Login';
import { NickList } from './components/NickList';
import { SettingsDialog } from './components/SettingsDialog';
import { TopBar } from './components/TopBar';
import { TopicDialog } from './components/TopicDialog';

/** Title, favicon and app badge with the unread counts */
function useUnreadIndicators(): void {
    const buffer = useActiveBuffer();
    const { unread, notifications } = useUnreadTotals();
    const connected = useChat(
        (s) => s.status === 'connected' || s.status === 'reconnecting',
    );
    const useFavico = useSettings((s) => s.useFavico);
    useEffect(() => {
        updateTitle(notifications, connected ? buffer : undefined);
        updateFavicon(connected ? notifications : 0, connected ? unread : 0);
        updateAppBadge(connected ? notifications : 0, connected ? unread : 0);
    }, [unread, notifications, buffer, connected, useFavico]);
}

/** Lines read while the window was hidden are read when it comes back */
function useVisibility(): void {
    useEffect(() => {
        const onVisible = () => {
            const id = session.state.activeBufferId;
            if (document.visibilityState === 'visible' && id !== null) {
                session.markRead(id);
            }
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);
}

function Banners() {
    const status = useChat((s) => s.status);
    const upgrading = useChat((s) => s.upgrading);
    const quitting = useChat((s) => s.quitting);
    return (
        <>
            {status === 'reconnecting' && (
                <div
                    id="reconnect"
                    className="status-banner alert alert-warning"
                    role="status"
                >
                    <Icon icon={RefreshCw} spin />
                    <span>
                        <strong>Connection to WeeChat lost.</strong>{' '}
                        {upgrading && 'WeeChat is upgrading. '}
                        Reconnecting…
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => void session.reconnect()}
                    >
                        Reconnect now
                    </button>
                </div>
            )}
            {quitting && status === 'connected' && (
                <div className="status-banner alert alert-info" role="status">
                    <Icon icon={Info} />
                    <span>WeeChat is quitting.</span>
                </div>
            )}
        </>
    );
}

function Chat() {
    const buffer = useActiveBuffer();
    const sidebarOpen = useUi((s) => s.sidebarOpen);
    const nicklistOpen = useUi((s) => s.nicklistOpen);
    const nonicklist = useSettings((s) => s.nonicklist);
    const alwaysnicklist = useSettings((s) => s.alwaysnicklist);
    const mobile = isMobileUi();
    const showNicklist =
        buffer !== undefined &&
        buffer.hasNicklist &&
        buffer.nicklistLoaded &&
        Object.keys(buffer.nicks).length > 0 &&
        (mobile ? alwaysnicklist || nicklistOpen : !nonicklist);

    // On mobile, start with the buffer list closed once a buffer is shown
    useEffect(() => {
        if (isMobileUi() && uiStore.getState().sidebarOpen && buffer) {
            setUi({ sidebarOpen: false });
        }
        // only when the first buffer is shown
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buffer?.id === undefined]);

    return (
        <div
            className="content"
            id="content"
            data-sidebar={sidebarOpen ? 'visible' : 'hidden'}
        >
            <TopBar showNicklist={showNicklist} />
            <BufferList />
            <div
                className="panel-backdrop"
                onClick={() => setUi({ sidebarOpen: false, nicklistOpen: false })}
            />
            {showNicklist && buffer && <NickList buffer={buffer} />}
            <BufferLines />
            <footer className="footer">{buffer && <InputBar buffer={buffer} />}</footer>
        </div>
    );
}

export function App() {
    const status = useChat((s) => s.status);
    useUnreadIndicators();
    useVisibility();
    const connected = status === 'connected' || status === 'reconnecting';
    return (
        <>
            {connected ? <Chat /> : <Login />}
            <Banners />
            <SettingsDialog />
            <TopicDialog />
        </>
    );
}
