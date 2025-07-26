'use client';

import useSWRInfinite from 'swr/infinite';

const ITEMS_PER_PAGE = 15;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useChatList = () => {
    const { data, size, setSize, isValidating } = useSWRInfinite(
        (index) => `/api/chat?skip=${index * ITEMS_PER_PAGE}`,
        fetcher,
        { revalidateFirstPage: false }
    );

    const chats = data?.flatMap(page => page.chats) || [];
    const hasMore = data?.[data.length - 1]?.chats.length === ITEMS_PER_PAGE;

    const loadMore = () => {
        if (hasMore && !isValidating) {
            setSize(size + 1);
        }
    };

    return {
        chats,
        hasMore,
        isLoading: isValidating,
        loadMore,
    };
};