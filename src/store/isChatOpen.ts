import { create } from 'zustand';

interface IsChatOpenStore {
    isChatOpen: boolean;
    setIsChatOpen: (isChatOpen: boolean) => void;
}

export const useIsChatOpen = create<IsChatOpenStore>((set) => ({
    isChatOpen: true,
    setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
}));