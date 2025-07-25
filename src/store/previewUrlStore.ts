import { create } from "zustand";

interface PreviewUrlStore {
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
}

export const usePreviewUrlStore = create<PreviewUrlStore>((set) => ({
  previewUrl: "",
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
}));
