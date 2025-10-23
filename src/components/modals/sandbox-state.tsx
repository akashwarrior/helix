'use client'

import { useSandboxStore } from '@/store/sandbox'
import { useEffect } from 'react';

export function SandboxState() {
  const { sandboxId, setSandboxId } = useSandboxStore();

  useEffect(() => {
    if (!sandboxId) return;

    const revalidate = async () => {
      const res = await fetch(`/api/sandboxes/${sandboxId}`)
      const { status } = await res.json();

      if (status === "stopping" || status === "stopped" || status === "failed") {
        setSandboxId(undefined);
      }
    }

    const timeout = setTimeout(revalidate, 2000);

    return () => {
      clearTimeout(timeout)
    }
  }, [sandboxId])

  return null
}