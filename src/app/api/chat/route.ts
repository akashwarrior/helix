import { streamText, type TextPart } from "ai";
import { model } from "@/lib/server/model";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { systemPrompt } from "@/lib/server/prompt";

export const maxDuration = 300; // 5 minutes (max duration for free plan)

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messages, chatId } = await req.json();

    if (!chatId) {
      const chat = await prisma.project.create({
        data: {
          name: "New Chat",
          messages: {
            create: {
              role: "user",
              content: messages[0].content,
            },
          },
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      return Response.json({ chatId: chat.id }, { status: 200 });
    }

    const result = streamText({
      model,
      messages: [
        {
          role: "user",
          content: `
                ${systemPrompt}
                <UserMessage>
                ${messages[messages.length - 1].content}
                </UserMessage>
            `,
        },
      ],
      onFinish: async (message) => {
        const msgs: Prisma.MessageCreateManyInput[] = [];

        if (messages.length > 1) {
          msgs.push({
            content: messages[messages.length - 1].content,
            role: "user",
            projectId: chatId,
          });
        }

        msgs.push({
          content: (message.response.messages[0].content[0] as TextPart).text,
          role: "assistant",
          projectId: chatId,
        });

        await prisma.message.createMany({
          data: msgs,
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
