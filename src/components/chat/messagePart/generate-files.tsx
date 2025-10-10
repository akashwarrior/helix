import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, CloudUploadIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import { TextEffect } from '@/components/ui/text-effect'

export function GenerateFiles({ message }: { message: DataPart['generating-files'] }) {
  const lastInProgress = ['error', 'uploading', 'generating'].includes(
    message.status
  )

  const generated = lastInProgress
    ? message.paths.slice(0, message.paths.length - 1)
    : message.paths

  const generating = lastInProgress
    ? message.paths[message.paths.length - 1] ?? ''
    : null

  return (
    <ToolMessage>
      <ToolHeader title={message.status === 'done' ? 'Uploaded files' : 'Generating files'}
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
        {typeof generating === 'string' && (
          <div className="flex">
            <Spinner
              className="mr-1"
              loading={message.status !== 'error'}
            >
              {message.status === 'error' ? (
                <XIcon className="w-4 h-4 text-red-700" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
            </Spinner>
            <span>{generating}</span>
          </div>
        )}
      </div>
    </ToolMessage>
  )
}
