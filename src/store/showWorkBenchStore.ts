import { create } from 'zustand';

interface showWorkBenchStore {
    showWorkBench: boolean;
    setShowWorkBench: (showWorkBench: boolean) => void;
}

export const useShowWorkBenchStore = create<showWorkBenchStore>((set) => ({
    showWorkBench: false,
    setShowWorkBench: (showWorkBench) => set({ showWorkBench: showWorkBench  }),
}));