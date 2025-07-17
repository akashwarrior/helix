import ChatInterface from "@/components/chat/ChatInterface";
import ChatPageContainer from "@/components/chat/ChatPageContainer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import type { Code, Message, Project } from "@prisma/client";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/auth');
  }

  const { chatId } = await params;

  let chat: Project & { messages: Message[], codes: Code[] } | null = null;

  try {
    chat = await prisma.project.findUnique({
      where: {
        id: chatId,
        userId: session?.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
        codes: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      }
    });
  } catch (error) {
    console.log(error);
  }

  if (!chat) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatInterface initialMessages={chat.messages} />
      <ChatPageContainer code={chat.codes} />
    </div>
  );
}