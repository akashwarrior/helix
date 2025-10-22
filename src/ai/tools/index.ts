import type { InferUITools, UIMessage, UIMessageStreamWriter } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { generateFiles } from './generate-files'
import { runCommand } from './run-command'

interface Params {
  projectId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export function tools({ writer, projectId }: Params) {
  return {
    generateFiles: generateFiles({ writer, projectId }),
    runCommand: runCommand({ writer, projectId }),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
