import type { NextRequest } from "next/server";
import { ChatUIMessage } from "@/lib/types";
import { tools } from "@/ai/tools";
import { getModelOptions } from "@/ai/config";
import prompt from "./prompt.md";
import prisma from '@/lib/db'
import { Role } from "@/generated/prisma/enums";
import type { MessageCreateManyInput } from "@/generated/prisma/models";

import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'


interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
  trigger?: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const { chatId } = await params;
  if (!chatId) {
    return Response.json({ message: "Chat ID is required" }, { status: 400 });
  }

  const { messages, modelId, trigger } = await req.json() as BodyData;

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: ({ writer }) => {
        const result = streamText({
          ...getModelOptions(modelId),
          system: prompt,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(20),
          tools: tools({ modelId, writer }),
          onError: (error) => {
            console.error('Error communicating with AI');
            console.error(JSON.stringify(error, null, 2));
          },
        })
        result.consumeStream()
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            sendStart: false,
          })
        )
      },
      onFinish: async ({ responseMessage }) => {
        const parts: Record<string, any>[] = [];
        for (const part of responseMessage.parts) {
          if (
            part.type === 'reasoning' ||
            part.type === 'data-create-sandbox' ||
            part.type === 'data-generating-files' ||
            part.type === 'data-run-command' ||
            part.type === 'text'
          ) {
            parts.push(part);
          }
        }

        try {
          const isRegenerate = trigger === 'regenerate-message';
          const messagesToCreate: MessageCreateManyInput[] = [];

          if (!isRegenerate) {
            console.log('messages', messages);
            const lastMessage = messages[messages.length - 1];
            console.log('lastMessage', lastMessage);
            messagesToCreate.push({
              id: lastMessage.id,
              role: Role.user,
              parts: lastMessage.parts as Record<string, string>[],
              projectId: chatId,
            })
          }

          messagesToCreate.push({
            id: responseMessage.id,
            role: Role.assistant,
            parts: parts,
            projectId: chatId,
          })

          await prisma.message.createMany({
            data: messagesToCreate,
          })
        } catch (e) {
          console.error("Failed updating message", e)
        }
      },
    }),
  });
}
