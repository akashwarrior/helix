'use client'

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useWebContainer } from "@/hook/useWebContainer";
import { useRouter } from "next/navigation";
import { useHeaderOptionStore } from "@/store/headerOption";
import { useShowChatStore } from "@/store/showChatStore";
import { cn } from "@/lib/utils";
import {
    Code2,
    Folder,
    Download,
    Terminal,
    Loader2,
    PanelLeft,
    ArrowLeft,
    ExternalLink,
    PanelRight,
} from "lucide-react";
import { useEffect } from "react";


interface Tab {
    name: "Preview" | "Editor" | "Terminal";
    icon: React.ReactNode;
}

const tabs: Tab[] = [
    {
        name: "Preview",
        icon: <Folder size={16} />,
    },
    {
        name: "Editor",
        icon: <Code2 size={16} />,
    },
    {
        name: "Terminal",
        icon: <Terminal size={16} />,
    },
];

export default function ChatHeader({ title }: { title: string }) {
    const router = useRouter();
    const { isReady } = useWebContainer();
    const { activeView, setActiveView } = useHeaderOptionStore();
    const { isChatOpen, toggleChat } = useShowChatStore();

    useEffect(() => {
        if (isReady) {
            setActiveView("Preview");
        } else {
            setActiveView(null);
        }
    }, [isReady])

    return (
        <header className="h-14 flex items-center px-3">
            <div className="flex items-center gap-2 flex-1">
                <Button size="icon" variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={18} />
                </Button>

                <h1 className="font-medium truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {title}
                </h1>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className={cn(
                        "h-9 w-9",
                        isChatOpen ? "ml-auto" : "ml-2"
                    )}
                    title={isChatOpen ? "Hide Chat" : "Show Chat"}
                >
                    {!isReady ? <Loader2 size={16} className="animate-spin" /> :
                        isChatOpen ? <PanelLeft size={16} /> : <PanelRight size={16} />
                    }
                </Button>
            </div>

            <nav className={cn(
                "flex items-center p-1 ml-auto max-w-[70%] justify-between",
                isReady ? "w-full" : ""
            )}>
                <div className="flex items-center gap-2 bg-secondary/60 rounded-lg p-1">
                    {isReady && tabs.map((tab) => (
                        <Button
                            key={tab.name}
                            size="sm"
                            variant={activeView === tab.name ? "default" : "ghost"}
                            onClick={() => setActiveView(tab.name)}
                            className={cn(
                                "px-3 py-2 text-sm font-medium transition-all flex items-center gap-2",
                                activeView === tab.name
                                    ? "bg-secondary/80 shadow-sm text-foreground hover:bg-secondary/80"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.name}</span>
                        </Button>
                    ))}
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
                        className="gap-2"
                        variant="outline"
                    >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Deploy</span>
                    </Button>
                </div>
            </nav>
        </header>
    )
}