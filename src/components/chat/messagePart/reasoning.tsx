import { cn } from '@/lib/utils';
import { Brain, ChevronRightIcon } from 'lucide-react'
import type { ReasoningUIPart } from 'ai'
import { TextEffect } from '@/components/ui/text-effect';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { useReasoningContext } from '../Message';
import { StickToBottom } from 'use-stick-to-bottom';

export function Reasoning({
  part,
  partIndex,
}: {
  part: ReasoningUIPart
  partIndex: number
}) {
  const context = useReasoningContext()
  const isExpanded = context?.expandedReasoningIndex === partIndex

  const handleClick = () => {
    if (context) {
      const newIndex = isExpanded ? null : partIndex
      context.setExpandedReasoningIndex(newIndex)
    }
  }

  return (
    <div
      className='text-sm flex flex-col gap-3 cursor-pointer'
      onClick={handleClick}
    >
      <div className='flex items-center gap-2 group'>
        <div className='relative flex items-center justify-center p-2 text-muted-foreground/80 hover:text-foreground transition-colors'>
          <Brain
            size={14}
            className={cn(
              'absolute m-auto group-hover:scale-0 transition-all duration-200',
              part.text && isExpanded && 'scale-0'
            )}
          />
          <ChevronRightIcon
            size={16}
            className={cn(
              'absolute m-auto group-hover:scale-100 transition-all duration-200',
              part.text && isExpanded ? 'scale-100 rotate-90' : 'scale-0',
            )}
          />
        </div>

        {part.state === 'streaming' ?
          <TextShimmer duration={1}>
            Thinking
          </TextShimmer>
          :
          <TextEffect per='char'>
            Thoughts...
          </TextEffect>
        }
      </div>

      {part.text && <div
        className={cn(
          "ml-[6.95px] -mt-3 flex text-muted-foreground/80 relative overflow-hidden",
          "transition-[height] duration-500 max-h-fit h-30 border-l-2 border-l-foreground/30",
          !isExpanded && "h-0 border-none"
        )}
      >
        <div
          className={cn(
            "h-8 from-background to-transparent transition-opacity duration-500 absolute z-10 pointer-events-none opacity-50 bg-linear-to-b top-0 left-0 w-full",
            !isExpanded && "opacity-0"
          )}
        />

        <StickToBottom>
          <StickToBottom.Content className='overflow-y-auto pb-4 pt-3 px-4'>
            <MarkdownRenderer content={part.text} />
          </StickToBottom.Content>
        </StickToBottom>
        <div
          className={cn(
            "h-8 from-background to-transparent transition-opacity duration-500 absolute z-10 pointer-events-none opacity-50 bg-linear-to-t bottom-0 left-0 w-full",
            !isExpanded && "opacity-0"
          )}
        />
      </div>
      }
    </div>
  )
}
