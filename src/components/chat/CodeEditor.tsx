'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChevronRight, FileCode, Bug, Zap } from 'lucide-react';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
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

const themes = ['dark-plus'];
const languages = ['tsx', 'jsx', 'css', 'html', 'json', 'ts', 'js', 'toml', 'md'];

export default function CodeEditor() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [code, setCode] = useState(tabs[activeTabIndex].content);

  const activeTab = tabs[activeTabIndex];
  const lineCount = code.split('\n').length;

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setCode(tabs[index].content);
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'tsx':
        return <FileCode size={14} className="text-blue-400" />;
      case 'typescript':
        return <FileCode size={14} className="text-blue-300" />;
      case 'css':
        return <FileCode size={14} className="text-purple-400" />;
      case 'javascript':
      case 'jsx':
        return <FileCode size={14} className="text-yellow-400" />;
      default:
        return <FileCode size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-11 bg-neutral-900 border-b border-neutral-700/50 flex items-center">
        {tabs.map((tab, index) => (
          <button
            key={tab.path}
            onClick={() => handleTabChange(index)}
            className={`
                flex items-center gap-2 px-4 py-2 text-sm border-r border-neutral-700/40 transition-all duration-200 group
                ${activeTabIndex !== index
                ? 'bg-background text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
              }
              `}
          >
            {getLanguageIcon(tab.language)}
            <span>{tab.name}</span>
            {tab.modified && (
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 bg-neutral-900/40 flex items-center gap-1 text-xs">
        {activeTab.path.split('/').map((part, index, array) => (
          index < array.length - 1 ? (
            <span key={index} className='flex items-center gap-1'>
              <span className="text-muted hover:text-white">{part}</span>
              <ChevronRight size={14} className="text-neutral-600" />
            </span>
          ) : (
            <span key={index} className="text-white font-medium">{part}</span>
          )
        ))}
      </div>

      <div className="flex-1 relative">
        <Editor
          value={code}
          language={activeTab.language}
          theme="dark-plus"
          beforeMount={async (monaco) => {
            try {
              const highlighter = createHighlighter({
                themes,
                langs: languages,
              });

              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                skipLibCheck: true,
              });

              languages.forEach((lang) => monaco.languages.register({ id: lang }));
              shikiToMonaco((await highlighter), monaco);
            } catch (error) {
              console.error('Failed to setup Monaco editor:', error);
            }
          }}
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineHeight: 20,
            minimap: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            quickSuggestionsDelay: 250,
            autoClosingBrackets: 'always',
            autoIndent: 'full',
            padding: { top: 4, bottom: 4 }
          }}
        />
      </div>

      <div className="h-7 bg-neutral-900 flex items-center justify-between px-4 text-xs text-white border-t border-neutral-700/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="font-medium">{activeTab.language.toUpperCase()}</span>
          </div>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Spaces: 2</span>
          <div className="flex items-center gap-1">
            <Bug size={12} className="text-green-400" />
            <span>0 errors</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span>Ln {lineCount}, Col 1</span>
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" />
            <span>{activeTab.language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 