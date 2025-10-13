import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'

export function Spinner({
  className,
  loading,
  children,
}: {
  className?: string
  loading: boolean
  children?: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-5 h-5',
        className
      )}
    >
      {loading ? <Loader2Icon className="size-4 animate-spin" /> : children}
    </span>
  )
}
