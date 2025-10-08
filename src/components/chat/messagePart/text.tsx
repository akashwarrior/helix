import type { TextUIPart } from 'ai'
import { MarkdownRenderer } from '@/components/markdown-renderer'

export function Text({ part }: { part: TextUIPart }) {
  return (
    <div className="whitespace-pre-wrap leading-relaxed text-foreground">
      <MarkdownRenderer content={part.text} />
    </div>
  )
}
