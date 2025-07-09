import { NextRequest } from "next/server";
import { smoothStream, streamText } from "ai";
import { google } from '@ai-sdk/google';
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json({ message: 'Invalid request: messages are required' }, { status: 400 });
        }

        const result = streamText({
            model: google('gemma-3-27b-it'),
            experimental_continueSteps: true,
            prompt: `I want you to improve the user prompt that is wrapped in <original_prompt> tags.
            Understand the user's intent and improve the prompt to be more specific and clear.
            
            IMPORTANT: Only respond with the improved prompt in plain text and don't include any other text or markdown!
            
            <original_prompt>
            ${messages[messages.length - 1].content}
            </original_prompt>
            `,
            experimental_transform: [smoothStream({
                chunking: 'word',
            })],
            onFinish: (response) => {
                console.log(response.response.messages[0].content);
            }
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Enhance API Error:', error);
        return Response.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}