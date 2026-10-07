import { Users } from 'lucide-react';
import type { Buffer, Nick } from '../../lib/state/model';
import { isMobileUi, session } from '../chat';
import { useSwipe } from '../swipe';
import { Icon } from './Icon';

/** Nicks by group, groups and nicks sorted by name */
function groupedNicks(buffer: Buffer): { key: number; nicks: Nick[] }[] {
    const byGroup = new Map<number, Nick[]>();
    for (const nick of Object.values(buffer.nicks)) {
        if (!nick.visible) {
            continue;
        }
        const list = byGroup.get(nick.groupId) ?? [];
        list.push(nick);
        byGroup.set(nick.groupId, list);
    }
    const groupName = (id: number) => buffer.nickGroups[id]?.name ?? '';
    return [...byGroup.entries()]
        .sort(([a], [b]) => groupName(a).localeCompare(groupName(b)))
        .map(([key, nicks]) => ({
            key,
            nicks: nicks.sort((a, b) => a.name.localeCompare(b.name)),
        }));
}

export function NickList({ buffer }: { buffer: Buffer }) {
    const swipe = useSwipe();
    const groups = groupedNicks(buffer);
    const total = groups.reduce((sum, g) => sum + g.nicks.length, 0);
    return (
        <aside id="nicklist" className="favorite-font" aria-label="Nicklist" {...swipe}>
            <div className="nicklist-header">
                <Icon icon={Users} /> {total}
            </div>
            {groups.map((group) => (
                <ul key={group.key} className="nicklistgroup list-unstyled">
                    {group.nicks.map((nick) => (
                        <li key={nick.id}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    session.openQuery(buffer.id, nick.name);
                                }}
                                title={
                                    isMobileUi()
                                        ? undefined
                                        : `Open a query with ${nick.name}`
                                }
                            >
                                <span
                                    className={`nick-prefix ${nick.prefixClasses.join(' ')}`}
                                >
                                    {nick.prefix}
                                </span>
                                <span className={nick.nameClasses.join(' ')}>
                                    {nick.name}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            ))}
        </aside>
    );
}
