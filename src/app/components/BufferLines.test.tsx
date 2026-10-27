import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { applyBuffers, applyLines, initialState } from '../../lib/state/reducers';
import { apiBuffer, apiLine } from '../../lib/state/fixtures.test-helper';
import { session } from '../chat';
import { settingsStore, updateSettings } from '../settings';
import { BufferLines } from './BufferLines';

/** Scroll geometry of #bufferlines (jsdom has no layout) */
const geometry = { scrollTop: 0, scrollHeight: 1000, clientHeight: 200 };
let markerAbove = false;
let rowsLaidOut = false;

const lines = (count: number) =>
    Array.from({ length: count }, (_, i) => apiLine(i + 1, 'line ' + (i + 1)));

function show(
    count: number,
    lastReadKey: string | null = null,
    bufferId = 2,
    type = 'channel',
): void {
    let state = applyBuffers(initialState, [
        apiBuffer(bufferId, bufferId, 'irc.libera.#weechat', '#weechat', {
            local_variables: { plugin: 'irc', type, server: 'libera' },
        }),
    ]);
    state = applyLines(state, bufferId, lines(count), 100);
    const buffers = { [bufferId]: { ...state.buffers[bufferId], lastReadKey } };
    act(() => session.store.setState({ ...state, buffers, activeBufferId: bufferId }));
}

function scrollTo(scrollTop: number): void {
    geometry.scrollTop = scrollTop;
    fireEvent.scroll(document.getElementById('bufferlines')!);
}

beforeEach(() => {
    geometry.scrollTop = 800;
    geometry.scrollHeight = 1000;
    geometry.clientHeight = 200;
    markerAbove = false;
    rowsLaidOut = false;
    const isLines = (el: Element) => el.id === 'bufferlines';
    for (const key of ['scrollHeight', 'clientHeight'] as const) {
        vi.spyOn(Element.prototype, key, 'get').mockImplementation(function (
            this: Element,
        ) {
            return isLines(this) ? geometry[key] : 0;
        });
    }
    vi.spyOn(Element.prototype, 'scrollTop', 'get').mockImplementation(function (
        this: Element,
    ) {
        return isLines(this) ? geometry.scrollTop : 0;
    });
    vi.spyOn(Element.prototype, 'scrollTop', 'set').mockImplementation(function (
        this: Element,
        value: number,
    ) {
        if (isLines(this)) {
            geometry.scrollTop = Math.max(
                0,
                Math.min(value, geometry.scrollHeight - geometry.clientHeight),
            );
        }
    });
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: Element,
    ) {
        // #bufferlines at 0, the read marker above it or in it
        if (isLines(this)) {
            return { top: 0, bottom: 200 } as DOMRect;
        }
        // Lines 10px high from the top of the view
        const line = this.getAttribute('data-line');
        if (rowsLaidOut && line !== null) {
            const top = Number(line) * 10 - geometry.scrollTop;
            return { top, bottom: top + 10 } as DOMRect;
        }
        const above = markerAbove && this.classList.contains('readmarker');
        return { top: above ? -20 : 50, bottom: above ? -10 : 60 } as DOMRect;
    });
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('read marker expiry', () => {
    beforeEach(() => vi.useFakeTimers());

    const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

    it('hides after five seconds at the bottom and stays hidden for live messages', () => {
        show(5, 'l2');
        const { container } = render(<BufferLines />);
        advance(4000);
        show(6, 'l2');
        expect(container.querySelector('.readmarker')).not.toBeNull();
        advance(1000);
        expect(container.querySelector('.readmarker')).toBeNull();
        show(7, 'l2');
        expect(container.querySelector('.readmarker')).toBeNull();
        markerAbove = true;
        scrollTo(500);
        expect(container.querySelector('.jump-top')).toBeNull();
    });

    it('waits until the user returns to the bottom', () => {
        show(5, 'l2');
        const { container } = render(<BufferLines />);
        advance(4000);
        scrollTo(500);
        advance(10000);
        expect(container.querySelector('.readmarker')).not.toBeNull();
        scrollTo(800);
        advance(4999);
        expect(container.querySelector('.readmarker')).not.toBeNull();
        advance(1);
        expect(container.querySelector('.readmarker')).toBeNull();
    });

    it('restarts the delay when a hidden tab becomes visible', () => {
        const visibility = vi.spyOn(document, 'visibilityState', 'get');
        visibility.mockReturnValue('visible');
        show(5, 'l2');
        const { container } = render(<BufferLines />);
        advance(4000);
        visibility.mockReturnValue('hidden');
        fireEvent(document, new Event('visibilitychange'));
        advance(10000);
        expect(container.querySelector('.readmarker')).not.toBeNull();
        visibility.mockReturnValue('visible');
        fireEvent(document, new Event('visibilitychange'));
        advance(5000);
        expect(container.querySelector('.readmarker')).toBeNull();
    });

    it('keeps the divider while the channel is behind a mobile panel', () => {
        show(5, 'l2');
        const { container, rerender } = render(<BufferLines inert />);
        advance(10000);
        expect(container.querySelector('.readmarker')).not.toBeNull();
        rerender(<BufferLines />);
        advance(5000);
        expect(container.querySelector('.readmarker')).toBeNull();
    });

    it('gives a new read boundary its own delay after switching channels', () => {
        show(5, 'l2');
        const { container } = render(<BufferLines />);
        advance(4000);
        show(5, 'l2', 3);
        advance(1000);
        expect(container.querySelector('.readmarker')).not.toBeNull();
        advance(4000);
        expect(container.querySelector('.readmarker')).toBeNull();
        show(8, 'l6', 2);
        expect(container.querySelector('.readmarker')).not.toBeNull();
    });
});

