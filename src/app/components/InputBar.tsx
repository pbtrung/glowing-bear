import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { AtSign, SendHorizontal } from 'lucide-react';
import { completeNick } from '../../lib/irc/completion';
import type { Buffer } from '../../lib/state/model';
import { session, setUi, uiStore, useUi } from '../chat';
import { getSettings } from '../settings';
import { Icon } from './Icon';
import { RichText } from './RichText';

/*
 * :shortcode: -> emoji, loaded on first use. Only segments that become
 * emoji-only are converted (not "std::io::foo").
 */
type Emojify = (text: string) => string;
let emojify: Emojify | null = null;
let emojifyLoading = false;

function loadEmojify(): void {
    if (emojify || emojifyLoading) {
        return;
    }
    emojifyLoading = true;
    void import('node-emoji').then((m) => {
        emojify = m.emojify;
    });
}

const EMOJI_ONLY = /^\p{Extended_Pictographic}(‍?\p{Extended_Pictographic}|️)*$/u;

function emojifyInput(
    text: string,
    caret: number,
): { text: string; caret: number } | null {
    if (!text.includes(':')) {
        return null;
    }
    loadEmojify();
    if (!emojify) {
        return null;
    }
    let changed = false;
    let position = 0;
    const segments = text.split(/(\s+)/).map((segment) => {
        const start = position;
        position += segment.length;
        if (/^\s+$/.test(segment) || !segment.includes(':')) {
            return segment;
        }
        const converted = emojify!(segment);
        if (converted !== segment && EMOJI_ONLY.test(converted)) {
            changed = true;
            if (caret >= start + segment.length) {
                caret += converted.length - segment.length;
            }
            return converted;
        }
        return segment;
    });
    return changed ? { text: segments.join(''), caret } : null;
}

/** Command completion state, cycling through WeeChat's list */
interface CommandCompletion {
    /** Input + buffer id the list was requested for */
    key: string;
    list: string[];
    addSpace: boolean;
    baseWord: string;
    position: number;
    index: number;
}

