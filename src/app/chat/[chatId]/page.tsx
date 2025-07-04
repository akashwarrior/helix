'use client'

import { useState, useCallback } from 'react'
import {
  Code2,
  Terminal as TerminalIcon,
  Folder,
  Download,
  Play,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import ChatInterface from '@/components/ui/ChatInterface';
import CodeEditor from '@/components/ui/CodeEditor';
import Terminal from '@/components/ui/Terminal';
import Preview from '@/components/ui/Preview';
import FileTree from '@/components/ui/FileTree';

interface Tab {
  id: 'app' | 'editor' | 'terminal';
  name: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'app',
    name: 'Preview',
    icon: <Folder size={16} />,
  },
  {
    id: 'editor',
    name: 'Editor',
    icon: <Code2 size={16} />,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: <TerminalIcon size={16} />,
  },
];

const renderMainContent = (activeView: string) => {
  switch (activeView) {
    case 'app':
      return <Preview />;
    case 'editor':
      return <CodeEditor />;
    case 'terminal':
      return <Terminal />;
    default:
      return <CodeEditor />;
  }
};

export default function ChatPage() {
  const [activeView, setActiveView] = useState<'app' | 'editor' | 'terminal'>('editor');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tabId: 'app' | 'editor' | 'terminal') => {
    setActiveView(tabId);
  }, []);

  return (
    <div className="flex h-screen text-white overflow-hidden bg-background">
      {/* Chat Panel */}
      <div className={`${isChatOpen ? 'w-[400px]' : 'w-0'} transition-all duration-300 border-r border-neutral-800 overflow-hidden`}>
        {isChatOpen && <ChatInterface />}
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 bg-background border-b border-neutral-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleChat}
              className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
              aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
            >
              {isChatOpen ? (
                <PanelLeftClose size={16} className="text-muted-foreground" />
              ) : (
                <PanelLeftOpen size={16} className="text-muted-foreground" />
              )}
            </button>

            {/* Tab Navigation */}
            <nav className="flex items-center bg-neutral-900 rounded-md p-0.5" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 rounded-sm ${activeView === tab.id
                    ? 'text-white bg-neutral-800'
                    : 'text-muted-foreground hover:text-white hover:bg-neutral-800/50'
                    }`}
                  role="tab"
                  aria-selected={activeView === tab.id}
                  aria-label={`Switch to ${tab.name}`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
              aria-label="Run project"
            >
              <Play size={16} className="text-green-400" />
            </button>

            <button
              className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
              aria-label="Download project"
            >
              <Download size={16} className="text-muted-foreground" />
            </button>

            <button className="px-3 py-1.5 bg-accent hover:bg-accent/90 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5">
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Deploy</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex overflow-hidden min-h-0">
          {activeView === 'editor' && (
            <aside className="flex-shrink-0">
              <FileTree />
            </aside>
          )}

          <section className="flex-1 min-w-0">
            {renderMainContent(activeView)}
          </section>
        </main>
      </div>
    </div>
  );
}