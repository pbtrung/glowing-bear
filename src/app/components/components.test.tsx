import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { Modal } from './Modal';
import { SearchBox } from './SearchBox';

afterEach(cleanup);

describe('SearchBox', () => {
    it('clears the text with Escape, without letting it bubble', () => {
        const onClear = vi.fn();
        const onKey = vi.fn();
        const outside = vi.fn();
        const { getByRole, rerender } = render(
            <div onKeyDown={outside}>
                <SearchBox
                    value="abc"
                    onChange={() => undefined}
                    onClear={onClear}
                    onKeyDown={onKey}
                    placeholder="Search"
                    label="Search"
                />
            </div>,
        );
        fireEvent.keyDown(getByRole('searchbox'), { key: 'Escape' });
        expect(onClear).toHaveBeenCalledOnce();
        expect(outside).not.toHaveBeenCalled();
        // Empty: Escape goes on (double Escape disconnects)
        rerender(
            <div onKeyDown={outside}>
                <SearchBox
                    value=""
                    onChange={() => undefined}
                    onClear={onClear}
                    onKeyDown={onKey}
                    placeholder="Search"
                    label="Search"
                />
            </div>,
        );
        fireEvent.keyDown(getByRole('searchbox'), { key: 'Escape' });
        expect(onClear).toHaveBeenCalledOnce();
        expect(outside).toHaveBeenCalledOnce();
        expect(onKey).toHaveBeenCalledOnce();
    });
});

describe('Modal', () => {
    const dialog = (open: boolean) => (
        <>
            <button type="button">outside</button>
            <Modal id="m" open={open} labelledBy="t">
                <h2 id="t">Title</h2>
                <button type="button">first</button>
                <button type="button">last</button>
            </Modal>
        </>
    );

    it('takes the focus when opened and gives it back when closed', () => {
        const { getByText, rerender, container } = render(dialog(false));
        expect(container.querySelector('#m')?.hasAttribute('inert')).toBe(true);
        getByText('outside').focus();
        rerender(dialog(true));
        expect(document.activeElement?.classList).toContain('modal-dialog');
        rerender(dialog(false));
        expect(document.activeElement).toBe(getByText('outside'));
    });

    it('keeps Tab inside the dialog', () => {
        const { getByText } = render(dialog(true));
        getByText('last').focus();
        fireEvent.keyDown(getByText('last'), { key: 'Tab' });
        expect(document.activeElement).toBe(getByText('first'));
        fireEvent.keyDown(getByText('first'), { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(getByText('last'));
    });
});

describe('ErrorBoundary', () => {
    function Broken({ fail }: { fail: boolean }) {
        if (fail) {
            throw new Error('bad line');
        }
        return <p>fine</p>;
    }

    it('shows the error, retries, and resets with its key', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const { getByRole, getByText, rerender } = render(
            <ErrorBoundary what="This buffer" resetKey={1}>
                <Broken fail />
            </ErrorBoundary>,
        );
        expect(getByRole('alert').textContent).toContain(
            'This buffer could not be displayed.',
        );
        expect(getByRole('alert').textContent).toContain('bad line');
        // Another buffer
        rerender(
            <ErrorBoundary what="This buffer" resetKey={2}>
                <Broken fail={false} />
            </ErrorBoundary>,
        );
        expect(getByText('fine')).toBeTruthy();
    });
});
