import type { DataPart } from '@/ai/messages/data-parts'
import type { DataUIPart } from 'ai'
import { create } from 'zustand'
import { useCommandStore } from './command'

interface SandboxStore {
  addPaths: (paths: string[]) => void
  paths: string[]
  sandboxId?: string
  setSandboxId: (id: string) => void
  setStatus: (status: 'running' | 'stopped') => void
  setUrl: (url: string) => void
  status?: 'running' | 'stopped'
  url?: string
}

export const useSandboxStore = create<SandboxStore>()((set) => ({
  sandboxId: undefined,
  status: undefined,
  url: undefined,
  paths: [],
  addPaths: (paths) =>
    set((state) => ({ paths: [...new Set([...state.paths, ...paths])] })),
  setSandboxId: (sandboxId) =>
    set(() => ({
      sandboxId,
      status: 'running',
      url: undefined,
    })),
  setStatus: (status) => set(() => ({ status })),
  setUrl: (url) => set(() => ({ url })),
}))

export function useDataStateMapper() {
  const { addPaths, setSandboxId, setUrl } = useSandboxStore()
  const upsertCommand = useCommandStore(state => state.upsertCommand)

  return (data: DataUIPart<DataPart>) => {
    switch (data.type) {
      case 'data-create-sandbox':
        if (data.data.sandboxId) {
          setSandboxId(data.data.sandboxId)
        }
        break
      case 'data-generating-files':
        if (data.data.status === 'done') {
          addPaths(data.data.paths)
        }
        break
      case 'data-run-command':
        if (
          data.data.commandId &&
          (data.data.status === 'executing' || data.data.status === 'running')
        ) {
          upsertCommand({
            background: data.data.status === 'running',
            sandboxId: data.data.sandboxId,
            cmdId: data.data.commandId,
            command: data.data.command,
            args: data.data.args,
          })
        }
        break
      case 'data-get-sandbox-url':
        if (data.data.url) {
          setUrl(data.data.url)
        }
        break
      default:
        break
    }
  }
}
