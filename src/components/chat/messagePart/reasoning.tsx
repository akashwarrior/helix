import { cn } from '@/lib/utils'
import { Brain } from 'lucide-react'
import { motion } from 'motion/react';
import type { ReasoningUIPart } from 'ai'
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
    <Accordion
      collapsible
      type="single"
    >
      <AccordionItem value="reasoning" className='w-full'>
        <AccordionTrigger className='flex items-center justify-between w-full relative h-fit!'>
          <div className='flex items-center justify-center gap-2 text-white/60'>
            <Brain size={14} />
            {!isStreaming ? "Thoughts..." :
              <motion.span
                className="absolute left-6 inset-0 bg-clip-text flex items-center justify-start gap-3"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(34,211,238,0) 0%, rgba(34,211,238,0) 45%, rgba(34,211,238,1) 50%, rgba(34,211,238,0) 55%, rgba(34,211,238,0) 100%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["110% 0%", "-10% 0%"],
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                Thinking
                <div
                  className={cn(
                    "w-2 h-2 rounded-full bg-cyan-400 animate-pulse",
                  )}
                  aria-label={isStreaming ? "In progress" : "Complete"}
                />
              </motion.span>
            }
          </div>
        </AccordionTrigger>

        <AccordionContent className='text-white/60 mx-2 border p-2 rounded-lg'>
          <MarkdownRenderer content={text} />
        </AccordionContent>

      </AccordionItem>
    </Accordion>
  )
}
