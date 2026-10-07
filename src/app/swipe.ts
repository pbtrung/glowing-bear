/*
 * Swipe gestures on mobile: swipe right to show the buffer list (or hide the
 * nicklist), swipe left to show the nicklist (or hide the buffer list).
 */
import { useRef, type TouchEvent } from 'react';
import { activeBuffer } from '../lib/state/reducers';
import { isMobileUi, session, setUi, uiStore } from './chat';

const MIN_DISTANCE = 60;

function swipeRight(): void {
    const ui = uiStore.getState();
    if (ui.nicklistOpen) {
        setUi({ nicklistOpen: false });
    } else if (!ui.sidebarOpen) {
        setUi({ sidebarOpen: true });
        (document.activeElement as HTMLElement | null)?.blur();
    }
}

function swipeLeft(): void {
    const ui = uiStore.getState();
    if (ui.sidebarOpen) {
        setUi({ sidebarOpen: false });
        return;
    }
    const buffer = activeBuffer(session.state);
    if (buffer?.hasNicklist && Object.keys(buffer.nicks).length > 0) {
        setUi({ nicklistOpen: true });
    }
}

/** Touch handlers detecting horizontal swipes */
export function useSwipe() {
    const start = useRef<{ x: number; y: number } | null>(null);
    return {
        onTouchStart: (event: TouchEvent) => {
            const touch = event.touches[0];
            start.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        },
        onTouchEnd: (event: TouchEvent) => {
            const touch = event.changedTouches[0];
            const from = start.current;
            start.current = null;
            if (!touch || !from || !isMobileUi()) {
                return;
            }
            const dx = touch.clientX - from.x;
            const dy = touch.clientY - from.y;
            if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < 2 * Math.abs(dy)) {
                return;
            }
            if (dx > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        },
    };
}
