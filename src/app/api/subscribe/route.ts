import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.waitlist.findFirst({
      where: {
        email: email.toLowerCase()
      }
    });

    if (subscriber) {
      return NextResponse.json(
        { message: "You're already on our waitlist!" },
        { status: 200 }
      );
    }

    await prisma.waitlist.create({
      data: {
        email: email.toLowerCase()
      }
    });

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist!",
        email: email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
