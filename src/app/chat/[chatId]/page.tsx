import ChatInterface from "@/components/chat/ChatInterface";
import WebContainerWrapper from "@/components/WebContainerWrapper";

export default async function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatInterface />
      <WebContainerWrapper />
    </div>
  );
}