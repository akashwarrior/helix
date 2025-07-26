import ChatInterface from "@/components/chat/ChatInterface";
import ChatPageContainer from "@/components/chat/ChatPageContainer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
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

  const chat = await prisma.project.findUnique({
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

  if (!chat) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatInterface chatId={chatId} initialMessages={chat.messages} />
      <ChatPageContainer />
    </div>
  );
}
