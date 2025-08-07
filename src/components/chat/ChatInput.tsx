'use client';

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { processXmlResponse } from "@/lib/server/execution";
import type { Message } from "@ai-sdk/react";
import { Role } from "@prisma/client";

interface ChatInputProps {
  chatId: string;
  initialMessages: Message[];
}

export default function ChatInput({ chatId, initialMessages }: ChatInputProps) {
  const { messages: msgs, input, handleInputChange, handleSubmit, status } = useChat({
    api: `/api/chat/${chatId}`,
    initialMessages: initialMessages.length === 1 ? [] : initialMessages,
    initialInput: initialMessages.length === 1 ? initialMessages[0].content : "",
    onError: (error) => {
      console.error(error);
    },
  });

  const [isEmpty, setIsEmpty] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!isLoading) return;
    const lastMessage = msgs[msgs.length - 1];
    if (lastMessage?.role === "assistant") {
      processXmlResponse(lastMessage.content, lastMessage.id, lastMessage.role);
    }
  }, [msgs, isLoading]);

  useEffect(() => {
    for (const msg of initialMessages) {
      processXmlResponse(msg.content, msg.id, msg.role as Role);
    }
    if (initialMessages.length === 1) {
      handleSubmit();
    }
  }, [initialMessages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setIsEmpty(textarea.value.trim() === "");
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isLoading) return;
    handleSubmit(e);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlKey = e.ctrlKey || e.metaKey;
    if (isCtrlKey && e.key === "Enter") {
      e.preventDefault();
      handleChatSubmit(e);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative rounded-2xl transition-all duration-300 bg-card/70 border backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/10",
        "focus-within:shadow-primary/10 focus-within:shadow-lg focus-within:border-ring/50",
      )}
    >
      <textarea
        name="chat-input"
        value={input}
        ref={textareaRef}
        onChange={(e) => {
          handleInputChange(e);
          adjustTextareaHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask Helix anything..."
        className="w-full bg-transparent placeholder:text-muted-foreground/70 text-foreground p-4 pr-12 resize-none focus:outline-none min-h-16 max-h-32 leading-relaxed focus:placeholder-muted-foreground/50"
      />

      <div className="absolute right-3 bottom-3">
        <Button
          size="icon"
          onClick={handleChatSubmit}
          disabled={isLoading || isEmpty}
          className="h-8 w-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowUp size={14} />
          )}
        </Button>
      </div>
    </motion.div>
  )
}