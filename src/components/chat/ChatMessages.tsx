"use client";

import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messagesStore";
import StepList from "@/components/chat/StepList";

export default function ChatMessages() {
  const messages = useMessagesStore((state) => state.messages);

  return messages.map(({ id, role, content, steps, title }) => {
    const trimmed = content.trim();
    const isUser = role === "user";

    return (
      <div
        key={id}
        className={cn(
          "relative rounded-2xl border border-border/50 bg-card/60",
          "px-3.5 py-2.5 shadow-sm shadow-black/5 dark:shadow-black/10",
          isUser ? "max-w-[85%] ml-auto" : "msg-assistant",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {trimmed}
        </p>

        {steps.length > 0 && (
          <StepList messageId={id} steps={steps} title={title} />
        )}
      </div>
    );
  });
}
