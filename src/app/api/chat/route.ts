import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')!;
    const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0", 10);

    const chats = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: userId,
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
    const userId = req.headers.get('x-user-id')!;
    const { content } = await req.json(); // TODO: store it in db

    const chat = await prisma.project.create({
      data: {
        name: "New Chat" + Date.now(), // TODO: get the name from ai agent 
        userId: userId,
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
