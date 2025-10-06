'use client'

import { Button } from '@/components/ui/button'
import { useSandboxStore } from '@/store/sandbox'
import { useEffect } from 'react'
import useSWR from 'swr'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function SandboxState() {
  const { sandboxId, status, setStatus } = useSandboxStore()
  if (status === 'stopped') {
    return (
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              Sandbox max duration reached
            </DialogTitle>
          </DialogHeader>
          The Vercel Sandbox is already stopped. You can re-start session
          by clicking the button below.
          <Button onClick={() => window.location.reload()}>
            Restart session
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return sandboxId ? (
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

  useEffect(() => {
    if (content.data === 'stopped') {
      setStatus('stopped')
    }
  }, [setStatus, content.data])

  return null
}
