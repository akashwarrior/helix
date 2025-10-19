"use client";

import useSWRInfinite from "swr/infinite";

const ITEMS_PER_PAGE = 15;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useChatList = () => {
  const { data, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/chat?skip=${index * ITEMS_PER_PAGE}&take=${ITEMS_PER_PAGE}`,
    fetcher,
    { revalidateOnMount: true },
  );

  const chats = data?.flat() || [];
  const hasMore = data?.[data.length - 1]?.length === ITEMS_PER_PAGE;

  const loadMore = () => {
    if (hasMore && !isValidating) {
      setSize((prev) => prev + 1);
    }
  };

  return {
    chats,
    hasMore,
    isLoading: isValidating,
    loadMore,
  };
};
