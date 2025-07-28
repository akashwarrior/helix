"use client";

import { cn } from "@/lib/utils";
import CodeEditor from "@/components/chat/CodeEditor";
import Terminal from "@/components/chat/Terminal";
import Preview from "@/components/chat/Preview";
import FileTree from "@/components/chat/fileSystem/FileTree";
import { useShowChatStore } from "@/store/showChatStore";
import { useHeaderOptionStore } from "@/store/headerOption";

export default function WorkBench() {
  const isChatOpen = useShowChatStore(state => state.isChatOpen);
  const activeView = useHeaderOptionStore(state => state.activeView);

  return (
    <div className={cn(
      "flex flex-col overflow-hidden w-0 transition-all duration-150",
      activeView && (!isChatOpen ? "w-full" : "w-[70%]"),
    )}>
      <section className="flex-1 flex overflow-hidden min-h-0 m-1.5 rounded-lg bg-secondary/70">
        {activeView === "Editor" && <FileTree />}

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeView === "Preview" && <Preview />}
          {activeView === "Editor" && <CodeEditor />}
          <div
            className={cn(
              "flex-1 overflow-hidden flex",
              activeView !== "Terminal" && "hidden",
            )}
          >
            <Terminal />
          </div>
        </div>
      </section>
    </div>
  );
}
