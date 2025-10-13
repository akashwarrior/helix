import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, LinkIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'

interface Props {
  message: DataPart['get-sandbox-url']
}

export function GetSandboxURL({ message: { status, url } }: Props) {
  return (
    <ToolMessage>
      <ToolHeader
        title="Get Sandbox URL"
        icon={
          <LinkIcon className="w-3.5 h-3.5" />
        }
      />
      <div className="relative pl-6 min-h-5">
        <Spinner
          className="absolute left-0 top-0"
          loading={status === 'loading'}
        >
          <CheckIcon className="w-4 h-4" />
        </Spinner>
        {url ? (
          <a href={url} target="_blank">
            {url}
          </a>
        ) : (
          <span>Getting Sandbox URL</span>
        )}
      </div>
    </ToolMessage>
  )
}
