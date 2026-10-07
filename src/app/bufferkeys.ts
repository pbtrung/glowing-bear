/*
 * Key bindings of free buffers (/fset, /script...): WeeChat sends them with
 * the buffer ("keys"), the commands run in the buffer.
 */
import { bindingCommands, matchKey, type KeyInput } from '../lib/keys';
import type { Buffer } from '../lib/state/model';
import { session } from './chat';

/** Keys typed of a sequence in progress (e.g. meta-f of meta-f,meta-a) */
let pending: string[] = [];

/**
 * Run the binding of a key in a free buffer. Returns whether the key was
 * used (the caller then prevents its default action).
 */
export function handleBufferKey(event: KeyInput, buffer: Buffer | undefined): boolean {
    if (!buffer?.free || buffer.keys.length === 0) {
        pending = [];
        return false;
    }
    const match = matchKey(buffer.keys, event, pending);
    if (match.type === 'prefix') {
        pending = match.prefix;
        return true;
    }
    pending = [];
    if (match.type === 'command') {
        session.runKeyCommands(buffer.id, bindingCommands(match.command));
        return true;
    }
    return false;
}
