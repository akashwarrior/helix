import type { DataPart } from '@/ai/messages/data-parts'
import { CheckIcon, SquareChevronRightIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import Markdown from 'react-markdown'

export function RunCommand({ message }: { message: DataPart['run-command'] }) {
  let title = "";
  if (message.status === 'executing')
    title = 'Executing'
  else if (message.status === 'waiting')
    title = 'Waiting'
  else if (message.status === 'running')
    title = 'Running in background'
  else if (message.status === 'done' && message.exitCode !== 1)
    title = 'Finished'
  else if (message.status === 'done' && message.exitCode === 1)
    title = 'Errored'
  else if (message.status === 'error')
    title = 'Errored'

  return (
    <ToolMessage>
      <ToolHeader
        title={title}
        icon={
          <SquareChevronRightIcon className="w-3.5 h-3.5" />
        }
      />
      <div className="relative pl-6">
        <Spinner
          className="absolute left-0 top-0"
          loading={['executing', 'waiting'].includes(message.status)}
        >
          {(message.exitCode && message.exitCode > 0) ||
            message.status === 'error' ? (
            <XIcon className="w-4 h-4 text-red-700" />
          ) : (
            <CheckIcon className="w-4 h-4" />
          )}
        </Spinner>
        <Markdown>{`${message.command} ${message.args.join(' ')}`}</Markdown>
      </div>
    </ToolMessage>
  )
}
