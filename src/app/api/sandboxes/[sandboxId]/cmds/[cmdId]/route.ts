import { NextResponse, type NextRequest } from 'next/server'
import { getSandbox } from '@/lib/sandbox'

interface Params {
  sandboxId: string
  cmdId: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const cmdParams = await params
  const sandbox = await getSandbox(cmdParams.sandboxId)
  const command = await sandbox.getCommand(cmdParams.cmdId)

  /**
   * The wait can get to fail when the Sandbox is stopped but the command
   * was still running. In such case we return empty for finish data.
   */
  const done = await command.wait().catch(() => null)
  return NextResponse.json({
    cmdId: command.cmdId,
    exitCode: done?.exitCode,
  })
}
