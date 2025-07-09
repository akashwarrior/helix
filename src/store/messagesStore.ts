import { create } from 'zustand';

interface MessageStore {
    id: string;
    content: string;
    role: 'user' | 'assistant';
}

interface MessagesStore {
    messages: MessageStore[];
    addMessage: (message: MessageStore) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
    messages: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    removeMessage: (id) => set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),
    clearMessages: () => set({ messages: [] }),
}));