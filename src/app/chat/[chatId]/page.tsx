import { headers } from "next/headers";
import Chat from "@/components/chat/Chat";
import prisma from "@/lib/db";
import { createS3Client } from "@/lib/s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { Message } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const [headersList, { chatId }] = await Promise.all([headers(), params])
  const userId = headersList.get('x-user-id')!;

  const files: string[] = [];
  let messages: Message[] = [];
  let projectName: string | null = null;

  const client = createS3Client();
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: chatId,
  });

  try {
    const [project, data] = await Promise.allSettled([prisma.project.findUnique({
      where: {
        id: chatId,
        userId: userId,
      },
      select: {
        name: true,
        messages: true,
      }
    }), client.send(listObjectsCommand)]);

    if (project.status === 'fulfilled') {
      if (!project.value) {
        throw new Error('Project not found');
      }
      projectName = project.value?.name ?? null;
      messages = project.value?.messages ?? [];
    }

    if (data.status === 'fulfilled') {
      data.value.Contents?.forEach((content) => {
        if (content.Key) {
          files.push(content.Key);
        }
      });
    }
  } catch {
    notFound();
  }

  return (
    <Chat
      chatId={chatId}
      title={projectName}
      initialMessages={messages}
      files={files}
    />
  );
}
