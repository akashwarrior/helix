import { type NextRequest, NextResponse } from "next/server"
import { createSandbox } from "@/ai/config"

export async function POST(request: NextRequest) {
    const { projectId } = await request.json() as { projectId: string };
    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    try {
        let url: string | null = null;
        const sandbox = await createSandbox(projectId);
        try {
            url = sandbox.domain(3000);
        } catch {
            url = null;
        }
        return NextResponse.json({
            sandboxId: sandbox.sandboxId,
            url,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create sandbox' }, { status: 500 });
    }
}