import type { DataPart } from '@/ai/messages/data-parts'
import type { DataUIPart } from 'ai'
import { create } from 'zustand'
import { useCommandStore } from './command'
import { useFileStore } from './file'
import { useHeaderOption } from './headerOptions'

interface SandboxStore {
  sandboxId?: string
  setSandboxId: (id: string | undefined) => void
  setUrl: (url: string) => void
  url?: string
}

export const useSandboxStore = create<SandboxStore>()((set) => ({
  sandboxId: undefined,
  url: undefined,
  setSandboxId: (sandboxId) => set(() => ({ sandboxId, url: undefined })),
  setUrl: (url) => set(() => ({ url })),
}))

export function useDataStateMapper() {
  const setUrl = useSandboxStore(state => state.setUrl);
  const setSandboxId = useSandboxStore(state => state.setSandboxId);
  const addFiles = useFileStore(state => state.addFiles);
  const upsertCommand = useCommandStore(state => state.upsertCommand)
  const setActiveView = useHeaderOption(state => state.setActiveView);
  const setTitle = useHeaderOption(state => state.setTitle);

  return (data: DataUIPart<DataPart>) => {
    switch (data.type) {
      case 'data-project-name':
        setTitle(data.data.name);
        break;

      case 'data-generating-files':
        addFiles(data.data.files);
        if (data.data.sandboxId && data.data.url) {
          setActiveView("Preview")
          setSandboxId(data.data.sandboxId)
          setUrl(data.data.url)
        }
        break;

      case 'data-run-command':
        if (
          data.data.commandId &&
          (data.data.status === 'executing' || data.data.status === 'running')
        ) {
          upsertCommand({
            background: data.data.status === 'running',
            cmdId: data.data.commandId,
            command: data.data.command,
            args: data.data.args,
          })
        }
        break;

      default:
        break
    }
  }
}
