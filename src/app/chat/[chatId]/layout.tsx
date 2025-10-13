import ChatHeader from "@/components/chat/ChatHeader";
import WorkBench from "@/components/chat/WorkBench";
import { CommandLogsStream } from "@/components/commands-logs/commands-logs-stream";
import { SandboxState } from "@/components/modals/sandbox-state";
import { Suspense } from "react";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen overflow-hidden flex-col relative">
            <ChatHeader />

            <main className="flex-1 flex overflow-hidden w-full z-10">
                <Suspense>
                    {children}
                </Suspense>

                <WorkBench />
                <CommandLogsStream />
                <SandboxState />
            </main>
        </div>
    );
}