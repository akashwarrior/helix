"use client";

import { cn } from "@/lib/utils";
import { MessagePart } from "./message-part";
import { ChatUIMessage } from "@/lib/types";
import { memo, createContext, useContext, useState, useEffect } from "react";

interface ReasoningContextType {
  expandedReasoningIndex: number | null;
  setExpandedReasoningIndex: (index: number | null) => void;
}

const ReasoningContext = createContext<ReasoningContextType | null>(null);

export const useReasoningContext = () => {
  const context = useContext(ReasoningContext);
  return context;
};

const Message = memo(function Message({ message }: { message: ChatUIMessage }) {
  const [expandedReasoningIndex, setExpandedReasoningIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const isReasoning = message.parts.at(-1)?.type === "reasoning";
    if (isReasoning) {
      setExpandedReasoningIndex(message.parts.length - 1);
    } else if (expandedReasoningIndex) {
      setExpandedReasoningIndex(null);
    }
  }, [message]);

  return (
    <ReasoningContext.Provider
      value={{ expandedReasoningIndex, setExpandedReasoningIndex }}
    >
      <div
        className={cn(
          "relative rounded-2xl space-y-2 px-3.5 py-2.5 w-fit overflow-hidden wrap-break-word",
          message.role === "user" &&
            "max-w-[85%] ml-auto border border-border/50 bg-card",
          message.role === "assistant" && "msg-assistant w-full",
        )}
      >
        {message.parts.map((part, index) => (
          <MessagePart key={index} part={part} partIndex={index} />
        ))}
      </div>
    </ReasoningContext.Provider>
  );
});

export default Message;
