import { Suspense } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatProvider } from "@/context/chat-context";
import { ChatHeader } from "@/components/chat/chat-header";
import { WorkBench } from "./workbench";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ chatId: string }>;
}>) {
  const { chatId } = await params;

  return (
    <ChatProvider chatId={chatId}>
      <div className="flex h-screen overflow-hidden flex-col relative">
        <ChatHeader />

        <main className="flex-1 flex overflow-hidden w-full z-10">
          <div className="overflow-hidden h-full flex flex-col flex-1">
            <div className="flex-1 flex overflow-hidden">
              <Suspense>{children}</Suspense>
            </div>
            <ChatInput chatId={chatId} />
          </div>

          <Suspense>
            <WorkBench chatId={chatId} />
          </Suspense>
        </main>
      </div>
    </ChatProvider>
  );
}
