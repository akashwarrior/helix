import { create } from "zustand";

interface headerOptionStore {
  title: string | null;
  setTitle: (title: string) => void;
  activeView: "Preview" | "Editor" | null;
  setActiveView: (view: "Preview" | "Editor" | null) => void;
}

export const useHeaderOption = create<headerOptionStore>((set) => ({
  title: null,
  setTitle: (title) => set({ title }),
  activeView: null,
  setActiveView: (view) => set({ activeView: view }),
}));
