import type { CSSProperties } from 'react';
import { initial, nameHue } from '../nicks';

/** Initial of a name on a color derived from it */
export function Avatar({ name, className }: { name: string; className: string }) {
    return (
        <span
            className={`${className} avatar`}
            style={{ '--avatar-hue': nameHue(name) } as CSSProperties}
            aria-hidden="true"
        >
            {initial(name)}
        </span>
    );
}
