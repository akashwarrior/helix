'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import type { WebContainer } from '@webcontainer/api';
import { Terminal as TerminalIcon, RotateCcw, Trash2 } from 'lucide-react';
import type { Terminal as TerminalType, IDisposable } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const getTerminalTheme = (theme: string | undefined) => ({
  background: theme === 'dark' ? '#09090b' : '#ffffff',
  foreground: theme === 'dark' ? '#f4f4f5' : '#09090b',
  cursor: theme === 'dark' ? '#f4f4f5' : '#09090b',
  cursorAccent: theme === 'dark' ? '#09090b' : '#ffffff',
  selectionBackground: theme === 'dark' ? '#27272a' : '#e4e4e7',
  black: theme === 'dark' ? '#18181b' : '#71717a',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6',
  magenta: '#a855f7',
  cyan: '#06b6d4',
  white: theme === 'dark' ? '#f4f4f5' : '#09090b',
  brightBlack: theme === 'dark' ? '#71717a' : '#a1a1aa',
  brightRed: '#f87171',
  brightGreen: '#4ade80',
  brightYellow: '#facc15',
  brightBlue: '#60a5fa',
  brightMagenta: '#c084fc',
  brightCyan: '#22d3ee',
  brightWhite: theme === 'dark' ? '#ffffff' : '#18181b',
});

const TerminalHeader = ({
  isConnected,
  onClear,
  onRestart
}: {
  isConnected: boolean;
  onClear: () => void;
  onRestart: () => void;
}) => (
  <div className="px-4 py-2 bg-muted/20 border-b border-border/30 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <TerminalIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">Terminal</span>
      {isConnected && (
        <div className="flex items-center gap-1.5">
          <motion.div
            className="h-2 w-2 bg-green-500 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-muted-foreground">Connected</span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-7 w-7 p-0 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Clear Terminal"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRestart}
        className="h-7 w-7 p-0 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Restart Shell"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

export default function Terminal({ webContainer }: { webContainer: WebContainer }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const terminal = useRef<TerminalType | null>(null);
  const inputHandlerRef = useRef<IDisposable | null>(null);
  const { theme } = useTheme();

  const terminalTheme = getTerminalTheme(theme);

  const clearTerminal = () => terminal.current?.clear();

  const cleanupShell = () => {
    if (inputHandlerRef.current) {
      inputHandlerRef.current.dispose();
      inputHandlerRef.current = null;
    }
    setIsConnected(false);
  }

  const startShell = async () => {
    if (!terminal.current) return;
    cleanupShell();
    try {
      terminal.current.write('Starting shell session...\r\n');

      const process = await webContainer.spawn('bash', [], {
        terminal: {
          cols: terminal.current.cols,
          rows: terminal.current.rows
        }
      });

      setIsConnected(true);

      inputHandlerRef.current = terminal.current.onData((data: string) => {
        try {
          const writer = process.input.getWriter();
          writer.write(data);
          writer.releaseLock();
        } catch (e) {
          console.error('Failed to write to process:', e);
        }
      });

      process.output.pipeTo(new WritableStream({
        write(data) {
          terminal.current?.write(data);
        }
      })).catch(() => {
        console.error('Failed to pipe process output');
      });

      process.exit.then(() => {
        terminal.current?.write('\r\n\x1b[33mShell exited\x1b[0m\r\n');
        setIsConnected(false);
        cleanupShell();
      });

    } catch (error) {
      console.error('Failed to start shell:', error);
      terminal.current?.write('\r\n\x1b[31mFailed to start shell\x1b[0m\r\n');
      setIsConnected(false);
      cleanupShell();
    }
  };

  const restartShell = async () => {
    cleanupShell();
    clearTerminal();
    terminal.current?.write('\r\n\x1b[33mRestarting shell...\x1b[0m\r\n');
    startShell();
  };

  useEffect(() => {
    if (!terminalRef.current || terminal.current) return;
    let observer: ResizeObserver | null = null;

    const initTerminal = async () => {
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');

      const xterm = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
        fontSize: 14,
        lineHeight: 1.4,
        theme: terminalTheme,
        scrollback: 1000,
        rows: 24,
        cols: 80,
      });

      const fit = new FitAddon();
      xterm.loadAddon(fit);
      xterm.open(terminalRef.current!);
      fit.fit();


      observer = new ResizeObserver(() => {
        fit.fit();
        xterm.resize(xterm.cols, xterm.rows);
      });

      observer.observe(terminalRef.current!);

      terminal.current = xterm;
      startShell();
    };
    initTerminal()


    return () => {
      cleanupShell();
      terminal.current?.dispose();
      terminal.current = null;
      observer?.disconnect();
      observer = null;
    };
  }, [webContainer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-card border border-border/50 rounded-lg overflow-hidden"
    >
      <TerminalHeader
        isConnected={isConnected}
        onClear={clearTerminal}
        onRestart={restartShell}
      />

      <div
        ref={terminalRef}
        className="w-full p-2 flex-1"
      />
    </motion.div>
  );
};