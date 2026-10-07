import type { LucideIcon } from 'lucide-react';

interface IconProps {
    icon: LucideIcon;
    spin?: boolean;
    className?: string;
}

/** A Lucide icon, sized with the text */
export function Icon({ icon: Svg, spin = false, className = '' }: IconProps) {
    return (
        <span
            className={`gb-icon ${spin ? 'gb-spin' : ''} ${className}`.trim()}
            aria-hidden="true"
        >
            <Svg className="gb-icon-svg" focusable="false" />
        </span>
    );
}
