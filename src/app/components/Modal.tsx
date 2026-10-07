import type { ReactNode } from 'react';
import { closeModal } from '../chat';

interface ModalProps {
    id: string;
    open: boolean;
    labelledBy: string;
    className?: string;
    dialogClassName?: string;
    children: ReactNode;
}

/** A dialog shown over the page (closed with Escape, see keyboard.ts) */
export function Modal({
    id,
    open,
    labelledBy,
    className = '',
    dialogClassName = '',
    children,
}: ModalProps) {
    return (
        <div
            id={id}
            className={`gb-modal modal ${className}`}
            data-state={open ? 'visible' : 'hidden'}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-hidden={!open}
        >
            <div className="backdrop" onClick={closeModal} />
            <div className={`modal-dialog modal-dialog-scrollable ${dialogClassName}`}>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
}
