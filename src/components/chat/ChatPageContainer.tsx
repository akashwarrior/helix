'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useIsChatOpen } from '@/store/isChatOpen';
import { useWebContainer } from '@/hook/useWebContainer';
import CodeEditor from '@/components/chat/CodeEditor';
import Terminal from '@/components/chat/Terminal';
import Preview from '@/components/chat/Preview';
import FileTree from '@/components/chat/fileSystem/FileTree';

import {
    Code2,
    Terminal as TerminalIcon,
    Folder,
    Download,
    ExternalLink,
    PanelLeftClose,
    PanelLeftOpen
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
    const { isChatOpen, setIsChatOpen } = useIsChatOpen();
    const [activeView, setActiveView] = useState<Tab['name']>('Editor');
    const { isReady, webContainer } = useWebContainer();

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    console.log(webContainer)

    if (!isReady) {
        return (
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 bg-background/80 backdrop-blur-xl flex items-center justify-between px-3">
                    <div className="flex items-center gap-4">
                        <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />

                        <nav className="flex items-center bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
                            {tabs.map((tab, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 flex items-center gap-2"
                                >
                                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                                    <div className="hidden sm:block h-4 w-12 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
                        <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
                        <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden min-h-0">
                    <section className="flex-1 bg-background flex flex-col p-6">
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="space-y-2 text-center">
                                <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto" />
                                <div className="h-4 w-64 bg-muted/70 rounded animate-pulse mx-auto" />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 bg-card/70 backdrop-blur-xl flex items-center justify-between px-3">
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
                    {activeView === 'Terminal' && <Terminal webContainer={webContainer} />}
                </section>
            </main>
        </div>
    )
}