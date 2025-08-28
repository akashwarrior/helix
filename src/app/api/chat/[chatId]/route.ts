import type { NextRequest } from "next/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { model } from "@/lib/server/model";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { systemPrompt } from "@/lib/server/systemPrompt";
import { convertUIPartsToString } from "@/lib/server/constants";

export const maxDuration = 300; // 5 minutes (max duration for free plan)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !chatId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model,
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      onFinish: async (message) => {
        const msgs: Prisma.MessageCreateManyInput[] = [];

        if (messages.length > 1) {
          msgs.push({
            content: convertUIPartsToString(messages[messages.length - 1].parts),
            role: "user",
            projectId: chatId,
          });
        }

        msgs.push({
          content: message.text,
          role: "assistant",
          projectId: chatId,
        });

        await prisma.message.createMany({
          data: msgs,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
