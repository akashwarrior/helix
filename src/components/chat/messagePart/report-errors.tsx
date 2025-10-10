import type { DataPart } from '@/ai/messages/data-parts'
import { BugIcon } from 'lucide-react'
import { ToolHeader } from '../tool-header'
import { ToolMessage } from '../tool-message'
import Markdown from 'react-markdown'

export function ReportErrors({ message }: { message: DataPart['report-errors'] }) {
  return (
    <ToolMessage>
      <ToolHeader
        title="Auto-detected errors"
        icon={
          <BugIcon className="w-3.5 h-3.5" />
        }
      />
      <div className="relative min-h-5">
        <Markdown>{message.summary}</Markdown>
      </div>
    </ToolMessage>
  )
}
