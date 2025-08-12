import { create } from "zustand";
import type { WebContainer } from "@webcontainer/api";

interface WebContainerState {
  webContainer: WebContainer | null;
  setWebContainer: (webContainer: WebContainer) => void;
}

export const useWebContainerStore = create<WebContainerState>((set) => ({
  webContainer: null,
  setWebContainer: (webContainer) => set({ webContainer }),
}));
