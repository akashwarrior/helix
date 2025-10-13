'use client'

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useLocalStorageValue } from "@/lib/useLocalStorageValue";
import type { ChatUIMessage } from "@/lib/types";
import { DefaultChatTransport } from "ai";
import { Button } from '@/components/ui/button'
import { ArrowDownIcon } from 'lucide-react'
import Message from "../chat/Message";
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { useDataStateMapper } from "@/store/sandbox";

interface Props {
  chatId: string,
  initialMessages: any[] // TODO: fix type
}

export default function Chat({ initialMessages, chatId }: Props) {
  const mapDataToStateRef = useRef(useDataStateMapper())
  const [input, setInput] = useLocalStorageValue('prompt-input');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { messages, status, sendMessage, regenerate, stop } = useChat<ChatUIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `/api/chat/${chatId}`,
    }),
    onData: (data) => {
      mapDataToStateRef.current(data)
    },
  })

  useEffect(() => {
    if (initialMessages.length === 1) {
      setSubmitted(true)
      regenerate();
    }

    return () => {
      stop()
    }
  }, [])

  useEffect(() => {
    if (status === 'streaming' && submitted) {
      setSubmitted(false)
    }
  }, [status])

  const validateAndSubmitMessage = (text: string) => {
    if (text.trim()) {
      setSubmitted(true)
      sendMessage({ text })
      setInput('')
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setInput(e.target.value);
  };

  return (
    <div className="overflow-hidden transition-all duration-150 h-full flex flex-col flex-1">
      <StickToBottom
        initial="instant"
        className='relative flex-1 overflow-y-auto'
      >
        <StickToBottom.Content className='py-6 flex flex-col gap-4 md:gap-6 px-3 max-w-3xl mx-auto w-full'>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {submitted && [{
            id: crypto.randomUUID(),
            role: 'assistant',
            parts: [{ type: 'reasoning', state: 'streaming' }],
          }].map((message) => (
            <Message key={message.id} message={message as ChatUIMessage} />
          ))}

        </StickToBottom.Content>
        <ConversationScrollButton />
      </StickToBottom>

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
            disabled={status === 'streaming' || submitted}
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
  )
}

const ConversationScrollButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const handleScrollToBottom = () => scrollToBottom()

  return (
    !isAtBottom && (
      <Button
        className='absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full'
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  )
}