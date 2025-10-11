'use client'

import { useSandboxStore } from '@/store/sandbox'
import useSWR from 'swr'

export function SandboxState() {
  const { status, sandboxId, setStatus } = useSandboxStore()

  return sandboxId && status === 'running' ? (
    <DirtyChecker sandboxId={sandboxId} setStatus={setStatus} />
  ) : null
}

interface DirtyCheckerProps {
  sandboxId: string
  setStatus: (status: 'running' | 'stopped') => void
}

function DirtyChecker({ sandboxId, setStatus }: DirtyCheckerProps) {
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
    setStatus('stopped')
  }

  return null
}
