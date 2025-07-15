import ChatInterface from "@/components/chat/ChatInterface";
import ChatPageContainer from "@/components/chat/ChatPageContainer";

export default async function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatInterface />
      <ChatPageContainer />
    </div>
  );
}