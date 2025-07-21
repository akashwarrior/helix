import { useCallback, useRef, useState } from "react";

export const useDebouncedSearch = (initialQuery = '') => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(value);
        }, 200);
    }, []);

    const clearSearch = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setSearchQuery('');
        setDebouncedQuery('');
    }, []);

    return { searchQuery, debouncedQuery, handleSearchChange, clearSearch };
};