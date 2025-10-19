import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Chat from "@/components/chat/Chat";
import prisma from "@/lib/db";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const [headersList, { chatId }] = await Promise.all([headers(), params])
  const userId = headersList.get('x-user-id')!;

  const project = await prisma.project.findUnique({
    where: {
      id: chatId,
      userId: userId,
    },
    select: {
      name: true,
      messages: true,
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <Chat
      chatId={chatId}
      title={project.name}
      initialMessages={project.messages}
    />
  );
}
