"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useToggleChat } from "@/store/toggleChat";
import { useHeaderOption } from "@/store/headerOption";
import Preview from "@/components/chat/Preview";
import FileExplorer from "@/components/chat/fileSystem/FileExplorer";
import { CommandsLogs } from "../commands-logs/commands-logs";

export default function WorkBench() {
  const isChatOpen = useToggleChat((state) => state.isChatOpen);
  const activeView = useHeaderOption((state) => state.activeView);

  return activeView && (
    <motion.section
      initial={{ width: 0 }}
      animate={{ width: isChatOpen ? "70%" : "100%" }}
      transition={{ duration: 0.25, ease: "anticipate" }}
      className="flex m-1.5 rounded-lg bg-secondary/70 overflow-hidden"
    >
      <div
        className={cn(
          "flex-1 overflow-hidden",
          activeView !== "Preview" && "hidden",
        )}
      >
        <Preview />
      </div>

      <div
        className={cn("flex flex-1 overflow-hidden",
          activeView !== "Editor" && "hidden",
        )}>
        <FileExplorer />
      </div>

      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden",
          activeView !== "Terminal" && "hidden",
        )}
      >
        <CommandsLogs />
      </div>
    </motion.section>
  );
}
