"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { DefaultChatTransport } from "ai";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import { ChatUIMessage } from "@/lib/types";
import { useSharedChatContext } from "@/lib/chatContext";
import { useSettings } from "../settings/use-settings";
import Message from "./Message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "../ai-elements/conversation";


export default function Chat({ chatId }: { chatId: string }) {
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const { chat } = useSharedChatContext()
  const { modelId } = useSettings()
  const { messages, sendMessage, status } = useChat<ChatUIMessage>({
    ...chat,
    transport: new DefaultChatTransport({ api: `/api/chat/${chatId}` }),
  })

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (text.trim()) {
        sendMessage({ text }, { body: { modelId } })
        setInput('')
      }
    },
    [sendMessage, modelId, setInput]
  )

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      setInput(e.target.value);
    },
    [setInput]
  );


  return (
    <div className="overflow-hidden transition-all duration-150 h-full flex flex-col flex-1">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative rounded-2xl transition-all duration-300 bg-card/60 border border-muted-foreground/10 backdrop-blur-md focus-within:shadow-lg"
        >
          <textarea
            name="chat-input"
            value={input}
            onChange={handleOnChange}
            placeholder="Type your message..."
            disabled={status === 'streaming' || status === 'submitted'}
            className="w-full bg-transparent placeholder:text-muted-foreground/70 text-foreground p-4 pr-12 resize-none focus:outline-none min-h-16 max-h-32 leading-relaxed focus:placeholder-muted-foreground/50"
          />

          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              onClick={() => validateAndSubmitMessage(input)}
              disabled={status !== 'ready' || !input.trim()}
              className="h-8 w-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              aria-label="Send message"
            >
              {status !== 'ready' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowUp size={14} />
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}