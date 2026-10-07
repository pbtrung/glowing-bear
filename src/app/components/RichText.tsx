import { Fragment, useEffect, useState, type ReactNode } from 'react';
import type { RichText as RichTextPart } from '../../lib/relay/colors';
import { tokenize, type LinkMode, type Token } from '../../lib/text';
import { formatTime } from '../../lib/time-format';

interface RichTextProps {
    parts: RichTextPart[];
    /** Links to detect (none in hostmasks, see cof-chat_host) */
    links?: LinkMode;
    /** Called when a channel name is clicked */
    onChannel?: (channel: string) => void;
    /** Render LaTeX math */
    math?: boolean;
    /** Limit the length of the text (nick prefixes) */
    maxLength?: number;
}

function renderToken(
    token: Token,
    key: number,
    onChannel?: (channel: string) => void,
): ReactNode {
    switch (token.type) {
        case 'url':
            return (
                <a
                    key={key}
                    href={token.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {token.text}
                </a>
            );
        case 'channel':
            return onChannel ? (
                <a
                    key={key}
                    href="#"
                    onClick={(event) => {
                        event.preventDefault();
                        onChannel(token.text);
                    }}
                >
                    {token.text}
                </a>
            ) : (
                token.text
            );
        case 'color':
            return (
                <Fragment key={key}>
                    {token.text}{' '}
                    <span
                        className="colourbox"
                        style={{ backgroundColor: token.color }}
                    />
                </Fragment>
            );
        case 'code':
            return (
                <Fragment key={key}>
                    <span className="hidden-bracket">{token.fence}</span>
                    <code>{token.text}</code>
                    <span className="hidden-bracket">{token.fence}</span>
                </Fragment>
            );
        default:
            return token.text;
    }
}

/** Text with WeeChat colors, links, channels, color swatches and code */
export function RichText({
    parts,
    links = true,
    onChannel,
    math = false,
    maxLength,
}: RichTextProps) {
    return (
        <>
            {parts.map((part, i) => {
                let text = part.text;
                if (maxLength !== undefined && text.length > maxLength) {
                    text = text.substring(0, maxLength) + '+';
                }
                const linkify = part.classes.includes('cof-chat_host') ? false : links;
                return (
                    <span key={i} className={part.classes.join(' ')} dir="auto">
                        {math && hasMath(text) ? (
                            <MathText text={text} />
                        ) : (
                            tokenize(text, linkify).map((token, j) =>
                                renderToken(token, j, onChannel),
                            )
                        )}
                    </span>
                );
            })}
        </>
    );
}

/*
 * LaTeX math, with KaTeX loaded on first use
 */

const MATH = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;

const hasMath = (text: string) =>
    text.includes('$$') || text.includes('\\[') || text.includes('\\(');

type Katex = typeof import('katex').default;
let katexPromise: Promise<Katex> | null = null;

function loadKatex(): Promise<Katex> {
    katexPromise ??= Promise.all([
        import('katex'),
        import('katex/dist/katex.min.css'),
    ]).then(([module]) => module.default);
    return katexPromise;
}

function MathText({ text }: { text: string }) {
    const [katex, setKatex] = useState<Katex | null>(null);
    useEffect(() => {
        let cancelled = false;
        void loadKatex().then((k) => {
            if (!cancelled) {
                setKatex(() => k);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);
    if (!katex) {
        return <>{text}</>;
    }
    const nodes: ReactNode[] = [];
    let pos = 0;
    for (const m of text.matchAll(MATH)) {
        if (m.index > pos) {
            nodes.push(text.substring(pos, m.index));
        }
        const tex = m[1] ?? m[2] ?? m[3];
        // KaTeX escapes the text it renders (trust: false), its HTML is safe
        const html = katex.renderToString(tex, {
            displayMode: m[2] !== undefined,
            throwOnError: false,
            trust: false,
        });
        nodes.push(<span key={m.index} dangerouslySetInnerHTML={{ __html: html }} />);
        pos = m.index + m[0].length;
    }
    if (pos < text.length) {
        nodes.push(text.substring(pos));
    }
    return <>{nodes}</>;
}

/** Time of a line, formatted like WeeChat */
export function Time({ date, format }: { date: Date; format: string }) {
    return (
        <>
            {formatTime(date, format).map((part, i) => (
                <span
                    key={i}
                    className={
                        part.delimiter
                            ? 'cof-chat_time_delimiters cob-chat_time_delimiters coa-chat_time_delimiters'
                            : 'cof-chat_time cob-chat_time coa-chat_time'
                    }
                >
                    {part.text}
                </span>
            ))}
        </>
    );
}
