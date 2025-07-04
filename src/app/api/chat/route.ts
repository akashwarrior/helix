import { streamText } from "ai";
import { model } from "@/lib/model";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const maxDuration = 300; // 5 minutes (max duration for free plan)

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { messages, chatId } = await req.json();

        if (!chatId) {
            const chat = await prisma.project.create({
                data: {
                    name: "New Chat",
                    messages: {
                        create: {
                            role: 'USER',
                            content: messages[0].content,
                        }
                    },
                    userId: session.user.id
                }
            });

            return Response.json({ chatId: chat.id }, { status: 200 });
        }

        const result = streamText({
            model,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}