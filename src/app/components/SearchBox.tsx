import type { KeyboardEvent, ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Icon } from './Icon';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    /** Escape with text clears it (and isn't counted for the double Escape) */
    onClear: () => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
    label: string;
    id?: string;
    className?: string;
    /** Shown instead of the search icon */
    prefix?: ReactNode;
}

/** A search field with an icon */
export function SearchBox({
    value,
    onChange,
    onClear,
    onKeyDown,
    placeholder,
    label,
    id,
    className = '',
    prefix,
}: SearchBoxProps) {
    return (
        <div className={`search-box ${className}`.trim()}>
            {prefix ?? <Icon icon={Search} className="search-box-icon" />}
            <input
                type="search"
                className="form-control form-control-sm"
                id={id}
                value={value}
                placeholder={placeholder}
                aria-label={label}
                autoComplete="off"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape' && value !== '') {
                        e.preventDefault();
                        e.stopPropagation();
                        onClear();
                        return;
                    }
                    onKeyDown?.(e);
                }}
            />
        </div>
    );
}
