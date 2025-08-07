import { create } from "zustand";

interface showChatStore {
  isChatOpen: boolean;
  toggleChat: () => void;
}

export const useShowChatStore = create<showChatStore>((set) => ({
  isChatOpen: true,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}));
