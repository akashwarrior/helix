import { create } from "zustand";
import { FileNode } from "@/lib/type";

interface FileTreeStore {
    fileTree: FileNode[];
    setFileTree: (fileTree: FileNode[]) => void;
}

export const useFileTreeStore = create<FileTreeStore>((set) => ({
    fileTree: [
        {
            name: 'todo-app',
            type: 'folder',
            path: 'todo-app',
            children: [
                {
                    name: 'public',
                    type: 'folder',
                    path: 'todo-app/public',
                    children: [
                        { name: 'favicon.ico', type: 'file', path: 'todo-app/public/favicon.ico' },
                        { name: 'index.html', type: 'file', path: 'todo-app/public/index.html' },
                        { name: 'manifest.json', type: 'file', path: 'todo-app/public/manifest.json' }
                    ]
                },
                {
                    name: 'src',
                    type: 'folder',
                    path: 'todo-app/src',
                    children: [
                        {
                            name: 'components',
                            type: 'folder',
                            path: 'todo-app/src/components',
                            children: [
                                { name: 'TodoItem.tsx', type: 'file', path: 'todo-app/src/components/TodoItem.tsx' },
                                { name: 'TodoList.tsx', type: 'file', path: 'todo-app/src/components/TodoList.tsx' },
                                { name: 'AddTodo.tsx', type: 'file', path: 'todo-app/src/components/AddTodo.tsx' }
                            ]
                        },
                        {
                            name: 'hooks',
                            type: 'folder',
                            path: 'todo-app/src/hooks',
                            children: [
                                { name: 'useTodos.ts', type: 'file', path: 'todo-app/src/hooks/useTodos.ts' },
                                { name: 'useLocalStorage.ts', type: 'file', path: 'todo-app/src/hooks/useLocalStorage.ts' }
                            ]
                        },
                        {
                            name: 'lib',
                            type: 'folder',
                            path: 'todo-app/src/lib',
                            children: [
                                { name: 'utils.ts', type: 'file', path: 'todo-app/src/lib/utils.ts' },
                                { name: 'constants.ts', type: 'file', path: 'todo-app/src/lib/constants.ts' }
                            ]
                        },
                        {
                            name: 'types',
                            type: 'folder',
                            path: 'todo-app/src/types',
                            children: [
                                { name: 'todo.ts', type: 'file', path: 'todo-app/src/types/todo.ts' }
                            ]
                        },
                        { name: 'App.tsx', type: 'file', path: 'todo-app/src/App.tsx' },
                        { name: 'index.css', type: 'file', path: 'todo-app/src/index.css' },
                        { name: 'main.tsx', type: 'file', path: 'todo-app/src/main.tsx' },
                        { name: 'vite-env.d.ts', type: 'file', path: 'todo-app/src/vite-env.d.ts' }
                    ]
                },
                { name: '.gitignore', type: 'file', path: 'todo-app/.gitignore' },
                { name: 'package.json', type: 'file', path: 'todo-app/package.json' },
                { name: 'package-lock.json', type: 'file', path: 'todo-app/package-lock.json' },
                { name: 'README.md', type: 'file', path: 'todo-app/README.md' },
                { name: 'tailwind.config.js', type: 'file', path: 'todo-app/tailwind.config.js' },
                { name: 'tsconfig.json', type: 'file', path: 'todo-app/tsconfig.json' },
                { name: 'vite.config.ts', type: 'file', path: 'todo-app/vite.config.ts' }
            ]
        }
    ],
    setFileTree: (fileTree) => set({ fileTree }),
}));
