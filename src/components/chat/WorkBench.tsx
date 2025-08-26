"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useToggleChat } from "@/store/toggleChat";
import { useHeaderOption } from "@/store/headerOption";
import CodeEditor from "@/components/chat/CodeEditor";
import Preview from "@/components/chat/Preview";
import FileTree from "@/components/chat/fileSystem/FileTree";
const Terminal = dynamic(() => import("@/components/chat/Terminal"), { ssr: false });

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
          "overflow-hidden flex",
          activeView !== "Editor" && "hidden",
        )}
      >
        <FileTree />
      </div>

      <div
        className={cn(
          "flex-1 overflow-hidden flex-col",
          activeView !== "Preview" && "hidden",
        )}
      >
        <Preview />
      </div>
      <div
        className={cn(
          "flex-1 overflow-hidden flex-col",
          activeView !== "Editor" && "hidden",
        )}
      >
        <CodeEditor />
      </div>
      <div
        className={cn(
          "flex-1 flex overflow-hidden flex-col",
          activeView !== "Terminal" && "hidden",
        )}
      >
        <Terminal />
      </div>
    </motion.section>
  );
}
