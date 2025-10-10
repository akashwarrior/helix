import { Brain } from 'lucide-react'
import type { ReasoningUIPart } from 'ai'
import { TextEffect } from '@/components/ui/text-effect';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { MarkdownRenderer } from '@/components/markdown-renderer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Reasoning({ part }: { part: ReasoningUIPart }) {
  if (part.state === 'done' && !part.text) {
    return null
  }

  const text = part.text || '_Thinking_'
  const isStreaming = part.state === 'streaming'

  return (
    <Accordion collapsible type="single">
      <AccordionItem value="reasoning">
        <AccordionTrigger className='w-full flex items-center justify-between h-fit p-1 '>
          <div className='flex items-center justify-center gap-2 text-white/60'>
            <Brain size={14} />
            {!isStreaming ?
              <TextEffect per='char'>
                Thoughts...
              </TextEffect>
              :
              <TextShimmer duration={1}>
                Thinking
              </TextShimmer>
            }
          </div>
        </AccordionTrigger>

        <AccordionContent className='text-white/60 mx-2 border p-2 rounded-lg mt-2 bg-none border-none'>
          <MarkdownRenderer content={text} />
        </AccordionContent>

      </AccordionItem>
    </Accordion>
  )
}
