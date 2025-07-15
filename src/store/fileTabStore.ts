import { create } from "zustand";

interface Tab {
    name: string;
    path: string;
    active: boolean;
    modified: boolean;
}

interface FileTabStore {
    fileTabs: Tab[];
    setFileTabs: (fileTabs: Tab[]) => void;
    addTab: (tab: Omit<Tab, 'active'>) => void;
    removeTab: (path: string) => void;
    setActiveTab: (path: string) => void;
    setModified: (path: string, modified: boolean) => void;
    closeAllTabs: () => void;
    getActiveTab: () => Tab | undefined;
}

export const useFileTabStore = create<FileTabStore>((set, get) => ({
    fileTabs: [],
    
    setFileTabs: (fileTabs) => set({ fileTabs }),
    
    addTab: (newTab) => set((state) => {
        const existingTab = state.fileTabs.find(tab => tab.path === newTab.path);
        if (existingTab) {
            const updatedTabs = state.fileTabs.map(tab => ({
                ...tab,
                active: tab.path === newTab.path
            }));
            return { fileTabs: updatedTabs };
        } else {
            const updatedTabs = state.fileTabs.map(tab => ({ ...tab, active: false }));
            return { fileTabs: [...updatedTabs, { ...newTab, active: true }] };
        }
    }),
    
    removeTab: (path) => set((state) => {
        const newTabs = state.fileTabs.filter(tab => tab.path !== path);
        
        const wasActive = state.fileTabs.find(tab => tab.path === path)?.active;
        if (wasActive && newTabs.length > 0) {
            const lastTab = newTabs[newTabs.length - 1];
            return {
                fileTabs: newTabs.map(tab => ({
                    ...tab,
                    active: tab.path === lastTab.path
                }))
            };
        }
        
        return { fileTabs: newTabs };
    }),
    
    setActiveTab: (path) => set((state) => {
        const newTabs = state.fileTabs.map((tab) => ({ 
            ...tab, 
            active: tab.path === path 
        }));
        return { fileTabs: newTabs };
    }),
    
    setModified: (path, modified) => set((state) => {
        const newTabs = state.fileTabs.map((tab) => ({ 
            ...tab, 
            modified: tab.path === path ? modified : tab.modified 
        }));
        return { fileTabs: newTabs };
    }),
    
    closeAllTabs: () => set({ fileTabs: [] }),
    
    getActiveTab: () => {
        const state = get();
        return state.fileTabs.find(tab => tab.active);
    },
}));