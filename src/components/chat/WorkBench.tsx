"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { useToggleChat } from "@/store/toggleChat";
import { useHeaderOption } from "@/store/headerOptions";
import Preview from "@/components/chat/Preview";
import FileExplorer from "@/components/chat/fileSystem/FileExplorer";
import { Button } from "../ui/button";
import { useSandboxStore } from "@/store/sandbox";
import { AnimatedBackground } from "../ui/animated-background";
import { CommandsLogs } from "../commands-logs/commands-logs";
import {
  Globe,
  Code2,
  XIcon,
  TerminalIcon,
  ChevronsLeftIcon,
  ExternalLinkIcon,
} from "lucide-react";

const views = [
  {
    label: 'Preview',
    icon: <Globe size={16} />,
  },
  {
    label: 'Editor',
    icon: <Code2 size={16} />,
  }
]

export default function WorkBench() {
  const { isChatOpen, toggleChat } = useToggleChat();
  const { activeView, setActiveView } = useHeaderOption();
  const [inputValue, setInputValue] = useState('');
  const [isCommandsLogsOpen, setIsCommandsLogsOpen] = useState(false);
  const url = useSandboxStore(state => state.url);

  const toggleCommandsLogs = () => setIsCommandsLogsOpen(!isCommandsLogsOpen);

  if (!activeView) return null;

  return (
    <motion.section
      initial={{ width: 0 }}
      animate={{ width: isChatOpen ? "70%" : "100%" }}
      transition={{ duration: 0.25, ease: "anticipate" }}
      className="flex m-1.5 rounded-lg bg-card overflow-hidden flex-col relative"
    >

      <nav className="relative h-12 flex items-center justify-start px-2 border-b gap-2 border">
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-muted-foreground hover:text-foreground/85 active:border-none"
          onClick={toggleChat}
        >
          <ChevronsLeftIcon size={16} className={cn("transition-transform duration-200", isChatOpen ? "rotate-0" : "rotate-180")} />
        </Button>

        <div className="h-1/2 border-l border-l-foreground/40 opacity-50 mr-2" />

        <div className='rounded-lg bg-accent p-[1px] border border-border/50 gap-0.5 flex'>
          <AnimatedBackground
            defaultValue={activeView}
            onValueChange={(id) => setActiveView(id as "Preview" | "Editor")}
            className='rounded-lg bg-background'
            transition={{
              ease: 'easeInOut',
              duration: 0.2,
            }}
          >
            {views.map(({ label, icon }, index) => (
              <Button
                size="icon"
                variant="ghost"
                key={index}
                data-id={label}
                className="size-7"
              >
                {icon}
              </Button>
            ))}
          </AnimatedBackground>
        </div>

        {activeView === "Preview" &&
          <div className="mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-card rounded-lg pl-3 pr-1.5 py-1 min-w-[200px] w-fit border border-neutral-700/50">
            <Globe size={20} className="text-blue-400" />
            <input
              type="text"
              className="text-xs h-6 font-mono border-none outline-none w-full overflow-hidden"
              defaultValue={'/'}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                  setInputValue(event.currentTarget.value)
                }
              }}
              disabled={!url}
            />

            <a
              href={url && (url + inputValue)}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in New Tab"
            >
              <Button
                size="icon"
                variant="ghost"
                className="size-6 text-muted-foreground hover:text-foreground/85"
              >
                <ExternalLinkIcon size={12} />
              </Button>
            </a>
          </div>
        }

        <Button
          size="icon"
          variant={isCommandsLogsOpen ? "outline" : "ghost"}
          className={cn("size-8 text-muted-foreground hover:text-foreground/85 active:border-none ml-auto",
          )}
          onClick={toggleCommandsLogs}
        >
          <TerminalIcon size={16} />
        </Button>
      </nav>

      <div
        className={cn(
          "flex-1 overflow-hidden",
          activeView !== "Preview" && "hidden",
        )}
      >
        <Preview url={url ? url + '/' + inputValue : ''} />
      </div>

      <div
        className={cn("flex-1 overflow-hidden",
          activeView !== "Editor" && "hidden",
        )}>
        <FileExplorer />
      </div>

      {isCommandsLogsOpen && (
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-card overflow-y-auto">
          <div className="p-3 border-b border-border/50 flex items-center justify-between top-0 sticky bg-card">
            <h2 className="text-sm font-medium">Console</h2>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground hover:text-foreground/85 active:border-none"
              onClick={toggleCommandsLogs}
            >
              <XIcon size={16} />
            </Button>
          </div>
          <CommandsLogs />
        </div>
      )}
    </motion.section>
  );
}
