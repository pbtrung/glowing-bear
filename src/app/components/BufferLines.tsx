import {
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import { ArrowDown, ArrowUp, History, LoaderCircle, X } from 'lucide-react';
import { READ_MARKER_TOP, type Buffer, type Line } from '../../lib/state/model';
import { canFetchMore, linesAfter, MAX_FETCHED_LINES } from '../../lib/state/reducers';
import { formatTimeText } from '../../lib/time-format';
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

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Number of lines below the view of the lines (binary search of the rows) */
function linesBelow(el: HTMLElement): number {
    const rows = el.querySelectorAll<HTMLElement>('tbody[data-line]');
    const viewBottom = el.getBoundingClientRect().bottom;
    // The last row starting in or above the view
    let low = 0;
    let high = rows.length - 1;
    let last = -1;
    while (low <= high) {
        const mid = (low + high) >> 1;
        if (rows[mid].getBoundingClientRect().top < viewBottom) {
            last = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return rows.length - 1 - last;
}

/** Same minute (the time of a line is hidden when it repeats) */
const sameMinute = (a: Date, b: Date) =>
    Math.floor(a.getTime() / 60000) === Math.floor(b.getTime() / 60000);

interface LineRowProps {
    line: Line;
    previous: Line | undefined;
    bufferId: number;
    /** Line of a free buffer (/fset...): only links with a scheme */
    free: boolean;
    timeFormat: string;
    math: boolean;
}

const LineRow = memo(function LineRow({
    line,
    previous,
    bufferId,
    free,
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
        <tr
            className={
                'bufferline' +
                (line.highlight ? ' line-highlight' : '') +
                (line.self ? ' line-self' : '') +
                (line.smartFiltered ? ' line-smart-filtered' : '')
            }
        >
            <td className="time">
                <span className={`date${repeatedTime ? ' repeated-time' : ''}`}>
                    <Time date={line.date} format={timeFormat} />
                </span>
            </td>
            <td className="prefix">
                {/* repeated-prefix: no style, a hook for custom CSS */}
                <span className={repeatedPrefix ? 'repeated-prefix' : undefined}>
                    <a
                        onClick={mention}
                        title={line.host ?? undefined}
                        {...(line.isMessage && {
                            role: 'button',
                            tabIndex: 0,
                            'aria-label': `Mention ${line.prefixText}`,
                            onKeyDown: (event: KeyboardEvent) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    mention();
                                }
                            },
                        })}
                    >
                        {line.isMessage && <span className="hidden-bracket">&lt;</span>}
                        <RichText parts={line.prefix} links={false} maxLength={25} />
                        {line.isMessage && <span className="hidden-bracket">&gt;</span>}
                    </a>
                </span>
            </td>
            <td className="message">
                <RichText
                    parts={line.content}
                    onChannel={openChannel}
                    math={math}
                    links={free ? 'scheme' : true}
                />
            </td>
        </tr>
    );
});

function showToast(text: string): void {
    const toast = document.createElement('div');
    toast.className = 'gb-toast gb-toast-short';
    toast.setAttribute('role', 'status');
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

/**
 * The lines shown (without the joins/parts/quits hidden) and the key of the
 * read marker among them
 */
function useShownLines(buffer: Buffer | undefined): {
    lines: Line[];
    marker: string | null;
} {
    const hideSmartFiltered = useSettings((s) => s.hideSmartFiltered);
    const all = buffer?.lines;
    const lastReadKey = buffer?.lastReadKey ?? null;
    return useMemo(() => {
        if (!all) {
            return { lines: [], marker: null };
        }
        const lines = hideSmartFiltered ? all.filter((l) => !l.smartFiltered) : all;
        // The read marker goes after the last line shown before it
        let marker = lastReadKey;
        if (hideSmartFiltered && marker !== null && marker !== READ_MARKER_TOP) {
            const at = all.findIndex((l) => l.key === marker);
            if (at >= 0) {
                marker =
                    all.slice(0, at + 1).findLast((l) => !l.smartFiltered)?.key ??
                    READ_MARKER_TOP;
            }
        }
        return { lines, marker };
    }, [all, lastReadKey, hideSmartFiltered]);
}

/** (memo: not rendered again when only the scroll indicators change) */
const Lines = memo(function Lines({
    buffer,
    lines,
    marker,
}: {
    buffer: Buffer;
    lines: Line[];
    marker: string | null;
}) {
    const timeFormat = useChat(
        (s) => s.options['weechat.look.buffer_time_format'] ?? '%H:%M:%S',
    );
    const math = useSettings((s) => s.enableMathjax);
    const rows = [];
    /** Index of the line among the lines (date changes aside) */
    let index = 0;
    if (marker === READ_MARKER_TOP && lines.length > 0) {
        rows.push(
            <tbody key={READ_MARKER_TOP}>
                <ReadMarker />
            </tbody>,
        );
    }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        rows.push(
            <tbody key={line.key} data-line={line.isDateChange ? undefined : index++}>
                <LineRow
                    line={line}
                    previous={lines[i - 1]}
                    bufferId={buffer.id}
                    free={buffer.free}
                    timeFormat={timeFormat}
                    math={math}
                />
                {marker === line.key && i < lines.length - 1 && <ReadMarker />}
            </tbody>,
        );
    }
    return <>{rows}</>;
});

/**
 * The lines of the active buffer
 *
 * @param inert behind a panel (mobile)
 */
export function BufferLines({ inert = false }: { inert?: boolean }) {
    const buffer = useActiveBuffer();
    const ref = useRef<HTMLElement>(null);
    const atBottom = useRef(true);
    const scrollState = useRef({ bufferId: -1, firstKey: '', height: 0 });
    /** Scroll to the read marker once the lines being fetched arrive */
    const markerPending = useRef(false);
    /** The last scroll was ours, not the user's (it loads no older lines) */
    const ownScroll = useRef(false);
    const swipe = useSwipe();
    const { lines, marker } = useShownLines(buffer);
    /**
     * The jump buttons: the last line when the user left the bottom (the
     * lines after it are new), whether the read marker is above the view
     */
    const [indicators, setIndicators] = useState({
        bufferId: -1,
        newFrom: null as string | null,
        farFromBottom: false,
        markerAbove: false,
        /** Lines below the view (like tmux's scroll position), when scrolled up */
        below: null as number | null,
    });
    /** Read marker ("buffer:key") whose button was closed */
    const [dismissed, setDismissed] = useState<string | null>(null);
    const markerId = `${buffer?.id}:${marker}`;

    const scrollToBottom = useCallback(() => {
        const el = ref.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    /** Scroll to the read marker (a third of the view down), else the bottom */
    const scrollToMarker = useCallback(() => {
        const el = ref.current;
        const row = el?.querySelector<HTMLElement>('.readmarker');
        if (!el) {
            return;
        }
        if (row) {
            // (offsetTop would be from its table)
            const top =
                row.getBoundingClientRect().top -
                el.getBoundingClientRect().top +
                el.scrollTop;
            ownScroll.current = true;
            el.scrollTop = Math.max(0, top - el.clientHeight / 3);
        } else {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    const updateIndicators = useCallback(() => {
        const el = ref.current;
        if (!el || !buffer) {
            return;
        }
        const bottom = atBottom.current;
        const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const row = el.querySelector('.readmarker');
        const markerAbove =
            row !== null &&
            row.getBoundingClientRect().bottom <= el.getBoundingClientRect().top;
        const lastKey = lines.findLast((l) => !l.isDateChange)?.key ?? null;
        const below = bottom ? null : linesBelow(el);
        setIndicators((prev) => {
            const previousFrom = prev.bufferId === buffer.id ? prev.newFrom : null;
            const next = {
                bufferId: buffer.id,
                newFrom: bottom ? null : (previousFrom ?? lastKey),
                farFromBottom: fromBottom > el.clientHeight,
                markerAbove,
                below,
            };
            return next.bufferId === prev.bufferId &&
                next.newFrom === prev.newFrom &&
                next.farFromBottom === prev.farFromBottom &&
                next.markerAbove === prev.markerAbove &&
                next.below === prev.below
                ? prev
                : next;
        });
    }, [buffer, lines]);

    // Keep the scroll position meaningful when lines change
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || !buffer) {
            return;
        }
        const state = scrollState.current;
        const firstKey = buffer.lines[0]?.key ?? '';
        const showMarker = scrollToMarker;
        const fetched = buffer.linesFetched && !buffer.loadingLines;
        if (state.bufferId !== buffer.id) {
            // Switched buffer: show the read marker, else the bottom (again
            // when the lines are fetched: the marker is placed then)
            markerPending.current = !fetched;
            showMarker();
        } else if (markerPending.current && fetched) {
            markerPending.current = false;
            showMarker();
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
        updateIndicators();
    }, [buffer, scrollToMarker, updateIndicators]);

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
        if (buffer && !buffer.loadingLines && canFetchMore(buffer)) {
            void session.fetchLines(buffer.id);
        }
    }, [buffer]);

    const onScroll = () => {
        const el = ref.current;
        if (!el) {
            return;
        }
        const wasAtBottom = atBottom.current;
        atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
        scrollState.current.height = el.scrollHeight;
        if (atBottom.current && !wasAtBottom) {
            // Scrolled down to the end: the unread lines were read
            setDismissed(markerId);
        }
        if (ownScroll.current) {
            ownScroll.current = false;
        } else if (el.scrollTop < 50) {
            fetchMore();
        }
        updateIndicators();
    };

    /** Show the read marker, fetching older lines if it's above them */
    const jumpToMarker = () => {
        if (buffer && marker === READ_MARKER_TOP && canFetchMore(buffer)) {
            markerPending.current = true;
            fetchMore();
        }
        scrollToMarker();
        setDismissed(markerId);
    };

    const jumpToBottom = () => {
        const el = ref.current;
        if (!el) {
            return;
        }
        const reduceMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (typeof el.scrollTo === 'function') {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: reduceMotion ? 'auto' : 'smooth',
            });
        } else {
            el.scrollTop = el.scrollHeight;
        }
    };

    if (!buffer) {
        return <main id="bufferlines" className="favorite-font" inert={inert} />;
    }

    const classes = ['favorite-font'];
    if (buffer.hideTime) classes.push('hideTime');
    if (buffer.free) classes.push('freeBuffer');

    const current = indicators.bufferId === buffer.id;
    const unread =
        current && indicators.markerAbove && dismissed !== markerId
            ? linesAfter(lines, marker)
            : null;
    const newLines =
        current && indicators.newFrom !== null
            ? linesAfter(lines, indicators.newFrom)
            : null;
    const showNew =
        newLines !== null && (newLines.count > 0 || indicators.farFromBottom);

    return (
        <main
            id="bufferlines"
            className={classes.join(' ')}
            ref={ref}
            onScroll={onScroll}
            inert={inert}
            {...swipe}
        >
            {current && indicators.below !== null && (
                <div className="scroll-position-anchor">
                    <span
                        className="scroll-position"
                        title={
                            canFetchMore(buffer) || buffer.allLinesFetched
                                ? 'Lines below the view / lines loaded'
                                : `Lines below the view / lines loaded (at most ${MAX_FETCHED_LINES})`
                        }
                    >
                        [{indicators.below}/
                        {lines.filter((l) => !l.isDateChange).length}]
                    </span>
                </div>
            )}
            {unread?.first && (
                <div className="jump-top">
                    <div className="jump-pill" role="group" aria-label="Unread lines">
                        <button type="button" onClick={jumpToMarker}>
                            <Icon icon={ArrowUp} /> {unread.count} unread since{' '}
                            {formatTimeText(
                                unread.first.date,
                                sameDay(unread.first.date, new Date())
                                    ? '%H:%M'
                                    : '%a %H:%M',
                            )}
                        </button>
                        <button
                            type="button"
                            aria-label="Dismiss"
                            title="Dismiss"
                            onClick={() => setDismissed(markerId)}
                        >
                            <Icon icon={X} />
                        </button>
                    </div>
                </div>
            )}
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
                                ) : !canFetchMore(buffer) ? (
                                    <span className="text-body-secondary">
                                        Older lines are only in WeeChat
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
                <Lines buffer={buffer} lines={lines} marker={marker} />
            </table>
            {showNew && (
                <div className="jump-bottom">
                    <button
                        type="button"
                        className={
                            'jump-pill' + (newLines.highlight ? ' jump-highlight' : '')
                        }
                        onClick={jumpToBottom}
                        aria-label={
                            newLines.count > 0
                                ? `${newLines.count} new lines, jump to the end`
                                : 'Jump to the end'
                        }
                    >
                        {newLines.count > 0 && <span>{newLines.count} new</span>}
                        <Icon icon={ArrowDown} />
                    </button>
                </div>
            )}
            <span id="end-of-buffer" />
        </main>
    );
}
