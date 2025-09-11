import { create } from "zustand";
import type { WebContainerProcess } from "@webcontainer/api";

interface TerminalProcessState {
  process: WebContainerProcess | null;
  setProcess: (process: WebContainerProcess | null) => void;
}

export const useTerminalProcessStore = create<TerminalProcessState>((set) => ({
  process: null,
  setProcess: (process) => set({ process }),
}));
