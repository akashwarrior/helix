'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useWebContainer } from '@/hook/useWebContainer';
import CodeEditor from '@/components/chat/CodeEditor';
import Terminal from '@/components/chat/Terminal';
import Preview from '@/components/chat/Preview';
import FileTree from '@/components/chat/fileSystem/FileTree';
import { useShowWorkBenchStore } from '@/store/showWorkBenchStore';

import {
    Code2,
    Terminal as TerminalIcon,
    Folder,
    Download,
    ExternalLink,
    PanelLeftOpen,
} from 'lucide-react';


interface Tab {
    name: 'Preview' | 'Editor' | 'Terminal';
    icon: React.ReactNode;
}

const tabs: Tab[] = [
    {
        name: 'Preview',
        icon: <Folder size={16} />,
    },
    {
        name: 'Editor',
        icon: <Code2 size={16} />,
    },
    {
        name: 'Terminal',
        icon: <TerminalIcon size={16} />,
    },
];

export default function ChatPageContainer() {
    const setShowWorkBench = useShowWorkBenchStore(state => state.setShowWorkBench);
    const { webContainer } = useWebContainer();
    const [activeView, setActiveView] = useState<Tab['name']>('Preview');

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-14 bg-card/70 backdrop-blur-xl flex items-center justify-between px-3">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowWorkBench(false)}
                        className="h-9 w-9"
                        title="Hide Workbench"
                    >
                        <PanelLeftOpen size={16} />
                    </Button>

                    <nav className="flex items-center bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.name}
                                size="sm"
                                variant={activeView === tab.name ? "default" : "ghost"}
                                onClick={() => setActiveView(tab.name)}
                                className={cn(
                                    'px-3 py-2 text-sm font-medium transition-all flex items-center gap-2',
                                    activeView === tab.name ? 'bg-background/70 shadow-sm text-foreground hover:bg-background/40'
                                        : 'text-muted-foreground hover:text-foreground'
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
                {activeView === 'Editor' && <FileTree webContainer={webContainer} />}

                <section className="flex-1 bg-background flex flex-col overflow-hidden">
                    {activeView === 'Preview' && <Preview />}
                    {activeView === 'Editor' && <CodeEditor webContainer={webContainer} />}
                    <div className={cn('flex-1 overflow-hidden flex',
                        activeView !== 'Terminal' && "hidden",
                    )}>
                        {webContainer && <Terminal webContainer={webContainer} />}
                    </div>
                </section>
            </main>
        </div >
    )
}