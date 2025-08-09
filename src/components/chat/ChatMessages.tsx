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
          "rounded-lg py-1.5 px-2.5",
          isUser && "bg-primary/10 max-w-[85%] ml-auto",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {trimmed}
        </p>

        {steps.length > 0 && (
          <StepList
            messageId={id}
            steps={steps}
            title={title}
          />
        )}
      </div>
    );
  });
}
