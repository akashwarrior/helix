import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const skip = parseInt(req.nextUrl.searchParams.get('skip') || "0", 10);

    const chats = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
      skip: skip,
      take: 15,
    });

    return Response.json(chats, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    const chat = await prisma.project.create({
      data: {
        name: "New Chat" + Date.now(),
        messages: {
          create: {
            role: "user",
            content,
          },
        },
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    return Response.json({ chatId: chat.id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}