describe.each(['channel', 'server'])('opening a %s buffer', (type) => {
    it('starts at the bottom even with an unread marker', () => {
        show(5, 'l2', 2, type);
        geometry.scrollTop = 0;
        render(<BufferLines />);
        expect(geometry.scrollTop).toBe(800);
    });

    it('opens another buffer at the bottom after scrolling up', () => {
        show(5);
        render(<BufferLines />);
        scrollTo(300);
        show(5, 'l2', 3, type);
        expect(geometry.scrollTop).toBe(800);
    });

    it('stays at the bottom when the initial history finishes loading', () => {
        show(0, null, 2, type);
        act(() =>
            session.store.setState((state) => ({
                buffers: {
                    2: {
                        ...state.buffers[2],
                        linesFetched: false,
                        loadingLines: true,
                    },
                },
            })),
        );
        geometry.scrollHeight = 200;
        render(<BufferLines />);
        expect(geometry.scrollTop).toBe(0);
        geometry.scrollHeight = 1000;
        show(5, 'l2', 2, type);
        expect(geometry.scrollTop).toBe(800);
    });
});

describe('network buffer layout changes', () => {
    let resize: () => void;
    let frame: FrameRequestCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();

    beforeEach(() => {
        observe.mockClear();
        disconnect.mockClear();
        vi.stubGlobal(
            'ResizeObserver',
            class {
                constructor(callback: () => void) {
                    resize = callback;
                }
                observe = observe;
                disconnect = disconnect;
            },
        );
        vi.stubGlobal(
            'requestAnimationFrame',
            vi.fn((callback: FrameRequestCallback) => {
                frame = callback;
                return 1;
            }),
        );
        vi.stubGlobal('cancelAnimationFrame', vi.fn());
        show(100, null, 2, 'server');
    });

    it('keeps the latest lines visible after the log or viewport resizes', () => {
        const { container, unmount } = render(<BufferLines />);
        expect(observe).toHaveBeenCalledWith(container.querySelector('#bufferlines'));
        expect(observe).toHaveBeenCalledWith(container.querySelector('table'));
        geometry.scrollHeight = 1500;
        resize();
        act(() => frame(0));
        expect(geometry.scrollTop).toBe(1300);
        geometry.clientHeight = 100;
        resize();
        act(() => frame(0));
        expect(geometry.scrollTop).toBe(1400);
        unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it('preserves the position when reading history', () => {
        render(<BufferLines />);
        scrollTo(300);
        geometry.scrollHeight = 1500;
        resize();
        expect(requestAnimationFrame).not.toHaveBeenCalled();
        expect(geometry.scrollTop).toBe(300);
    });

    it('lets the user scroll up before a scheduled follow runs', () => {
        render(<BufferLines />);
        geometry.scrollHeight = 1500;
        resize();
        scrollTo(300);
        act(() => frame(0));
        expect(geometry.scrollTop).toBe(300);
    });
});

describe('new lines button', () => {
    it('counts the lines added while scrolled up, and jumps to the end', () => {
        show(5);
        const { container, queryByText, getByRole } = render(<BufferLines />);
        expect(container.querySelector('.jump-bottom')).toBeNull();
        scrollTo(650);
        // Scrolled up, nothing new yet, less than a screen: no button
        expect(container.querySelector('.jump-bottom')).toBeNull();
        show(7);
        expect(queryByText('2 new')).not.toBeNull();
        const button = getByRole('button', { name: /2 new lines/ });
        const scroll = vi.fn();
        (document.getElementById('bufferlines') as HTMLElement).scrollTo = scroll;
        fireEvent.click(button);
        expect(scroll).toHaveBeenCalled();
        scrollTo(800);
        expect(container.querySelector('.jump-bottom')).toBeNull();
    });

    it('jumps to the end when far from it, without new lines', () => {
        show(5);
        const { getByRole } = render(<BufferLines />);
        scrollTo(100);
        expect(getByRole('button', { name: 'Jump to the end' })).not.toBeNull();
    });
});

describe('unread lines button', () => {
    it('shows the lines after the read marker when it is above the view', () => {
        show(5, 'l2');
        const { queryByText, getByRole, container } = render(<BufferLines />);
        expect(container.querySelector('.jump-top')).toBeNull();
        markerAbove = true;
        scrollTo(500);
        expect(queryByText(/3 unread since/)).not.toBeNull();
        fireEvent.click(getByRole('button', { name: 'Dismiss' }));
        expect(container.querySelector('.jump-top')).toBeNull();
    });

    it('is closed by reading down to the end', () => {
        show(5, 'l2');
        const { container } = render(<BufferLines />);
        markerAbove = true;
        scrollTo(500);
        expect(container.querySelector('.jump-top')).not.toBeNull();
        scrollTo(800);
        expect(container.querySelector('.jump-top')).toBeNull();
    });
});

describe('scroll position', () => {
    it('shows the lines below the view while scrolled up, like tmux', () => {
        show(100);
        geometry.scrollHeight = 1000;
        rowsLaidOut = true;
        const { container } = render(<BufferLines />);
        expect(container.querySelector('.scroll-position')).toBeNull();
        // Rows 0 to 69 start above the bottom of the view (500 + 200)
        scrollTo(500);
        expect(container.querySelector('.scroll-position')?.textContent).toBe(
            '[30/100]',
        );
        scrollTo(800);
        expect(container.querySelector('.scroll-position')).toBeNull();
    });
});

it('applies nickname width changes while preserving full nicknames', () => {
    const previous = settingsStore.getState();
    show(1);
    const nickname = 'a_very_long_nickname_that_should_stay_available';
    act(() => {
        session.store.setState((state) => ({
            buffers: {
                2: {
                    ...state.buffers[2],
                    lines: [
                        {
                            ...state.buffers[2].lines[0],
                            prefixText: nickname,
                            prefix: [{ text: nickname, classes: [] }],
                        },
                    ],
                },
            },
        }));
    });
    try {
        const { container } = render(<BufferLines />);
        act(() => updateSettings({ nickColumnWidth: 12 }));
        expect(
            (container.querySelector('main') as HTMLElement).style.getPropertyValue(
                '--gb-nick-column-width',
            ),
        ).toBe('12ch');
        const nick = container.querySelector('td.prefix a')!;
        expect(nick.textContent).toBe(`<${nickname}>`);
        expect(nick.getAttribute('title')).toBe(nickname);
        expect(JSON.parse(localStorage.getItem('nickColumnWidth')!)).toBe(12);
    } finally {
        act(() => settingsStore.setState(previous, true));
        localStorage.removeItem('nickColumnWidth');
    }
});
