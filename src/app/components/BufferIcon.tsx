import { MessagesSquare, Server, SquareTerminal, type LucideIcon } from 'lucide-react';
import type { Buffer } from '../../lib/state/model';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

/** Icon of a buffer: server, channel, avatar of a private chat... */
export function BufferIcon({ buffer }: { buffer: Buffer }) {
    if (buffer.type === 'private') {
        return (
            <Avatar
                name={buffer.shortName || buffer.fullName}
                className="buffer-avatar"
            />
        );
    }
    let icon: LucideIcon | null = null;
    if (buffer.type === 'server') {
        icon = Server;
    } else if (buffer.type === 'channel') {
        icon = MessagesSquare;
    } else if (buffer.plugin === 'core') {
        icon = SquareTerminal;
    }
    return <span className="buffer-icon">{icon && <Icon icon={icon} />}</span>;
}
