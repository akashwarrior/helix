import { type NextRequest, NextResponse } from "next/server"
import { getSandboxId, getSandboxUrl } from "@/ai/config"

export async function POST(request: NextRequest) {
    const { projectId } = await request.json() as { projectId: string };
    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    try {
        const sandboxId = await getSandboxId(projectId);
        const url = await getSandboxUrl(sandboxId);

        return NextResponse.json({
            sandboxId,
            url,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create sandbox' }, { status: 500 });
    }
}