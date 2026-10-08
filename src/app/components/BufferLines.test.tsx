import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { applyBuffers, applyLines, initialState } from '../../lib/state/reducers';
import { apiBuffer, apiLine } from '../../lib/state/fixtures.test-helper';
import { session } from '../chat';
import { BufferLines } from './BufferLines';

/** Scroll geometry of #bufferlines (jsdom has no layout) */
const geometry = { scrollTop: 0, scrollHeight: 1000, clientHeight: 200 };
let markerAbove = false;
let rowsLaidOut = false;

const lines = (count: number) =>
    Array.from({ length: count }, (_, i) => apiLine(i + 1, 'line ' + (i + 1)));

function show(count: number, lastReadKey: string | null = null): void {
    let state = applyBuffers(initialState, [
        apiBuffer(2, 2, 'irc.libera.#weechat', '#weechat'),
    ]);
    state = applyLines(state, 2, lines(count), 100);
    const buffers = { 2: { ...state.buffers[2], lastReadKey } };
    act(() => session.store.setState({ ...state, buffers, activeBufferId: 2 }));
}

function scrollTo(scrollTop: number): void {
    geometry.scrollTop = scrollTop;
    fireEvent.scroll(document.getElementById('bufferlines')!);
}

beforeEach(() => {
    geometry.scrollTop = 800;
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
            geometry.scrollTop = Math.min(value, 800);
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
    vi.restoreAllMocks();
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
