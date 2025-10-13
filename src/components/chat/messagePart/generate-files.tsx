import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, CloudUploadIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

interface Props {
  message: DataPart['generating-files']
}

export function GenerateFiles({ message }: Props) {
  const { status, paths } = message;
  const lastInProgress = ['error', 'generating'].includes(status)
  const generated = lastInProgress ? paths.slice(0, paths.length - 1) : paths
  const generating = lastInProgress && paths[paths.length - 1];

  return (
    <ToolMessage>
      <ToolHeader title={status === 'done' ? 'Uploaded files' : 'Generating files'}
        icon={
          <CloudUploadIcon className="w-3.5 h-3.5" />
        }
      />

      <div className="text-sm relative min-h-5">
        {generated.map((path) => (
          <div className="flex items-center" key={'gen' + path}>
            <CheckIcon className="w-4 h-4 mx-1" />
            <span className="whitespace-pre-wrap">
              {path}
            </span>
          </div>
        ))}

        {generating && (
          <div className="flex">
            <Spinner
              className="mr-1"
              loading={status !== 'error'}
            >
              {status === 'error' ? (
                <XIcon className="size-4 text-red-700" />
              ) : (
                <CheckIcon className="size-4" />
              )}
            </Spinner>
            <span>{generating}</span>
          </div>
        )}
      </div>
    </ToolMessage>
  )
}
