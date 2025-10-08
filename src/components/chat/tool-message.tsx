import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

export function ToolMessage(props: {
  className?: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'text-sm px-3.5 py-3 border border-border bg-background rounded-md font-mono',
        props.className
      )}
    >
      {props.children}
    </motion.div>
  )
}
