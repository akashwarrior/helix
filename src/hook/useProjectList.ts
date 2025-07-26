'use client';

import useSWRInfinite from 'swr/infinite';

interface Project {
    id: string;
    title: string;
    createdAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useProjectList = () => {
    const {
        data,
        size,
        setSize,
        isValidating,
        mutate: mutateProjects
    } = useSWRInfinite(
        (index) => `/api/chat?skip=${index * 15}`,
        fetcher,
        { revalidateFirstPage: false }
    );

    const projects = data ? data.flatMap(page => page.chats) : [];
    const hasMore = data ? data[data.length - 1]?.hasMore : false;
    const isLoading = !data;
    const isLoadingMore = isValidating && data;

    const addProject = (newProject: Project) => {
        mutateProjects((data) => {
            if (!data) return data;
            const newData = [...data];
            newData[0] = {
                ...newData[0],
                projects: [newProject, ...newData[0].projects]
            };
            return newData;
        }, false);
    };

    const loadMore = () => {
        if (hasMore && !isLoadingMore) {
            setSize(size + 1);
        }
    };

    return {
        projects,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMore,
        addProject
    };
};