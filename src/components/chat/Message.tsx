"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { MessagePart } from "./messagePart";
import { ChatUIMessage } from "@/lib/types";

const Message = memo(function Message({ message }: { message: ChatUIMessage }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl space-y-2 border border-border/50 bg-card/60 px-3.5 py-2.5 shadow-sm shadow-black/5 dark:shadow-black/10 w-fit",
        message.role === "user" && "max-w-[85%] ml-auto",
        message.role === "assistant" && "msg-assistant",
      )}
    >
      {message.parts.map((part, index) => (
        <MessagePart key={index} part={part} />
      ))}
    </div>
  );
});

export default Message;