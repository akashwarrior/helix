import { create } from "zustand";

interface headerOptionStore {
  activeView: "Preview" | "Editor" | "Terminal" | null;
  setActiveView: (view: "Preview" | "Editor" | "Terminal" | null) => void;
}

export const useHeaderOptionStore = create<headerOptionStore>((set) => ({
  activeView: null,
  setActiveView: (view) => set({ activeView: view }),
}));
