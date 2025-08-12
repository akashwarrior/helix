"use client";

import { cn } from "@/lib/utils";
import CodeEditor from "@/components/chat/CodeEditor";
import Terminal from "@/components/chat/Terminal";
import Preview from "@/components/chat/Preview";
import FileTree from "@/components/chat/fileSystem/FileTree";
import { useShowChatStore } from "@/store/toggleChat";
import { useHeaderOptionStore } from "@/store/headerOption";

export default function WorkBench() {
  const isChatOpen = useShowChatStore((state) => state.isChatOpen);
  const activeView = useHeaderOptionStore((state) => state.activeView);

  return (
    <section
      className={cn(
        "flex m-1.5 rounded-lg bg-secondary/70 overflow-hidden w-0 transition-all duration-150",
        activeView && (!isChatOpen ? "w-full" : "w-[70%]"),
      )}
    >
      <div
        className={cn(
          "overflow-hidden flex",
          activeView !== "Editor" && "hidden",
        )}
      >
        <FileTree />
      </div>

      <div className="flex-1 flex overflow-hidden">
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
            "flex-1 overflow-hidden flex-col",
            activeView !== "Terminal" && "hidden",
          )}
        >
          <Terminal />
        </div>
      </div>
    </section>
  );
}
