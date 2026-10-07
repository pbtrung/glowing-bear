import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { History, LoaderCircle } from 'lucide-react';
import { READ_MARKER_TOP, type Buffer, type Line } from '../../lib/state/model';
import {
    activeBufferLineListeners,
    addMention,
    session,
    useActiveBuffer,
    useChat,
} from '../chat';
import { useSettings } from '../settings';
import { Icon } from './Icon';
import { RichText, Time } from './RichText';
import { useSwipe } from '../swipe';

/** Same minute (the time of a line is hidden when it repeats) */
const sameMinute = (a: Date, b: Date) =>
    Math.floor(a.getTime() / 60000) === Math.floor(b.getTime() / 60000);

interface LineRowProps {
    line: Line;
    previous: Line | undefined;
    bufferId: number;
    timeFormat: string;
    math: boolean;
}

const LineRow = memo(function LineRow({
    line,
    previous,
    bufferId,
    timeFormat,
    math,
}: LineRowProps) {
    const repeatedTime = previous !== undefined && sameMinute(previous.date, line.date);
    const repeatedPrefix =
        previous !== undefined && previous.prefixText === line.prefixText;
    const nick = line.prefix[line.prefix.length - 1]?.text ?? '';
    const mention = () => {
        if (line.isMessage && nick) {
            const buffer = session.state.buffers[bufferId];
            if (
                buffer?.type === 'channel' &&
                !Object.values(buffer.nicks).some((n) => n.name === nick)
            ) {
                showToast(`${nick} has left the room`);
            }
            addMention(nick);
        }
    };
    const openChannel = (channel: string) => session.openQuery(bufferId, channel);
    return (
        <tr className={`bufferline${line.highlight ? ' line-highlight' : ''}`}>
            <td className="time">
                <span className={`date${repeatedTime ? ' repeated-time' : ''}`}>
                    <Time date={line.date} format={timeFormat} />
                </span>
            </td>
            <td className="prefix">
                <span className={repeatedPrefix ? 'repeated-prefix' : undefined}>
                    <a onClick={mention}>
                        {line.isMessage && <span className="hidden-bracket">&lt;</span>}
                        <RichText parts={line.prefix} links={false} maxLength={25} />
                        {line.isMessage && <span className="hidden-bracket">&gt;</span>}
                    </a>
                </span>
            </td>
            <td className="message">
                <RichText parts={line.content} onChannel={openChannel} math={math} />
            </td>
        </tr>
    );
});

function showToast(text: string): void {
    const toast = document.createElement('div');
    toast.className = 'gb-toast gb-toast-short';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function ReadMarker() {
    return (
        <tr className="readmarker">
            <td colSpan={3}>
                <hr id="readmarker" />
            </td>
        </tr>
    );
}

function Lines({ buffer }: { buffer: Buffer }) {
    const timeFormat = useChat(
        (s) => s.options['weechat.look.buffer_time_format'] ?? '%H:%M:%S',
    );
    const math = useSettings((s) => s.enableMathjax);
    const rows = [];
    if (buffer.lastReadKey === READ_MARKER_TOP && buffer.lines.length > 0) {
        rows.push(
            <tbody key={READ_MARKER_TOP}>
                <ReadMarker />
            </tbody>,
        );
    }
    for (let i = 0; i < buffer.lines.length; i++) {
        const line = buffer.lines[i];
        rows.push(
            <tbody key={line.key}>
                <LineRow
                    line={line}
                    previous={buffer.lines[i - 1]}
                    bufferId={buffer.id}
                    timeFormat={timeFormat}
                    math={math}
                />
                {buffer.lastReadKey === line.key && i < buffer.lines.length - 1 && (
                    <ReadMarker />
                )}
            </tbody>,
        );
    }
    return <>{rows}</>;
}

/** The lines of the active buffer */
export function BufferLines() {
    const buffer = useActiveBuffer();
    const ref = useRef<HTMLElement>(null);
    const atBottom = useRef(true);
    const scrollState = useRef({ bufferId: -1, firstKey: '', height: 0 });
    const swipe = useSwipe();

    const scrollToBottom = useCallback(() => {
        const el = ref.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    // Keep the scroll position meaningful when lines change
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || !buffer) {
            return;
        }
        const state = scrollState.current;
        const firstKey = buffer.lines[0]?.key ?? '';
        if (state.bufferId !== buffer.id) {
            // Switched buffer: show the read marker, else the bottom
            const marker = el.querySelector<HTMLElement>('.readmarker');
            if (marker) {
                el.scrollTop = Math.max(0, marker.offsetTop - el.clientHeight / 3);
            } else {
                el.scrollTop = el.scrollHeight;
            }
        } else if (firstKey !== state.firstKey && !atBottom.current) {
            // Older lines loaded above: stay on the same lines
            el.scrollTop += el.scrollHeight - state.height;
        } else if (atBottom.current) {
            el.scrollTop = el.scrollHeight;
        }
        atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
        scrollState.current = {
            bufferId: buffer.id,
            firstKey,
            height: el.scrollHeight,
        };
    }, [buffer]);

    // Follow new lines; keep the bottom when the window is resized (keyboard)
    useEffect(() => {
        const follow = () => {
            if (atBottom.current) {
                requestAnimationFrame(scrollToBottom);
            }
        };
        activeBufferLineListeners.add(follow);
        window.addEventListener('resize', follow);
        return () => {
            activeBufferLineListeners.delete(follow);
            window.removeEventListener('resize', follow);
        };
    }, [scrollToBottom]);

    const fetchMore = useCallback(() => {
        if (buffer && !buffer.loadingLines && !buffer.allLinesFetched) {
            void session.fetchLines(buffer.id);
        }
    }, [buffer]);

    const onScroll = () => {
        const el = ref.current;
        if (!el) {
            return;
        }
        atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
        scrollState.current.height = el.scrollHeight;
        if (el.scrollTop < 50) {
            fetchMore();
        }
    };

    if (!buffer) {
        return <main id="bufferlines" className="favorite-font" />;
    }

    const classes = ['favorite-font'];
    if (buffer.hideTime) classes.push('hideTime');
    if (buffer.free) classes.push('freeBuffer');

    return (
        <main
            id="bufferlines"
            className={classes.join(' ')}
            ref={ref}
            onScroll={onScroll}
            {...swipe}
        >
            <table>
                <tbody>
                    <tr className="bufferline fetch-more">
                        {!buffer.allLinesFetched && (
                            <td colSpan={3}>
                                {buffer.loadingLines ? (
                                    <span className="text-body-secondary">
                                        <Icon icon={LoaderCircle} spin /> Fetching more
                                        lines…
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="fetchmorelines btn btn-sm btn-outline-secondary"
                                        onClick={fetchMore}
                                    >
                                        <Icon icon={History} /> Fetch more lines
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                </tbody>
                <Lines buffer={buffer} />
            </table>
            <span id="end-of-buffer" />
        </main>
    );
}
