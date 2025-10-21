'use client'

import { useSandboxStore } from '@/store/sandbox'
import useSWR from 'swr'

export function SandboxState() {
  const { sandboxId, setSandboxId } = useSandboxStore();

  return sandboxId ? (
    <DirtyChecker sandboxId={sandboxId} setSandboxId={setSandboxId} />
  ) : null
}

interface DirtyCheckerProps {
  sandboxId: string
  setSandboxId: (sandboxId: undefined) => void
}

function DirtyChecker({ sandboxId, setSandboxId }: DirtyCheckerProps) {
  const content = useSWR<'ok' | 'stopped'>(
    `/api/sandboxes/${sandboxId}`,
    async (pathname: string, init: RequestInit) => {
      const response = await fetch(pathname, init)
      const { status } = await response.json()
      return status
    },
    { refreshInterval: 1000 }
  )

  if (content.data === 'stopped') {
    setSandboxId(undefined);
  }

  return null
}
