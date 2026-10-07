import { useMemo, useState, type CSSProperties } from 'react';
import type { Buffer } from '../../lib/state/model';
import { session } from '../chat';
import { nickSections, showGroupTitles } from '../nicks';
import { useSwipe } from '../swipe';
import { Avatar } from './Avatar';
import { SearchBox } from './SearchBox';

export function NickList({ buffer }: { buffer: Buffer }) {
    const swipe = useSwipe();
    const [filter, setFilter] = useState('');
    // Computed again when the nicklist changes, not for each line added
    const { nicks, nickGroups, nicklistDisplayGroups } = buffer;
    const { visible, titled, sections } = useMemo(() => {
        const nicklist = { ...buffer, nicks, nickGroups, nicklistDisplayGroups };
        const visible = Object.values(nicks).filter((n) => n.visible);
        return {
            visible,
            titled: showGroupTitles(nicklist, visible),
            sections: nickSections(nicklist, filter),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only the nicklist matters
    }, [nicks, nickGroups, nicklistDisplayGroups, filter]);
    const total = visible.length;

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
