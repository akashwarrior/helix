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

  let messages: any = [{
    id: crypto.randomUUID(),
    role: 'assistant',
    parts: [{ type: 'data-generating-files', data: { status: 'generating', paths: ['package.json'] } }],
  }]

  messages = project.messages;

  return (
    <Chat
      chatId={chatId}
      initialMessages={messages}
    />
  );
}
