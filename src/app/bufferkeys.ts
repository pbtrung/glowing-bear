/*
 * Key bindings of free buffers (/fset, /script...): WeeChat sends them with
 * the buffer ("keys"), the commands run in the buffer.
 */
import { bindingCommands, comboOf, matchKey, type KeyInput } from '../lib/keys';
import type { Buffer } from '../lib/state/model';
import { session, uiStore } from './chat';

/** A key sequence in progress (e.g. meta-f of meta-f,meta-a) */
let pending: { bufferId: number; keys: string[]; at: number } | null = null;
/** Time to type the next key of a sequence (ms) */
const SEQUENCE_TIMEOUT = 2000;

/**
 * Run the binding of a key in a free buffer. Returns whether the key was
 * used (the caller then prevents its default action).
 */
export function handleBufferKey(event: KeyInput, buffer: Buffer | undefined): boolean {
    if (!buffer?.free || buffer.keys.length === 0 || uiStore.getState().modal) {
        pending = null;
        return false;
    }
    if (comboOf(event) === null) {
        // a modifier alone (e.g. Alt pressed again in a sequence)
        return false;
    }
    const prefix =
        pending &&
        pending.bufferId === buffer.id &&
        Date.now() - pending.at < SEQUENCE_TIMEOUT
            ? pending.keys
            : [];
    const match = matchKey(buffer.keys, event, prefix);
    pending = null;
    if (match.type === 'prefix') {
        pending = { bufferId: buffer.id, keys: match.prefix, at: Date.now() };
        return true;
    }
    if (match.type === 'command') {
        session.runKeyCommands(buffer.id, bindingCommands(match.command));
        return true;
    }
    return false;
}
