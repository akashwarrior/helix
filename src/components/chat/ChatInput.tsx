"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { processXmlResponse } from "@/lib/server/execution";
import { DefaultChatTransport } from "ai";
import { Message } from "@prisma/client";
import { convertUIPartsToString } from "@/lib/server/constants";

interface ChatInputProps {
  chatId: string;
  initialMessages: Omit<Message, "projectId">[];
}

export default function ChatInput({ chatId, initialMessages }: ChatInputProps) {
  const { messages, status, sendMessage, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: `/api/chat/${chatId}` }),
    messages: initialMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      parts: [{
        type: "text",
        text: msg.content,
      }],
    })),
    onError: (error) => {
      console.error(error);
    },
  });

  const [isEmpty, setIsEmpty] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    if (!lastMessage) return;
    processXmlResponse({
      ...lastMessage,
      content: convertUIPartsToString(lastMessage.parts),
    });
  }, [messages]);

  useEffect(() => {
    for (const msg of initialMessages) {
      processXmlResponse(msg);
    }
    if (initialMessages.length === 1) {
      regenerate();
    }

    return () => { stop() }
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
    const input = textareaRef.current?.value ?? "";
    if (isEmpty || isLoading || !input) return;
    sendMessage({
      text: input,
    });
    textareaRef.current!.value = "";
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
      className="relative rounded-2xl transition-all duration-300 bg-card/60 border border-muted-foreground/10 backdrop-blur-md focus-within:shadow-lg"
    >
      <textarea
        name="chat-input"
        ref={textareaRef}
        onChange={adjustTextareaHeight}
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
  );
}
