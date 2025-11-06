"use client";

import { useCommandStore } from "@/store/command";

export function CommandsLogs() {
  const commands = useCommandStore((state) => state.commands);

  return (
    <div className="p-2 space-y-2 h-full">
      {commands.map((command) => {
        const date = new Date(command.startedAt).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const input = `${command.command} ${command.args.join(" ")}`;
        const output = command.logs?.map((log) => log.data).join("") || "";
        return (
          <pre
            key={command.cmdId}
            className="whitespace-pre-wrap font-mono text-sm"
          >
            {`[${date}] ${input}\n${output}`}
          </pre>
        );
      })}
    </div>
  );
}