export function InputBar({ buffer }: { buffer: Buffer }) {
    const input = useUi((s) => s.input);
    const ref = useRef<HTMLTextAreaElement>(null);
    const pendingCaret = useRef<number | null>(null);
    const nickIteration = useRef<string | null>(null);
    const commandCompletion = useRef<CommandCompletion | null>(null);
    const commandRequest = useRef(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (el && pendingCaret.current !== null) {
            el.setSelectionRange(pendingCaret.current, pendingCaret.current);
            pendingCaret.current = null;
        }
    }, [input]);

    const setInput = (text: string, caret?: number) => {
        pendingCaret.current = caret ?? text.length;
        setUi({ input: text });
    };

    const send = () => {
        const text = uiStore.getState().input;
        if (text === '') {
            return;
        }
        setUi({ input: '' });
        commandCompletion.current = null;
        void session
            .send(buffer.id, text, () =>
                window.confirm(
                    'Are you sure you want to quit WeeChat? This will prevent you from ' +
                        'connecting with Glowing Bear until you restart WeeChat on the command line!',
                ),
            )
            .catch(() => undefined);
        ref.current?.focus();
    };

    const doCompleteNick = () => {
        const el = ref.current!;
        const options = session.state.options;
        const nicks = Object.values(buffer.nicks)
            .sort((a, b) => b.spokeAt - a.spokeAt)
            .map((n) => n.name);
        const result = completeNick(
            input,
            el.selectionStart,
            nickIteration.current,
            nicks,
            options['weechat.completion.nick_completer'] ?? ':',
            (options['weechat.completion.nick_add_space'] ?? 'on') === 'on',
        );
        nickIteration.current = result.iterCandidate;
        if (result.text !== input) {
            setInput(result.text, result.caretPos);
        }
    };

    const cycleCommand = (direction: 1 | -1) => {
        const completion = commandCompletion.current;
        if (!completion || completion.list.length === 0) {
            return;
        }
        const text = uiStore.getState().input;
        const before = text.substring(
            0,
            completion.position - completion.baseWord.length,
        );
        const after = text.substring(completion.position);
        const word = completion.list[completion.index];
        const suffix = completion.addSpace ? ' ' : '';
        const next = before + word + suffix + after;
        const caret = before.length + word.length + suffix.length;
        setInput(next, caret);
        completion.index =
            (completion.index + direction + completion.list.length) %
            completion.list.length;
        completion.baseWord = word + suffix;
        completion.position = caret;
        completion.key = next + buffer.id;
        if (completion.list.length === 1) {
            commandCompletion.current = null;
        }
    };

    const doCompleteCommand = (direction: 1 | -1) => {
        const el = ref.current!;
        const key = input + buffer.id;
        if (commandCompletion.current?.key === key) {
            cycleCommand(direction);
            return;
        }
        const caret = el.selectionStart;
        const request = ++commandRequest.current;
        void session
            .completion(buffer.id, input, caret)
            .then((completion) => {
                // The input changed while waiting
                if (
                    request !== commandRequest.current ||
                    uiStore.getState().input + buffer.id !== key
                ) {
                    return;
                }
                commandCompletion.current = {
                    key,
                    list: completion.list,
                    addSpace: completion.add_space,
                    baseWord: completion.base_word,
                    position: caret,
                    index: direction === 1 ? 0 : completion.list.length - 1,
                };
                cycleCommand(direction);
            })
            .catch(() => undefined);
    };

    const complete = (direction: 1 | -1) => {
        if (input.startsWith('/')) {
            doCompleteCommand(direction);
        } else if (direction === 1) {
            doCompleteNick();
        }
    };

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        commandRequest.current++;
        const emoji = emojifyInput(event.target.value, event.target.selectionStart);
        if (emoji) {
            setInput(emoji.text, emoji.caret);
        } else {
            setUi({ input: event.target.value });
        }
    };

    const scrollLines = (direction: 1 | -1) => {
        const lines = document.getElementById('bufferlines');
        if (!lines) {
            return;
        }
        if (direction === -1 && lines.scrollTop === 0) {
            if (!session.state.loadingLines && !buffer.allLinesFetched) {
                void session.fetchLines(buffer.id);
            }
            return;
        }
        lines.scrollBy({ top: direction * lines.clientHeight * 0.8 });
    };

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        const el = event.currentTarget;
        const caret = el.selectionStart;
        const noModifier = !event.altKey && !event.ctrlKey && !event.metaKey;

        if (event.key !== 'Tab') {
            nickIteration.current = null;
        }

        if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            noModifier &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault();
            send();
        } else if (event.key === 'Tab' && noModifier) {
            event.preventDefault();
            complete(event.shiftKey ? -1 : 1);
        } else if (event.key === 'ArrowUp' && noModifier && !event.shiftKey) {
            // In multi-line input, only from the first line
            if (input.slice(0, caret).includes('\n')) {
                return;
            }
            event.preventDefault();
            const text = session.historyUp(buffer.id, input);
            setInput(text);
        } else if (event.key === 'ArrowDown' && noModifier && !event.shiftKey) {
            if (input.slice(caret).includes('\n')) {
                return;
            }
            event.preventDefault();
            setInput(session.historyDown(buffer.id, input));
        } else if (event.key === 'PageUp' && noModifier && !event.shiftKey) {
            event.preventDefault();
            scrollLines(-1);
        } else if (event.key === 'PageDown' && noModifier && !event.shiftKey) {
            event.preventDefault();
            scrollLines(1);
        } else if (
            getSettings().readlineBindings &&
            event.ctrlKey &&
            !event.altKey &&
            !event.shiftKey
        ) {
            const key = event.key.toLowerCase();
            if (key === 'a') {
                el.setSelectionRange(0, 0);
            } else if (key === 'e') {
                el.setSelectionRange(input.length, input.length);
            } else if (key === 'u') {
                setInput(input.slice(caret), 0);
            } else if (key === 'k') {
                setInput(input.slice(0, caret));
            } else if (key === 'w') {
                const start =
                    input.slice(0, caret).replace(/\s+$/, '').lastIndexOf(' ') + 1;
                setInput(input.slice(0, start) + input.slice(caret), start);
            } else {
                return;
            }
            event.preventDefault();
        }
    };

    const hasPrompt = buffer.inputPrompt.some((part) => part.text !== '');

    return (
        <form
            id="inputform"
            onSubmit={(event) => {
                event.preventDefault();
                send();
            }}
        >
            <div className="input-group">
                {hasPrompt && (
                    <span
                        className="input-group-text input-prompt d-none d-md-flex"
                        title="WeeChat input prompt"
                    >
                        <RichText parts={buffer.inputPrompt} links={false} />
                    </span>
                )}
                <textarea
                    id="sendMessage"
                    ref={ref}
                    className="form-control favorite-font"
                    rows={1}
                    value={input}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onFocus={() => {
                        setUi({ sidebarOpen: false });
                        loadEmojify();
                    }}
                    autoComplete="on"
                    autoCapitalize="sentences"
                    enterKeyHint="send"
                    aria-label="Message"
                    placeholder={`Message ${buffer.shortName || buffer.fullName}`}
                />
                <button
                    type="button"
                    className="btn btn-input btn-complete-nick unselectable mobile"
                    title="Complete nick"
                    aria-label="Complete nick"
                    onClick={() => {
                        complete(1);
                        ref.current?.focus();
                    }}
                >
                    <Icon icon={AtSign} />
                </button>
                <button
                    type="submit"
                    className="btn btn-input btn-send unselectable"
                    title="Send"
                    aria-label="Send"
                >
                    <Icon icon={SendHorizontal} />
                </button>
            </div>
        </form>
    );
}
