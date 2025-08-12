import { create } from "zustand";
import type { StepType } from "@/lib/server/constants";
import type { Role } from "@prisma/client";

type BaseStep = {
  isPending: boolean;
  isComplete: boolean;
};

type RunCommandStep = {
  stepType: StepType.RUN_COMMAND;
  command: string;
};

type OtherStep = {
  stepType: Exclude<StepType, StepType.RUN_COMMAND>;
  filePath: string;
};

export type Step = BaseStep & (RunCommandStep | OtherStep);

export interface MessageStore {
  id: string;
  content: string;
  role: Role;
  createdAt: Date;
  steps: Step[];
  title: string;
}

interface MessagesStore {
  messages: MessageStore[];
  updateMessage: (message: MessageStore) => void;
  addMessage: (message: MessageStore) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export const useMessages = create<MessagesStore>((set) => ({
  messages: [],
  updateMessage: (updatedMessage) =>
    set((state) => {
      const messages = state.messages.map((m) =>
        m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m,
      );
      return { messages };
    }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  clearMessages: () => set({ messages: [] }),
}));
