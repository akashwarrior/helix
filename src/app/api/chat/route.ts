import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')!;
    const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0", 10);
    const take = parseInt(req.nextUrl.searchParams.get("take") || "15", 10);

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
      take: take,
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
    const { prompt } = await req.json() as { prompt: string };
    const { id } = await prisma.project.create({
      data: {
        userId: userId,
        messages: {
          create: [{
            id: crypto.randomUUID(),
            role: "user",
            parts: [{ type: "text", text: prompt }],
          }]
        }
      },
      select: {
        id: true,
      },
    });

    return Response.json({ chatId: id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
