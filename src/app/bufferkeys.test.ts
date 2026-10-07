import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Buffer } from '../lib/state/model';
import { handleBufferKey } from './bufferkeys';
import { session, setUi } from './chat';

const fset = {
    id: 5,
    free: true,
    keys: [
        { key: 'down', command: '/fset -down' },
        { key: 'meta-f,meta-a', command: '/fset -append' },
    ],
} as Buffer;
const other = { ...fset, id: 6 } as Buffer;
const key = (k: string, alt = false) => ({
    key: k,
    code: /^[a-z]$/.test(k) ? 'Key' + k.toUpperCase() : k,
    altKey: alt,
    ctrlKey: false,
    shiftKey: false,
});

afterEach(() => {
    vi.restoreAllMocks();
    setUi({ modal: null });
});

describe('keys of free buffers', () => {
    it('runs bindings and sequences, also when Alt is pressed again', () => {
        const run = vi
            .spyOn(session, 'runKeyCommands')
            .mockImplementation(() => undefined);
        expect(handleBufferKey(key('ArrowDown'), fset)).toBe(true);
        expect(run).toHaveBeenLastCalledWith(5, ['/fset -down']);
        expect(handleBufferKey(key('f', true), fset)).toBe(true);
        expect(handleBufferKey(key('Alt', true), fset)).toBe(false);
        expect(handleBufferKey(key('a', true), fset)).toBe(true);
        expect(run).toHaveBeenLastCalledWith(5, ['/fset -append']);
        expect(handleBufferKey(key('x'), fset)).toBe(false);
    });

    it('forgets a sequence started in another buffer', () => {
        const run = vi
            .spyOn(session, 'runKeyCommands')
            .mockImplementation(() => undefined);
        handleBufferKey(key('f', true), fset);
        expect(handleBufferKey(key('a', true), other)).toBe(false);
        expect(run).not.toHaveBeenCalled();
    });

    it('does nothing while a dialog is open, or in other buffers', () => {
        setUi({ modal: 'settings' });
        expect(handleBufferKey(key('ArrowDown'), fset)).toBe(false);
        setUi({ modal: null });
        expect(handleBufferKey(key('ArrowDown'), { ...fset, free: false })).toBe(false);
    });
});
