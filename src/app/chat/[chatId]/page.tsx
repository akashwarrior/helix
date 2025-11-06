import { headers } from "next/headers";
import ChatMessages from "@/components/chat/chat-messages";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const [headersList, { chatId }] = await Promise.all([headers(), params]);
  const userId = headersList.get("x-user-id")!;

  const project = await prisma.project.findUnique({
    where: {
      id: chatId,
      userId: userId,
    },
    select: {
      name: true,
      messages: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <ChatMessages title={project.name} initialMessages={project.messages} />
  );
}
