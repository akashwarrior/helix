'use client';

import { useRef, useState } from 'react';
import { ArrowUp, Copy, RotateCcw, Loader2, Check } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

const LoadingIndicator = () => (
  <div className="flex items-center gap-2 py-3">
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
    <span className="text-muted-foreground text-sm ml-2">AI is thinking...</span>
  </div>
);

export default function ChatInterface() {
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
    handleSubmit(e);
    adjustTextareaHeight();
  };

  const handleCopy = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleInputChangeWithHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-neutral-800">
        <h1 className="font-medium text-sm">React Todo App</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-6 px-4">
          {messages.map(({ id, role, content }) => (
            <div
              key={id}
              className={`rounded-xl py-4 px-4 group relative border ${role === "user"
                ? "bg-neutral-800/50 self-end max-w-[85%] border-neutral-700/50"
                : "bg-neutral-900/40 border-neutral-800/30"
                }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {content.trim()}
              </p>

              {role === "assistant" && !isLoading && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-4 gap-2">
                  <button
                    onClick={() => {/* Add regenerate functionality */ }}
                    className="h-8 w-8 rounded-lg hover:bg-neutral-800/50 transition-colors flex items-center justify-center border border-neutral-700/30"
                    title="Regenerate response"
                    aria-label="Regenerate response"
                  >
                    <RotateCcw size={14} className="text-blue-400" />
                  </button>

                  <button
                    onClick={() => handleCopy(id, content)}
                    className="h-8 w-8 rounded-lg hover:bg-neutral-800/50 transition-colors flex items-center justify-center border border-neutral-700/30"
                    title={copiedMessageId === id ? "Copied!" : "Copy message"}
                    aria-label={copiedMessageId === id ? "Copied!" : "Copy message"}
                  >
                    {copiedMessageId === id ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && <LoadingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 focus-within:border-neutral-700 relative">
          <textarea
            ref={textareaRef}
            onChange={handleInputChangeWithHeight}
            onKeyDown={handleKeyDown}
            placeholder="Ask Helix anything..."
            className="w-full bg-transparent placeholder-muted-foreground text-white p-4 resize-none focus:outline-none min-h-[80px] max-h-64"
            aria-label="Chat input"
          />
          <button
            onClick={handleChatSubmit}
            disabled={isLoading || isEmpty}
            className={`absolute right-3 bottom-3 p-2 rounded-lg flex items-center justify-center transition-colors 
              ${isLoading || isEmpty
                ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent/90'
              }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </div>

        <p className="text-center mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
} 