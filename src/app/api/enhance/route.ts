import { NextRequest } from "next/server";
import { smoothStream, streamText } from "ai";
import { model } from "@/lib/server/model";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { message: "Invalid request: messages are required" },
        { status: 400 },
      );
    }

    const result = streamText({
      model,
      experimental_continueSteps: true,
      prompt: `You are an expert prompt enhancer. Your job is to take a user's request and make it crystal clear, specific, and actionable while preserving their original intent.

                RULES:
                - Output ONLY the enhanced prompt as plain text
                - NO formatting, NO markdown, NO line breaks, NO special characters
                - Make the request more specific and detailed
                - Add context where needed to clarify ambiguous requests
                - Keep the same goal but make it easier to understand and execute
                - If the request is about building something, specify what type of application/feature
                - If the request is vague, add reasonable assumptions about what they likely want

                EXAMPLES:
                Input: "make a todo app"
                Output: Create a modern todo application with the ability to add new tasks, mark tasks as completed, delete tasks, and filter between all tasks, active tasks, and completed tasks using React and a clean user interface

                Input: "help me with authentication"
                Output: Create a complete user authentication system with login and registration forms, password validation, user session management, and protected routes for a web application

                Input: "build a dashboard"
                Output: Create an analytics dashboard with data visualization charts, key performance indicators, user statistics, and responsive design that displays business metrics in an organized layout

                Now enhance this user request:
                ${messages[messages.length - 1].content}`,

      experimental_transform: [
        smoothStream({
          chunking: "word",
        }),
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Enhance API Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
