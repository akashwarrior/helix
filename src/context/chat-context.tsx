"use client";

import { Chat } from "@ai-sdk/react";
import { type ReactNode } from "react";
import { DataPart } from "@/ai/messages/data-parts";
import { DataUIPart, DefaultChatTransport } from "ai";
import { createContext, useContext, useMemo, useRef } from "react";
import { toast } from "sonner";
import type { ChatUIMessage } from "@/lib/types";
import { useDataStateMapper } from "@/store/sandbox";

interface ChatContextValue {
  chat: Chat<ChatUIMessage>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({
  children,
  chatId,
}: {
  children: ReactNode;
  chatId: string;
}) {
  const mapDataToStateRef = useRef(useDataStateMapper());

  const chat = useMemo(
    () =>
      new Chat<ChatUIMessage>({
        transport: new DefaultChatTransport({ api: `/api/chat/${chatId}` }),
        onData: (data: DataUIPart<DataPart>) => mapDataToStateRef.current(data),
        onError: (error) => {
          toast.error(`Communication error with the AI: ${error.message}`);
          console.error("Error sending message:", error);
        },
      }),
    [],
  );

  return (
    <ChatContext.Provider value={{ chat }}>{children}</ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChatContext must be used within a ChatProvider");
  }
  return context;
}
