"use client";

import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messagesStore";
import StepList from "@/components/chat/StepList";

export default function ChatMessages() {
  const messages = useMessagesStore((state) => state.messages);

  return messages.map(({ id, role, content, steps }) => {
    const trimmed = content.trim();
    const isUser = role === "user";

    return (
      <div
        key={id}
        className={cn(
          "rounded-2xl py-4 px-5",
          isUser && "bg-primary/8 max-w-[85%] ml-auto",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {trimmed}
        </p>

        {steps.length > 0 && (
          <StepList
            messageId={id}
            steps={steps}
            title="Website design generated"
          />
        )}
      </div>
    );
  });
}
