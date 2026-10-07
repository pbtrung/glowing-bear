import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { closeModal } from '../chat';

interface ModalProps {
    id: string;
    open: boolean;
    labelledBy: string;
    className?: string;
    dialogClassName?: string;
    children: ReactNode;
}

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]',
]
    .map((selector) => selector + ':not([tabindex="-1"])')
    .join(', ');

/** Keep Tab inside the dialog */
function trapTab(event: KeyboardEvent<HTMLElement>): void {
    if (event.key !== 'Tab') {
        return;
    }
    const focusable = [
        ...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE),
    ].filter((el) => el.checkVisibility?.() ?? true);
    if (focusable.length === 0) {
        event.preventDefault();
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

/**
 * A dialog shown over the page (closed with Escape, see keyboard.ts). It
 * takes the focus when opened, keeps Tab inside, and gives the focus back
 * when closed.
 */
export function Modal({
    id,
    open,
    labelledBy,
    className = '',
    dialogClassName = '',
    children,
}: ModalProps) {
    const dialog = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const previous = document.activeElement as HTMLElement | null;
        dialog.current?.focus();
        return () => previous?.focus();
    }, [open]);

    return (
        <div
            id={id}
            className={`gb-modal modal ${className}`}
            data-state={open ? 'visible' : 'hidden'}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-hidden={!open}
            inert={!open}
            onKeyDown={trapTab}
        >
            <div className="backdrop" onClick={closeModal} />
            <div
                ref={dialog}
                className={`modal-dialog modal-dialog-scrollable ${dialogClassName}`}
                tabIndex={-1}
            >
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
}
