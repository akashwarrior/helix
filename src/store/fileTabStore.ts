import { create } from "zustand";

interface Tab {
    name: string;
    path: string;
    active: boolean;
    modified: boolean;
}

interface FileTabStore {
    fileTabs: Tab[];
    addTab: (tab: Omit<Tab, 'active'>) => void;
    removeTab: (path: string) => void;
    setActiveTab: (path: string) => void;
    setModified: (path: string, modified: boolean) => void;
    getActiveTab: () => Tab | undefined;
}

export const useFileTabStore = create<FileTabStore>((set, get) => ({
    fileTabs: [],

    addTab: (newTab) => set((state) => {
        const existingIndex = state.fileTabs.findIndex(tab => tab.path === newTab.path);
        let updatedTabs: Tab[];
        if (existingIndex !== -1) {
            updatedTabs = state.fileTabs.map((tab, idx) => ({
                ...tab,
                active: idx === existingIndex
            }));
        } else {
            updatedTabs = state.fileTabs.map(tab => ({ ...tab, active: false }));
            updatedTabs.push({ ...newTab, active: true, modified: false });
        }
        return { fileTabs: updatedTabs };
    }),

    removeTab: (path) => set((state) => {
        const idx = state.fileTabs.findIndex(tab => tab.path === path);
        if (idx === -1) return { fileTabs: state.fileTabs };
        const wasActive = state.fileTabs[idx].active;
        const newTabs = state.fileTabs.filter(tab => tab.path !== path);
        if (wasActive && newTabs.length > 0) {
            const newActiveIdx = idx > 0 ? idx - 1 : 0;
            return {
                fileTabs: newTabs.map((tab, i) => ({
                    ...tab,
                    active: i === newActiveIdx
                }))
            };
        }
        return { fileTabs: newTabs };
    }),

    setActiveTab: (path) => set((state) => {
        if (!state.fileTabs.some(tab => tab.path === path)) return { fileTabs: state.fileTabs };
        return {
            fileTabs: state.fileTabs.map(tab => ({
                ...tab,
                active: tab.path === path
            }))
        };
    }),

    setModified: (path, modified) => set((state) => {
        if (!state.fileTabs.some(tab => tab.path === path)) return { fileTabs: state.fileTabs };
        return {
            fileTabs: state.fileTabs.map(tab => ({
                ...tab,
                modified: tab.path === path ? modified : tab.modified
            }))
        };
    }),

    getActiveTab: () => {
        const state = get();
        return state.fileTabs.find(tab => tab.active);
    },
}));