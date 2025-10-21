import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, CloudUploadIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

interface Props {
  message: DataPart['generating-files']
}

export function GenerateFiles({ message: { files } }: Props) {
  const status = files.every((file) => file.status === 'done')
  return (
    <ToolMessage>
      <ToolHeader title={status ? 'Generated files' : 'Generating files'}
        icon={
          <CloudUploadIcon className="w-3.5 h-3.5" />
        }
      />

      <div className="text-sm relative min-h-5">
        {files.map((file) => (
          <div className="flex items-center" key={'gen' + file.path}>
            <div className="flex">
              <Spinner
                className="mr-1"
                loading={file.status === 'generating'}
              >
                {file.status === 'error' ? (
                  <XIcon className="size-4 text-red-700" />
                ) : (
                  <CheckIcon className="size-4" />
                )}
              </Spinner>
            </div>
            <span className="whitespace-pre-wrap">
              {file.path}
            </span>
          </div>
        ))}
      </div>
    </ToolMessage>
  )
}
