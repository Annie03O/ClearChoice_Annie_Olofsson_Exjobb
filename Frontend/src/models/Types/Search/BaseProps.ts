import type { Fetcher } from "./Fetcher";

export type BaseProps<T> = {
    value: string,
    onChange: (v: string) => void;
    onSelect: (item: T) => void;
    getItemLabel: (item: T) => string;
    getItemLink: (item: T) => string;
    placeholder?: string;
    minLength?: number;
    debounceMS?: number;
    maxItems?: number;
    className?: string;
};

export type AutoCompleteProps<T> = BaseProps<T> & {
    multiple?: T[];
    links?: T[];
    fetchSuggestions: Fetcher<T>;
};