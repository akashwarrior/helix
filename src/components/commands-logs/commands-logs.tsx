'use client'

import { useSandboxStore } from '@/store/sandbox'
import { RotateCcw, TerminalIcon, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export function CommandsLogs() {
  const { commands, status } = useSandboxStore()
  const isConnected = status === 'running';

  return (
    <div className='flex-1 flex flex-col bg-white dark:bg-black/20 border border-border/50 overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/10'>
      <div className="px-4 py-2.5 bg-secondary/70 backdrop-blur-md border-b border-border/70 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Terminal
          </span>
          <div className="flex items-center gap-1.5">
            {isConnected ?
              <>
                <div className="h-2 w-2 bg-green-500 animate-pulse rounded-full shadow-sm" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </>
              : <>
                <div className="h-2 w-2 bg-yellow-500 animate-pulse rounded-full shadow-sm" />
                <span className="text-xs text-muted-foreground">Connecting</span>
              </>
            }
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            title="Clear Terminal"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            title="Restart Shell"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="p-2 space-y-2 flex-1 overflow-y-scroll">
        {commands.map((command) => {
          const date = new Date(command.startedAt).toLocaleTimeString(
            'en-US',
            {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }
          )

          const input = `${command.command} ${command.args.join(' ')}`
          const output = command.logs?.map((log) => log.data).join('') || ''
          return (
            <pre
              key={command.cmdId}
              className="whitespace-pre-wrap font-mono text-sm"
            >
              {`[${date}] ${input}\n${output}`}
            </pre>
          )
        })}
      </div>

      <div className="sticky bottom-0 px-4 py-3 bg-card/30 backdrop-blur-sm border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-sm" />
          )}
          <span className="font-mono">Terminal {isConnected ? 'ready' : 'starting...'}</span>
        </div>
        <span className="text-muted-foreground/70">Type commands here ↑</span>
      </div>
    </div>
  )
}