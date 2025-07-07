'use client'

import { cn } from '@/lib/utils';
import { useState } from 'react'
import {
  Code2,
  Terminal as TerminalIcon,
  Folder,
  Download,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import CodeEditor from '@/components/chat/CodeEditor';
import Terminal from '@/components/chat/Terminal';
import Preview from '@/components/chat/Preview';
import FileTree from '@/components/chat/FileTree';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

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
      return null;
  }
};

export default function ChatPage() {
  const [activeView, setActiveView] = useState<'app' | 'editor' | 'terminal'>('app');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleChat = () => setIsChatOpen(prev => !prev);

  const handleTabChange = (tabId: 'app' | 'editor' | 'terminal') => setActiveView(tabId);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <motion.div
        initial={{ width: isChatOpen ? 400 : 0 }}
        animate={{ width: isChatOpen ? 400 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="border-r border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm"
      >
        {isChatOpen && <ChatInterface />}
      </motion.div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-background/80 backdrop-blur-xl flex items-center justify-between px-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-9 w-9"
              aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
            >
              {isChatOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </Button>

            <nav className="flex items-center bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={activeView === tab.id ? "default" : "ghost"}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-all flex items-center gap-2',
                    activeView === tab.id && 'bg-background shadow-sm text-foreground hover:bg-background/40',
                    activeView !== tab.id && 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.name}</span>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Download project"
            >
              <Download size={16} />
            </Button>

            <Button
              size="sm"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Deploy</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden min-h-0">
          {activeView === 'editor' && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 border-r border-border/50 bg-card/30"
            >
              <FileTree />
            </motion.aside>
          )}

          <section className="flex-1 min-w-0 bg-background">
            {renderMainContent(activeView)}
          </section>
        </main>
      </div>
    </div>
  );
}