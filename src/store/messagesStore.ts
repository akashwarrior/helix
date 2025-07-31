import { StepType } from "@/lib/server/constants";
import { create } from "zustand";

export interface MessageStore {
  id: string;
  content: string;
  role: "user" | "assistant" | "data";
  createdAt: Date;
  steps: Array<{
    stepType: StepType;
    path?: string;
    isPending: boolean;
    content?: string;
    isArtifactComplete: boolean;
  }>;
}

interface MessagesStore {
  messages: MessageStore[];
  updateMessage: (message: MessageStore) => void;
  addMessage: (message: MessageStore) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],
  updateMessage: (updatedMessage) =>
    set((state) => {
      const messages = [...state.messages];
      messages[messages.length - 1] = updatedMessage;
      return { messages };
    }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  clearMessages: () => set({ messages: [] }),
}));
