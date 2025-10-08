import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import Chat from "@/components/chat/Chat";
import WorkBench from "@/components/chat/WorkBench";
import prisma from "@/lib/db";
import { CommandLogsStream } from "@/components/commands-logs/commands-logs-stream";
import { SandboxState } from "@/components/modals/sandbox-state";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id')!;

  const { chatId } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: chatId,
      userId: userId,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col relative">
      <ChatHeader title={project.name} />

      <main className="flex-1 flex overflow-hidden w-full z-10">
        <Chat chatId={chatId} />

        <WorkBench />

        <CommandLogsStream />
        <SandboxState />
      </main>
    </div>
  );
}
