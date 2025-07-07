'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileCode } from 'lucide-react';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { useTheme } from 'next-themes';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Tab {
  name: string;
  content: string;
  language: string;
  path: string;
  modified?: boolean;
}

const tabs: Tab[] = [
  {
    name: 'App.tsx',
    path: 'todo-app/src/App.tsx',
    language: 'tsx',
    modified: true,
    content: `import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo("");
    }
  };

  const handleRemove = (idx: number) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
        
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <input
            className="border border-gray-400 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button
            type="submit"
            className="px-3 py-2 w-64 bg-black text-white rounded"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos yet.</p>
        ) : (
          todos.map((todo, idx) => (
            <div key={todo.id} className="flex items-center justify-between p-2 border-b">
              <span>{todo.text}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;`
  },
  {
    name: 'types.ts',
    path: 'todo-app/src/types.ts',
    language: 'typescript',
    content: `export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const TODO_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export type TodoStatus = typeof TODO_STATUSES[keyof typeof TODO_STATUSES];`
  },
  {
    name: 'index.css',
    path: 'todo-app/src/index.css',
    language: 'css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.todo-item {
  @apply flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50;
}

.todo-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .todo-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}`
  }
];

const themes = ['dark-plus', 'light-plus'];
const languages = ['tsx', 'jsx', 'css', 'html', 'json', 'ts', 'js', 'toml', 'md'];

export default function CodeEditor() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [code, setCode] = useState(tabs[activeTabIndex].content);
  const { theme } = useTheme()

  const activeTheme = theme === 'light' ? themes[1] : themes[0];
  const activeTab = tabs[activeTabIndex];

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setCode(tabs[index].content);
  };

  const getLanguageIcon = (language: string) => {
    const iconProps = { size: 14 };
    switch (language) {
      case 'tsx':
        return <FileCode {...iconProps} className="text-blue-400" />;
      case 'typescript':
        return <FileCode {...iconProps} className="text-blue-300" />;
      case 'css':
        return <FileCode {...iconProps} className="text-purple-400" />;
      case 'javascript':
      case 'jsx':
        return <FileCode {...iconProps} className="text-yellow-400" />;
      default:
        return <FileCode {...iconProps} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border/50 rounded-lg overflow-hidden">
      <div className="bg-card border-b border-border/50 overflow-x-auto">
        <div className="flex">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.path}
              onClick={() => handleTabChange(index)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm border-r border-border/30",
                "transition-all duration-200 group min-w-0 flex-shrink-0",
                activeTabIndex === index
                  ? 'bg-muted/50 text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {getLanguageIcon(tab.language)}
              <span className="truncate max-w-[100px]">{tab.name}</span>
              {tab.modified && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-orange-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="px-4 py-2 bg-muted/20 border-b border-border/30 flex items-center gap-1 text-xs"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {activeTab.path.split('/').map((part, index, array) => (
          <motion.span
            key={index}
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            {index < array.length - 1 ? (
              <>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {part}
                </span>
                <ChevronRight size={12} className="text-muted-foreground/50" />
              </>
            ) : (
              <span className="text-foreground font-medium">{part}</span>
            )}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Editor
          value={code}
          language={activeTab.language}
          theme={activeTheme}
          beforeMount={async (monaco) => {
            try {
              const highlighter = await createHighlighter({
                themes,
                langs: languages,
              });

              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                skipLibCheck: true,
              });
              languages.forEach((lang) => monaco.languages.register({ id: lang }));
              shikiToMonaco(highlighter, monaco);
              monaco.editor.setTheme(activeTheme)
            } catch (error) {
              console.error('Failed to setup Monaco editor:', error);
            }
          }}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineHeight: 22,
            minimap: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            quickSuggestionsDelay: 250,
            autoClosingBrackets: 'always',
            autoIndent: 'full',
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            automaticLayout: true
          }}
        />
      </motion.div>
    </div>
  );
} 