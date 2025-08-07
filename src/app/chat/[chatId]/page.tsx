import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import WorkBench from "@/components/chat/WorkBench";
import prisma from "@/lib/db";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const { chatId } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: chatId,
      userId: session.user.id,
    },
    include: {
      messages: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          role: true,
        },
        take: 50,
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-card/50">
      <ChatHeader title={project.name} />

      <main className="flex-1 flex overflow-hidden w-full">
        <div className="overflow-hidden transition-all duration-150 h-full flex flex-col flex-1">
          <main className="flex flex-col flex-1 overflow-y-auto">
            <div className="flex-1 py-6 flex flex-col gap-6 px-2 max-w-3xl mx-auto w-full">
              <ChatMessages />
            </div>
          </main>

          <div className="p-4 max-w-3xl mx-auto w-full">
            <ChatInput chatId={chatId} initialMessages={project.messages} />
          </div>
        </div>

        <WorkBench />
      </main>
    </div>
  );
}
