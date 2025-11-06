"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import { useHeaderOption } from "@/store/header-options";
import type { ChatUIMessage } from "@/lib/types";
import { useSharedChatContext } from "@/context/chat-context";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import Message from "./message";
import { useChat } from "@ai-sdk/react";

interface Props {
  title: string | null;
  initialMessages: any[];
}

export default function ChatMessages({ title, initialMessages }: Props) {
  const { chat } = useSharedChatContext();
  const { messages, status, setMessages, regenerate, stop } =
    useChat<ChatUIMessage>({ chat });
  const setTitle = useHeaderOption((state) => state.setTitle);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setMessages(initialMessages);
    if (initialMessages.length === 1) {
      setSubmitted(true);
      regenerate();
    }

    if (title) {
      setTitle(title);
    }

    return () => {
      stop();
      setTitle(null);
    };
  }, []);

  useEffect(() => {
    if (status === "streaming" && submitted) {
      setSubmitted(false);
    }
  }, [status]);

  return (
    <StickToBottom
      initial="instant"
      className="relative flex-1 overflow-y-auto"
    >
      <StickToBottom.Content className="py-6 flex flex-col gap-4 md:gap-6 px-3 max-w-3xl mx-auto w-full">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {submitted && (
          <Message
            message={
              {
                id: "reasoning-chat-id",
                role: "assistant",
                parts: [{ type: "reasoning", state: "streaming" }],
              } as ChatUIMessage
            }
          />
        )}
      </StickToBottom.Content>
      <ConversationScrollButton />
    </StickToBottom>
  );
}

const ConversationScrollButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = () => scrollToBottom();

  return (
    !isAtBottom && (
      <Button
        className="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full"
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
