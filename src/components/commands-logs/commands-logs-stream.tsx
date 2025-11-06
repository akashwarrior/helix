"use client";

import { useEffect, useRef } from "react";
import { useSandboxStore } from "@/store/sandbox";
import { useCommandStore } from "@/store/command";
import stripAnsi from "strip-ansi";
import z from "zod/v4";

type StreamingCommandLogs = Record<
  string,
  Awaited<ReturnType<typeof getCommandLogs>>
>;

export function CommandLogsStream() {
  const sandboxId = useSandboxStore((state) => state.sandboxId);
  const { commands, addLog, upsertCommand } = useCommandStore();
  const ref = useRef<StreamingCommandLogs>({});

  useEffect(() => {
    if (sandboxId) {
      for (const command of commands.filter(
        (command) => typeof command.exitCode === "undefined",
      )) {
        if (!ref.current[command.cmdId]) {
          const iterator = getCommandLogs(sandboxId, command.cmdId);
          ref.current[command.cmdId] = iterator;
          (async () => {
            for await (const log of iterator) {
              addLog({
                cmdId: command.cmdId,
                log: log,
              });
            }

            const log = await getCommand(sandboxId, command.cmdId);
            upsertCommand({
              cmdId: log.cmdId,
              exitCode: log.exitCode ?? 0,
              command: command.command,
              args: command.args,
            });
          })();
        }
      }
    }
  }, [sandboxId, commands]);

  return null;
}

const logSchema = z.object({
  data: z.string(),
  stream: z.enum(["stdout", "stderr"]),
  timestamp: z.number(),
});

async function* getCommandLogs(sandboxId: string, cmdId: string) {
  const response = await fetch(
    `/api/sandboxes/${sandboxId}/cmds/${cmdId}/logs`,
    { headers: { "Content-Type": "application/json" } },
  );

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let line = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    line += decoder.decode(value, { stream: true });
    const lines = line.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i]) {
        const logEntry = JSON.parse(lines[i]);
        const parsed = logSchema.parse(logEntry);
        yield {
          data: stripAnsi(parsed.data),
          stream: parsed.stream,
          timestamp: parsed.timestamp,
        };
      }
    }
    line = lines[lines.length - 1];
  }
}

const cmdSchema = z.object({
  cmdId: z.string(),
  exitCode: z.number().optional(),
});

async function getCommand(sandboxId: string, cmdId: string) {
  const response = await fetch(`/api/sandboxes/${sandboxId}/cmds/${cmdId}`);
  const json = await response.json();
  return cmdSchema.parse(json);
}
