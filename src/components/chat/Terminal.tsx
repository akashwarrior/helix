"use client";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Terminal as TerminalIcon, RotateCcw, Trash2 } from "lucide-react";
import type { Terminal as TerminalType, IDisposable } from "@xterm/xterm";
import type { WebContainer, WebContainerProcess } from "@webcontainer/api";
import "@xterm/xterm/css/xterm.css";

const getTerminalTheme = (theme: string | undefined) => ({
  background: "#00000000",
  foreground: theme !== "light" ? "#f4f4f5" : "#09090b",
  cursor: theme !== "light" ? "#f4f4f5" : "#09090b",
  cursorAccent: theme !== "light" ? "#09090b" : "#ffffff",
  selectionBackground: theme !== "light" ? "#27272a" : "#e4e4e7",
  black: theme !== "light" ? "#18181b" : "#71717a",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: theme !== "light" ? "#f4f4f5" : "#09090b",
  brightBlack: theme !== "light" ? "#71717a" : "#a1a1aa",
  brightRed: "#f87171",
  brightGreen: "#4ade80",
  brightYellow: "#facc15",
  brightBlue: "#60a5fa",
  brightMagenta: "#c084fc",
  brightCyan: "#22d3ee",
  brightWhite: theme !== "light" ? "#ffffff" : "#18181b",
});

export default function Terminal({
  webContainer,
}: {
  webContainer: WebContainer;
}) {
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<TerminalType | null>(null);
  const inputHandlerRef = useRef<IDisposable | null>(null);
  const processRef = useRef<WebContainerProcess | null>(null);

  const terminalTheme = getTerminalTheme(theme);
  if (terminal.current) {
    terminal.current.options.theme = terminalTheme;
    terminal.current.refresh(0, terminal.current.rows - 1);
  }

  const cleanupShell = () => {
    try {
      inputHandlerRef.current?.dispose();
      processRef.current?.kill();
    } catch (err) {
      console.error("Failed to kill process:", err);
    }
    inputHandlerRef.current = null;
    processRef.current = null;

    setIsConnected(false);
  };

  const startShell = async () => {
    if (!terminal.current) return;
    cleanupShell();
    try {
      terminal.current.writeln("Starting shell session...");

      const process = await webContainer.spawn("bash", [], {
        terminal: {
          cols: terminal.current.cols,
          rows: terminal.current.rows,
        },
      });

      processRef.current = process;
      setIsConnected(true);

      inputHandlerRef.current = terminal.current.onData((data: string) => {
        try {
          const writer = process.input.getWriter();
          writer.write(data);
          writer.releaseLock();
        } catch (e) {
          console.error("Failed to write to process:", e);
        }
      });

      process.output
        .pipeTo(
          new WritableStream({
            write(data) {
              terminal.current?.write(data);
            },
          }),
        )
        .catch(() => toast.error("Failed to pipe process output"));
    } catch (error) {
      console.error("Failed to start shell:", error);
      terminal.current?.writeln("\r\n\x1b[31mFailed to start shell\x1b[0m");
      cleanupShell();
    }
  };

  useEffect(() => {
    if (!terminalRef.current || terminal.current) return;
    let observer: ResizeObserver | null = null;

    const initTerminal = async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      const xterm = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
        fontSize: 14,
        lineHeight: 1.5,
        theme: terminalTheme,
      });

      const fit = new FitAddon();
      xterm.loadAddon(fit);
      xterm.open(terminalRef.current!);
      terminal.current = xterm;
      startShell();

      observer = new ResizeObserver(() => {
        fit.fit();
        xterm.resize(xterm.cols, xterm.rows);
      });

      observer.observe(terminalRef.current!);
    };

    initTerminal();

    return () => {
      cleanupShell();
      terminal.current?.dispose();
      terminal.current = null;
      observer?.disconnect();
      observer = null;
    };
  }, [webContainer]);

  const restartShell = async () => {
    if (!terminal.current) return;
    cleanupShell();
    terminal.current.clear();
    terminal.current.writeln("\r\n\x1b[33mRestarting shell...\x1b[0m");
    await startShell();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/10"
    >
      <div className="px-4 py-2.5 bg-card/50 backdrop-blur-md border-b border-border/20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Terminal
          </span>
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-green-500 animate-pulse rounded-full shadow-sm" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => terminal.current?.clear()}
            className="h-7 w-7 p-0 hover:bg-muted/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            title="Clear Terminal"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={restartShell}
            className="h-7 w-7 p-0 hover:bg-muted/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            title="Restart Shell"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div ref={terminalRef} className="p-4 min-h-0 flex-1 mb-10" />

      <div className="px-4 py-3 bg-card/30 backdrop-blur-sm border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-sm" />
          )}
          <span className="font-mono">Terminal ready</span>
        </div>
        <span className="text-muted-foreground/70">Type commands here ↑</span>
      </div>
    </motion.div>
  );
}
