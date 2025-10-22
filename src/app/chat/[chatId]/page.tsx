import { headers } from "next/headers";
import Chat from "@/components/chat/Chat";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { getFilesFromS3 } from "@/lib/s3";
import type { File } from "@/lib/types";

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
    return notFound();
  }

  let files: File[] = [];

  try {
    files = await getFilesFromS3(chatId);
  } catch {
    console.log("Bucket not found");
  }

  return (
    <Chat
      chatId={chatId}
      title={project.name}
      initialMessages={project.messages}
      files={files}
    />
  );
}
