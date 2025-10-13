"use client";

import { cn } from "@/lib/utils";
import { MessagePart } from "./messagePart";
import { ChatUIMessage } from "@/lib/types";
import { memo, createContext, useContext, useState, useEffect } from 'react'

interface ReasoningContextType {
  expandedReasoningIndex: number | null
  setExpandedReasoningIndex: (index: number | null) => void
}

const ReasoningContext = createContext<ReasoningContextType | null>(null)

export const useReasoningContext = () => {
  const context = useContext(ReasoningContext)
  return context
}

const Message = memo(function Message({ message }: { message: ChatUIMessage }) {
  const [expandedReasoningIndex, setExpandedReasoningIndex] = useState<number | null>(null)

  useEffect(() => {
    const parts = message.parts;
    const lastIdx = parts.length - 1
    if (lastIdx >= 0) {
      if (parts[lastIdx].type === 'reasoning') {
        setExpandedReasoningIndex(lastIdx)
      } else if (expandedReasoningIndex) {
        setExpandedReasoningIndex(null)
      }
    }
  }, [message]);


  return (
    <ReasoningContext.Provider
      value={{ expandedReasoningIndex, setExpandedReasoningIndex }}
    >
      <div
        className={cn(
          "relative rounded-2xl space-y-2 px-3.5 py-2.5 w-fit",
          message.role === "user" && "max-w-[85%] ml-auto border border-border/50 bg-card",
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