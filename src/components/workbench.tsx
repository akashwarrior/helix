"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useToggleChat } from "@/store/toggle-chat";
import { useHeaderOption } from "@/store/header-options";
import Preview from "./preview";
import FileExplorer from "./file-system/FileExplorer";
import { Button } from "./ui/button";
import { AnimatedBackground } from "./ui/animated-background";
import { CommandsLogs } from "./commands-logs/commands-logs";
import type { File } from "@/lib/types";
import { useSandboxStore } from "@/store/sandbox";
import { useFileStore } from "@/store/file";
import {
  Globe,
  Code2,
  XIcon,
  TerminalIcon,
  ChevronsLeftIcon,
} from "lucide-react";

const views = [
  {
    label: "Preview",
    icon: <Globe size={16} />,
  },
  {
    label: "Editor",
    icon: <Code2 size={16} />,
  },
];

interface WorkBenchProps {
  files: File[];
  sandboxId?: string;
  domain?: string;
}

export function WorkBench({ files, sandboxId, domain }: WorkBenchProps) {
  const { isChatOpen, toggleChat } = useToggleChat();
  const { activeView, setActiveView } = useHeaderOption();
  const [isCommandsLogsOpen, setIsCommandsLogsOpen] = useState(false);
  const setSandboxId = useSandboxStore((state) => state.setSandboxId);
  const setUrl = useSandboxStore((state) => state.setUrl);
  const setFiles = useFileStore((state) => state.setFiles);

  const toggleCommandsLogs = () => setIsCommandsLogsOpen(!isCommandsLogsOpen);

  useEffect(() => {
    if (sandboxId) {
      setSandboxId(sandboxId);
      setUrl(domain!);
      setActiveView("Preview");
    }

    setFiles(files);

    return () => {
      setSandboxId(undefined);
      setFiles([]);
    };
  }, []);

  return (
    <motion.section
      initial={{ width: 0 }}
      animate={{ width: isChatOpen ? "70%" : "100%" }}
      transition={{ duration: 0.25, ease: "anticipate" }}
      className={cn(
        "flex m-1.5 rounded-lg bg-card overflow-hidden flex-col relative",
        activeView === null && "hidden",
      )}
    >
      <nav className="relative h-12 flex items-center justify-start px-2 border-b gap-2 border">
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-muted-foreground hover:text-foreground/85 active:border-none"
          onClick={toggleChat}
        >
          <ChevronsLeftIcon
            size={16}
            className={cn(
              "transition-transform duration-200",
              isChatOpen ? "rotate-0" : "rotate-180",
            )}
          />
        </Button>

        <div className="h-1/2 border-l border-l-foreground/40 opacity-50 mr-2" />

        <div className="rounded-lg bg-accent p-px border border-border/50 gap-0.5 flex">
          <AnimatedBackground
            defaultValue={activeView ?? undefined}
            onValueChange={(id) => setActiveView(id as "Preview" | "Editor")}
            className="rounded-lg bg-background"
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
          >
            {views.map(({ label, icon }) => (
              <Button
                key={label}
                size="icon"
                variant="ghost"
                data-id={label}
                className="size-7"
              >
                {icon}
              </Button>
            ))}
          </AnimatedBackground>
        </div>

        <Button
          size="icon"
          variant={isCommandsLogsOpen ? "outline" : "ghost"}
          className={cn(
            "size-8 text-muted-foreground hover:text-foreground/85 active:border-none ml-auto",
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
        <Preview />
      </div>

      <div
        className={cn(
          "flex-1 overflow-hidden",
          activeView !== "Editor" && "hidden",
        )}
      >
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
