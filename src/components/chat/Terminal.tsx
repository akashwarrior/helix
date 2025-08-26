"use client";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Terminal as TerminalIcon, RotateCcw, Trash2 } from "lucide-react";
import type { Terminal as TerminalType, IDisposable } from "@xterm/xterm";
import type { WebContainerProcess } from "@webcontainer/api";
import { useWebContainerStore } from "@/store/webContainer";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const getTerminalTheme = (theme: string | undefined) => {
  const isDark = theme !== "light";
  return {
    background: "#00000000",
    foreground: isDark ? "#f4f4f5" : "#09090b",
    cursor: isDark ? "#f4f4f5" : "#09090b",
    cursorAccent: isDark ? "#09090b" : "#ffffff",
    selectionBackground: isDark ? "#27272a" : "#e4e4e7",
    black: isDark ? "#18181b" : "#71717a",
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
    blue: "#3b82f6",
    magenta: "#a855f7",
    cyan: "#06b6d4",
    white: isDark ? "#f4f4f5" : "#09090b",
    brightBlack: isDark ? "#71717a" : "#a1a1aa",
    brightRed: "#f87171",
    brightGreen: "#4ade80",
    brightYellow: "#facc15",
    brightBlue: "#60a5fa",
    brightMagenta: "#c084fc",
    brightCyan: "#22d3ee",
    brightWhite: isDark ? "#ffffff" : "#18181b",
  };
};

export default function Terminal() {
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<TerminalType | null>(null);
  const inputHandlerRef = useRef<IDisposable | null>(null);
  const processRef = useRef<WebContainerProcess | null>(null);
  const webContainer = useWebContainerStore((state) => state.webContainer);

  const cleanupShell = () => {
    inputHandlerRef.current?.dispose();
    processRef.current?.kill();
    inputHandlerRef.current = null;
    processRef.current = null;

    setIsConnected(false);
  };

  const startShell = async (xterm: XTerm) => {
    if (!webContainer) return;
    cleanupShell();
    try {
      xterm.writeln("Starting shell session...");

      const process = await webContainer.spawn("bash", [], {
        terminal: {
          cols: xterm.cols,
          rows: xterm.rows,
        },
      });

      processRef.current = process;
      setIsConnected(true);

      inputHandlerRef.current = xterm.onData((data: string) => {
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
              xterm.write(data);
            },
          }),
        )
        .catch(() => toast.error("Failed to pipe process output"));
    } catch (error) {
      console.error("Failed to start shell:", error);
      xterm.writeln("\r\n\x1b[31mFailed to start shell\x1b[0m");
      cleanupShell();
    }
  };

  useEffect(() => {
    if (!terminal.current) return;
    const terminalTheme = getTerminalTheme(theme);
    terminal.current.options.theme = terminalTheme;
    terminal.current.refresh(0, terminal.current.rows - 1);
  }, [theme]);

  useEffect(() => {
    if (!terminalRef.current) return;
    const terminalTheme = getTerminalTheme(theme);

    const xterm = new XTerm({
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
    startShell(xterm);

    const observer = new ResizeObserver(() => {
      fit.fit();
      xterm.resize(xterm.cols, xterm.rows);
    });

    observer.observe(terminalRef.current!);

    return () => {
      xterm.dispose();
      fit.dispose();
      observer.disconnect();
      cleanupShell();
    };
  }, []);

  const restartShell = () => {
    if (!terminal.current) return;
    cleanupShell();
    terminal.current.clear();
    terminal.current.writeln("\r\n\x1b[33mRestarting shell...\x1b[0m");
    startShell(terminal.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col backdrop-blur-md border border-border/20 overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/10"
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
