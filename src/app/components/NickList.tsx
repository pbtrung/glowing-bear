import { useState, type CSSProperties } from 'react';
import type { Buffer } from '../../lib/state/model';
import { session } from '../chat';
import { nickSections, showGroupTitles } from '../nicks';
import { useSwipe } from '../swipe';
import { Avatar } from './Avatar';
import { SearchBox } from './SearchBox';

export function NickList({ buffer }: { buffer: Buffer }) {
    const swipe = useSwipe();
    const [filter, setFilter] = useState('');
    const visible = Object.values(buffer.nicks).filter((n) => n.visible);
    const total = visible.length;
    const sections = nickSections(buffer, filter);
    const titled = showGroupTitles(buffer, visible);

    return (
        <aside id="nicklist" aria-label="Nicklist" {...swipe}>
            <div className="nicklist-header">
                <SearchBox
                    value={filter}
                    onChange={setFilter}
                    onClear={() => setFilter('')}
                    placeholder={`Filter ${total} ${total === 1 ? 'user' : 'users'}`}
                    label="Filter users"
                />
            </div>
            <div className="nicklist-body">
                {sections.map((section) => (
                    <section
                        key={section.id}
                        className="nick-section"
                        style={
                            section.depth > 0
                                ? ({ '--nick-depth': section.depth } as CSSProperties)
                                : undefined
                        }
                    >
                        {titled && section.visible && (
                            <h3
                                className={`nick-section-title ${section.classes.join(' ')}`}
                            >
                                {section.title}
                                <span className="nick-section-count">
                                    {section.nicks.length}
                                </span>
                            </h3>
                        )}
                        <ul className="list-unstyled">
                            {section.nicks.map((nick) => (
                                <li key={nick.id}>
                                    <a
                                        href="#"
                                        title={`Open a query with ${nick.name}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            session.openQuery(buffer.id, nick.name);
                                        }}
                                    >
                                        <Avatar
                                            name={nick.name}
                                            className="nick-avatar"
                                        />
                                        <span className="nick-name">
                                            {nick.prefix.trim() && (
                                                <span
                                                    className={`nick-prefix ${nick.prefixClasses.join(' ')}`}
                                                >
                                                    {nick.prefix}
                                                </span>
                                            )}
                                            <span
                                                className={nick.nameClasses.join(' ')}
                                            >
                                                {nick.name}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
                {sections.length === 0 && (
                    <p className="nick-empty">No user matches the filter.</p>
                )}
            </div>
        </aside>
    );
}
