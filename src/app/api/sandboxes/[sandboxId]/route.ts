import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  const { sandboxId } = await params;
  try {
    const { status } = await getSandbox(sandboxId);
    return NextResponse.json({ status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sandbox status" },
      { status: 500 },
    );
  }
}
