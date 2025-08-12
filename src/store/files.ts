import { create } from "zustand";

type FileRecord = {
  path: string;
  content: string;
};

type FilesStore = {
  files: FileRecord[];
  openFilePath: string | null;
  addFile: (filePath: string, content: string) => void;
  removeFile: (path: string) => void;
  setIsOpen: (path: string) => void;
  modifyContent: (path: string, content: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  renameFolder: (oldDirPath: string, newDirPath: string) => void;
};

export const useFiles = create<FilesStore>((set) => ({
  files: [],
  openFilePath: null,

  addFile: (path, content) =>
    set((state) => {
      const files = [...state.files];
      const idx = files.findIndex((f) => f.path === path);
      if (idx !== -1) {
        files[idx] = {
          ...files[idx],
          content,
        };
      } else {
        files.push({ path, content });
      }

      return { files, openFilePath: path };
    }),

  removeFile: (path) =>
    set((state) => {
      const files = state.files.filter(
        (file) => file.path !== path && !file.path.startsWith(path + "/"),
      );
      const wasOpen = state.openFilePath
        ? state.openFilePath === path ||
          state.openFilePath.startsWith(path + "/")
        : false;
      const openFilePath = wasOpen ? null : state.openFilePath;

      return { files, openFilePath };
    }),

  setIsOpen: (path) => set(() => ({ openFilePath: path })),

  modifyContent: (path, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.path === path ? { ...file, content } : file,
      ),
      openFilePath: path,
    })),

  renameFile: (oldPath, newPath) =>
    set((state) => {
      const files = state.files.map((f) =>
        f.path === oldPath ? { ...f, path: newPath } : f,
      );
      const openFilePath =
        state.openFilePath === oldPath ? newPath : state.openFilePath;
      return { files, openFilePath };
    }),

  renameFolder: (oldDirPath, newDirPath) =>
    set((state) => {
      const prefix = oldDirPath.endsWith("/") ? oldDirPath : oldDirPath + "/";
      const newPrefix = newDirPath.endsWith("/")
        ? newDirPath
        : newDirPath + "/";
      const files = state.files.map((f) =>
        f.path.startsWith(prefix)
          ? { ...f, path: newPrefix + f.path.slice(prefix.length) }
          : f,
      );
      let openFilePath = state.openFilePath;
      if (openFilePath && openFilePath.startsWith(prefix)) {
        openFilePath = newPrefix + openFilePath.slice(prefix.length);
      }
      return { files, openFilePath };
    }),
}));
