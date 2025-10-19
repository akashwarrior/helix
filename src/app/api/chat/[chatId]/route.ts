import type { NextRequest } from "next/server";
import { ChatUIMessage } from "@/lib/types";
import { tools } from "@/ai/tools";
import { getModelOptions } from "@/ai/config";
import prompt from "./prompt.md";
import prisma from '@/lib/db'
import { Role } from "@/generated/prisma/enums";
import type { MessageCreateManyInput } from "@/generated/prisma/models";
import z from "zod/v4";

import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
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
      execute: async ({ writer }) => {
        // generate project name
        let nameResult: Promise<void> | null = null;
        if (messages.length === 1) {
          nameResult = generateObject({
            system: 'You are a conversation/chat session name generator. You must generate a name for the conversation/chat session based on the user prompt. try to make it as short as possible.',
            ...getModelOptions(modelId),
            messages: convertToModelMessages(messages),
            schema: z.object({
              name: z.string().describe('The name of the conversation/chat session'),
            }),
          }).then(async (result) => {
            const name = result.object?.name ?? 'untitled';
            writer.write({
              type: 'data-project-name',
              data: { name: name },
            })
            prisma.project.update({
              where: { id: chatId },
              data: { name: name }
            }).catch((error) => {
              console.error('Failed updating project name', error);
            });
          })
        }

        // stream text
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
        // waiting for project name to be generated before stream ends
        await nameResult;
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
            const lastMessage = messages[messages.length - 1];
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
