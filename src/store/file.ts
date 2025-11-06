import { create } from "zustand";

interface File {
  path: string;
  content: string;
}

interface FileStore {
  files: File[];
  addFiles: (files: File[]) => void;
  setFiles: (files: File[]) => void;
  clearFiles: () => void;
}

export const useFileStore = create<FileStore>()((set) => ({
  files: [],
  addFiles: (files) =>
    set((state) => ({
      files: [
        ...state.files.filter(
          (file) => !files.find((f) => f.path === file.path),
        ),
        ...files,
      ],
    })),
  setFiles: (files) => set(() => ({ files })),
  clearFiles: () => set(() => ({ files: [] })),
}));
