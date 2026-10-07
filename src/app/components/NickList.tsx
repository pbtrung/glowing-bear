import { useState, type CSSProperties } from 'react';
import { Search, Users } from 'lucide-react';
import type { Buffer } from '../../lib/state/model';
import { session } from '../chat';
import { initial, nameHue, nickSections } from '../nicks';
import { useSwipe } from '../swipe';
import { Icon } from './Icon';

/** Show a filter when there are more nicks than this */
const FILTER_THRESHOLD = 10;

export function NickList({ buffer }: { buffer: Buffer }) {
    const swipe = useSwipe();
    const [filter, setFilter] = useState('');
    const total = Object.values(buffer.nicks).filter((n) => n.visible).length;
    const sections = nickSections(buffer, filter);
    // Titles only help with several groups
    const titled = nickSections(buffer).length > 1;

    return (
        <aside id="nicklist" aria-label="Nicklist" {...swipe}>
            <div className="nicklist-header">
                <Icon icon={Users} />
                <span>
                    {total} {total === 1 ? 'user' : 'users'}
                </span>
            </div>
            {total > FILTER_THRESHOLD && (
                <div className="nicklist-filter search-box">
                    <Icon icon={Search} className="search-box-icon" />
                    <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder="Filter users"
                        aria-label="Filter users"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && filter) {
                                e.stopPropagation();
                                setFilter('');
                            }
                        }}
                    />
                </div>
            )}
            {sections.map((section) => (
                <section key={section.id} className="nick-section">
                    {titled && (
                        <h3 className="nick-section-title">
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
                                    <span
                                        className="nick-avatar avatar"
                                        style={
                                            {
                                                '--avatar-hue': nameHue(nick.name),
                                            } as CSSProperties
                                        }
                                        aria-hidden="true"
                                    >
                                        {initial(nick.name)}
                                    </span>
                                    <span className="nick-name">
                                        {nick.prefix.trim() && (
                                            <span
                                                className={`nick-prefix ${nick.prefixClasses.join(' ')}`}
                                            >
                                                {nick.prefix}
                                            </span>
                                        )}
                                        <span className={nick.nameClasses.join(' ')}>
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
        </aside>
    );
}
