import type { InferUITools, UIMessage, UIMessageStreamWriter } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'

interface Params {
  projectId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export function tools({ writer, projectId }: Params) {
  return {
    createSandbox: createSandbox({ writer, projectId }),
    generateFiles: generateFiles({ writer, projectId }),
    getSandboxURL: getSandboxURL({ writer }),
    runCommand: runCommand({ writer }),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
