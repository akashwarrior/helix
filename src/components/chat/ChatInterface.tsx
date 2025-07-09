'use client';

import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { ArrowUp, RotateCcw, Loader2, Check, Clipboard } from 'lucide-react';
import { useIsChatOpen } from '@/store/isChatOpen';

const LoadingIndicator = () => (
  <div className="flex items-center gap-3 py-3">
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-primary rounded-full"
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    <motion.span className="text-muted-foreground text-sm truncate"
      initial={{ width: 0 }}
      animate={{ width: 'auto' }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      AI is thinking
      <motion.span
        className="text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        |
      </motion.span>
    </motion.span>
  </div>
);

export default function ChatInterface() {
  const isChatOpen = useIsChatOpen(state => state.isChatOpen);
  const { messages, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
  });

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setIsEmpty(textarea.value.trim() === '');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isLoading) return;
    textareaRef.current!.value = '';
    handleSubmit(e);
    adjustTextareaHeight();
  };

  const handleCopy = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleInputChangeWithHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlKey = e.ctrlKey || e.metaKey;
    if (isCtrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleChatSubmit(e);
    }

    if (isCtrlKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("border-r border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm transition-all duration-300",
      isChatOpen ? "w-96" : "w-0")}
    >
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <h1 className="font-medium text-foreground">React Todo App</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 px-4 lg:px-6">
          {messages.map(({ id, role, content }) => (
            <div
              key={id}
              className={cn("rounded-2xl py-4 px-5 group relative backdrop-blur-sm",
                role === "user" && "bg-primary/5 max-w-[85%] ml-auto",
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                {content.trim()}
              </p>

              {role === "assistant" && !isLoading && (
                <div className="flex items-center gap-2 mt-4 text-muted-foreground/80">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {/* Add regenerate functionality */ }}
                    className="h-8 w-8"
                    title="Regenerate response"
                  >
                    <RotateCcw size={14} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(id, content)}
                    className="h-8 w-8"
                    title={copiedMessageId === id ? "Copied!" : "Copy message"}
                  >
                    {copiedMessageId === id ? <Check size={14} className="text-emerald-500" /> : <Clipboard size={14} />}
                  </Button>
                </div>
              )}
            </div>
          ))}

          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mx-3 relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl focus-within:border-ring/50 transition-colors"
        >
          <textarea
            ref={textareaRef}
            onChange={handleInputChangeWithHeight}
            onKeyDown={handleKeyDown}
            placeholder="Ask Helix anything..."
            className="w-full bg-transparent placeholder:text-muted-foreground text-foreground p-4 pr-12 resize-none focus:outline-none min-h-28 max-h-32 leading-relaxed"
            aria-label="Chat input"
          />

          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              onClick={handleChatSubmit}
              disabled={isLoading || isEmpty}
              className="h-8 w-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={14} />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 