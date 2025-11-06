"use client";

import { motion } from "motion/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import type { ChatUIMessage } from "@/lib/types";
import { useSharedChatContext } from "@/context/chat-context";
import { useLocalStorageValue } from "@/hook/use-local-storage-value";
import { Button } from "../ui/button";

export function ChatInput({ chatId }: { chatId: string }) {
  const { chat } = useSharedChatContext();
  const { status, sendMessage } = useChat<ChatUIMessage>({ chat });

  const [input, setInput] = useLocalStorageValue(chatId);

  const validateAndSubmitMessage = (text: string) => {
    if (text.trim()) {
      sendMessage({ text });
      setInput("");
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setInput(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      validateAndSubmitMessage(input);
    }
  };

  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      exit={{ y: -20 }}
      className="my-4 max-w-3xl mx-auto w-full rounded-2xl bg-card/60 border border-muted-foreground/10 backdrop-blur-md focus-within:shadow-lg"
    >
      <textarea
        autoFocus
        name="chat-input"
        value={input}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        placeholder="Type your message..."
        className="w-full bg-transparent placeholder:text-muted-foreground/70 text-foreground p-4 pr-12 resize-none focus:outline-none min-h-16 max-h-32 leading-relaxed focus:placeholder-muted-foreground/50"
      />

      <div className="absolute right-3 bottom-3">
        <Button
          size="icon"
          onClick={() => validateAndSubmitMessage(input)}
          disabled={status !== "ready" || !input.trim()}
          className="h-8 w-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="Send message"
        >
          {status !== "ready" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowUp size={14} />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
