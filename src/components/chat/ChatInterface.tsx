'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Message, useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { parseXml, StepType } from '@/lib/server/constants';
import { useMessagesStore } from '@/store/messagesStore';
import { useShowWorkBenchStore } from '@/store/showWorkBenchStore';

import {
  ArrowUp,
  RotateCcw,
  Loader2,
  Check,
  ArrowLeft,
  PanelLeftClose,
  FileCode,
  Terminal,
  Folder,
} from 'lucide-react';

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

interface ChatInterfaceProps {
  chatId: string,
  initialMessages: Message[],
}

export default function ChatInterface({ chatId, initialMessages }: ChatInterfaceProps) {
  const router = useRouter();
  const { showWorkBench, setShowWorkBench } = useShowWorkBenchStore();
  const messages = useMessagesStore(state => state.messages);
  const { messages: msgs, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    initialMessages: initialMessages.length === 1 ? [] : initialMessages,
    initialInput: initialMessages.length === 1 ? initialMessages[0].content : '',
    onError: (error) => {
      console.error(error);
    },
    body: {
      chatId: chatId
    },
  });

  const [isEmpty, setIsEmpty] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (!isLoading) return;
    const lastMessage = msgs[msgs.length - 1];
    if (lastMessage?.role === 'assistant') {
      parseXml(lastMessage.content, lastMessage.id, lastMessage.role);
    }
  }, [msgs, isLoading])

  useEffect(() => {
    for (const msg of initialMessages) {
      parseXml(msg.content, msg.id, msg.role);
    }
    if (initialMessages.length === 1) {
      handleSubmit()
    }
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [initialMessages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (messagesEndRef.current) {
        const rect = messagesEndRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 30);
    return () => clearTimeout(timeout);
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setIsEmpty(textarea.value.trim() === '');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isLoading) return;
    textareaRef.current!.value = '';
    handleSubmit(e);
    adjustTextareaHeight();
    await new Promise(resolve => setTimeout(resolve, 100));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlKey = e.ctrlKey || e.metaKey;
    if (isCtrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleChatSubmit(e);
    }
  };

  return (
    <div
      className={cn("overflow-hidden bg-card/70 transition-all duration-300 h-full flex flex-col",
        showWorkBench ? "w-[30%]" : "w-full"
      )}
    >
      <header className="px-3 py-2.5 border-b border-border/50 bg-card/50 shadow-sm flex items-center justify-between gap-3">
        <div className='flex items-center gap-2'>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="font-medium truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            React Todo App
          </h1>
        </div>
        {!showWorkBench &&
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWorkBench(true)}
              className="h-9 w-9"
              title="Show workbench"
            >
              <PanelLeftClose size={16} />
            </Button>
          </motion.div>
        }
      </header>
      <main className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 py-6 flex flex-col gap-6 px-2 max-w-3xl mx-auto w-full">
          {messages.map(({ id, role, content, steps }) => (
            <div
              key={id}
              className={cn("rounded-2xl py-4 px-5",
                role === "user" && "bg-primary/8 max-w-[85%] ml-auto",
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-foreground overflow-hidden truncate">
                {content.trim()}
              </p>

              {steps?.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                    <span className="px-3 py-1 bg-background/80 rounded-full border border-border/50 text-xs">
                      Execution Steps ({steps.length})
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                  </div>

                  <div className="space-y-3">
                    {steps.map(({ stepType, content, path, isPending }, index) => {
                      const isFile = stepType === StepType.CREATE_FILE;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                            isPending
                              ? "bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30"
                              : "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/30 hover:bg-green-50/70 dark:hover:bg-green-950/30"
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-200",
                                isPending
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                                  : "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                              )}
                            >
                              {isPending ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                                />
                              ) : (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Check size={12} />
                                </motion.div>
                              )}
                            </div>

                            {!isPending && (
                              <motion.div
                                className="w-px bg-border/50 mt-2"
                                initial={{ height: 0 }}
                                animate={{ height: 32 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                              {isFile ? (
                                <FileCode size={14} className="text-blue-500 flex-shrink-0" />
                              ) : (
                                <Terminal size={14} className="text-green-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-foreground truncate">
                                {isFile
                                  ? (isPending ? "Creating File" : "File Created")
                                  : (isPending ? "Running Command" : "Command Executed")
                                }
                              </span>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.1 }}
                                className={cn(
                                  "px-2 py-0.5 text-xs rounded-full font-medium ml-auto",
                                  isPending
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                )}
                              >
                                {isPending ? "In Progress" : "Completed"}
                              </motion.div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              {isFile ? (
                                <div className="flex items-center gap-2 font-mono bg-muted/30 px-3 py-2 rounded-md border">
                                  <Folder size={12} className="text-muted-foreground" />
                                  <span className="text-primary break-all font-medium">{path}</span>
                                </div>
                              ) : (
                                <div className="font-mono bg-muted/30 px-3 py-2 rounded-md border text-xs">
                                  <span className="text-green-600 dark:text-green-400 font-bold">$</span>{" "}
                                  <span className="text-foreground/80">{content}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {role === "assistant" && !isLoading && (
                <div className="flex items-center gap-2 mt-4 text-muted-foreground/80">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {/* Add regenerate functionality */ }}
                    className="h-8 w-8 hover:bg-muted/30 focus:ring-2 focus:ring-primary/20"
                    title="Regenerate response"
                  >
                    <RotateCcw size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="p-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "relative rounded-2xl transition-all duration-300 bg-card/70 border backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/10",
            "focus-within:shadow-primary/10 focus-within:shadow-lg focus-within:border-ring/50"
          )}
        >
          <textarea
            name='chat-input'
            ref={textareaRef}
            onChange={(e) => {
              handleInputChange(e);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Helix anything..."
            className="w-full bg-transparent placeholder:text-muted-foreground/70 text-foreground p-4 pr-12 resize-none focus:outline-none min-h-16 max-h-32 leading-relaxed focus:placeholder-muted-foreground/50"
          />

          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              onClick={handleChatSubmit}
              disabled={isLoading || isEmpty}
              className="h-8 w-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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