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
import { useHeaderOption } from "@/store/headerOptions";

interface Props {
  title: string | null,
  chatId: string,
  initialMessages: any[] // TODO: fix type
}

export default function Chat({ title, initialMessages, chatId }: Props) {
  const mapDataToStateRef = useRef(useDataStateMapper())
  const { title: headerTitle, setTitle } = useHeaderOption();
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

    if (title) {
      setTitle(title)
    }

    return () => {
      stop()
      setTitle(null);
    }
  }, [])

  useEffect(() => {
    if (status === 'streaming' && submitted) {
      setSubmitted(false)
    }
  }, [status])

  useEffect(() => {
    if (!headerTitle && messages.length === 2) {
      for (const part of messages[1].parts) {
        if (part.type === 'data-project-name') {
          setTitle(part.data.name);
        }
      }
    }
  }, [messages.length === 2 && messages[1].parts.length]);

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

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      validateAndSubmitMessage(input);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden h-full flex flex-col flex-1"
    >
      <StickToBottom
        initial="instant"
        className='relative flex-1 overflow-y-auto'
      >
        <StickToBottom.Content className='py-6 flex flex-col gap-4 md:gap-6 px-3 max-w-3xl mx-auto w-full'>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {submitted &&
            <Message
              message={{
                id: 'reasoning-chat-id',
                role: 'assistant',
                parts: [{ type: 'reasoning', state: 'streaming' }],
              } as ChatUIMessage}
            />
          }

        </StickToBottom.Content>
        <ConversationScrollButton />
      </StickToBottom>

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
    </motion.div>
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