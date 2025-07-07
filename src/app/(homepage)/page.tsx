'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/lib/type';
import { X, Upload, Sparkles, RotateCcw, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { ImageDragContainer, ImageUploadTrigger } from '@/components/home/ImageDrag';

const AuthDialog = dynamic(() => import('@/components/home/AuthDialog'), { ssr: false });

export default function HelixApp() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { append, status, setMessages } = useChat({
    api: '/api/enhance',
    onResponse(response) {
      if (!response.ok) {
        setError({ type: 'server', message: 'Failed to enhance prompt, please try again' });
        return;
      }

      const textarea = textAreaRef.current;
      if (!textarea) return;

      const body = response.clone().body;
      const decoder = new TextDecoder();

      let text = '';
      textarea.value = '';

      // get the text from the response stream
      body?.pipeTo(new WritableStream({
        write(chunk) {
          text = decoder.decode(chunk);
          if (text[0] !== '0' || text[1] !== ':' || text[2] !== '"') return;

          textarea.value += text.substring(3, text.length - 2);
          handleTextAreaChange(textarea);
        }
      }))
    },
    onFinish: () => textAreaRef.current?.focus(),
    onError: () => setError({ type: 'server', message: 'Something went wrong, please try again' })
  });

  const [error, setError] = useState<ErrorState>({ type: null, message: '' });
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const originalPromptRef = useRef<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const authButtonRef = useRef<HTMLButtonElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';
  const isAuthenticated = !!session?.user;


  const handleTextAreaChange = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 80), 288);
    textarea.style.height = `${newHeight}px`;
    textarea.scrollTop = textarea.scrollHeight;

    const newIsEmpty = textarea.value.trim() === '';
    setIsEmpty(newIsEmpty);

    if (error.type) setError({ type: null, message: '' });
  };

  const handleEnhancePrompt = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }

    if (isLoading) return;

    const input = textAreaRef.current?.value.trim();
    if (!input) {
      setError({ type: 'validation', message: 'Please enter a prompt to enhance' });
      return;
    }

    try {
      setMessages([]);
      originalPromptRef.current = input;
      setError({ type: null, message: '' });
      console.log('submitting', isAuthenticated);

      await append({
        role: 'user',
        content: input
      });
    } catch {
      setError({ type: 'server', message: 'Failed to enhance prompt, please try again' });
    }
  };

  const handleRevert = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.value = originalPromptRef.current ?? '';
    handleTextAreaChange(textAreaRef.current);
    originalPromptRef.current = null;
    setError({ type: null, message: '' });
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }
    if (isFinalSubmitting) return;

    const input = textAreaRef.current?.value.trim();
    if (!input) {
      setError({ type: 'validation', message: 'Please enter a prompt to submit' });
      return;
    }

    setIsFinalSubmitting(true);
    setError({ type: null, message: '' });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          chatId: null
        })
      });

      const { chatId } = await response.json();
      if (!response.ok || !chatId) throw new Error(`HTTP ${response.status}`);

      router.push(`/chat/${chatId}`);
    } catch {
      setError({ type: 'server', message: 'Failed to create chat, please try again' });
      setIsFinalSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleFinalSubmit();
    }

    // Cmd/Ctrl + E to enhance
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      handleEnhancePrompt();
    }
  };

  const handleSignIn = () => router.push('/auth');

  const openAuthDialog = () => authButtonRef.current?.click();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl h-full px-4 flex flex-col items-center justify-center mx-auto gap-12 overflow-hidden"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Meet Helix
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-md mx-auto"
          >
            Build amazing designs and animated websites with AI assistance
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 dark:text-green-300">Signed in as {session.user.email}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-full text-muted-foreground text-sm backdrop-blur-sm hover:bg-card/70 transition-colors">
                <LogIn size={14} />
                <button
                  onClick={handleSignIn}
                  className="underline hover:no-underline transition-all hover:text-foreground focus:outline-none focus:text-foreground cursor-pointer"
                >
                  Sign in
                </button>
                to unlock all features
              </div>
            )}
          </motion.div>
        </div>

        <div className="w-full">
          {error.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-destructive/10 border border-destructive/20 backdrop-blur-sm"
            >
              <AlertCircle size={20} className="text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">
                {error.message}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setError({ type: null, message: '' })}
                className="ml-auto h-8 w-8 focus:ring-2 focus:ring-destructive/20"
              >
                <X size={16} />
              </Button>
            </motion.div>
          )}

          <ImageDragContainer
            className={cn(
              "relative rounded-2xl transition-all duration-300 bg-card/70 border backdrop-blur-md p-4 pb-2.5 shadow-lg shadow-black/5 dark:shadow-black/10",
              "focus-within:shadow-primary/10 focus-within:shadow-lg"
            )}
            setError={setError}
          >
            <div className="relative">
              <textarea
                autoFocus
                ref={textAreaRef}
                maxLength={5000}
                onChange={(e) => handleTextAreaChange(e.target)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your project idea..."
                className="w-full placeholder-muted-foreground/70 focus:outline-none resize-none leading-relaxed bg-transparent transition-all disabled:opacity-50 text-foreground focus:placeholder-muted-foreground/50 min-h-20"
                disabled={isLoading}
              />

              {isLoading && (
                <div className="absolute right-0 top-0 flex items-center gap-3">
                  <div className="flex space-x-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.div
                        key={delay}
                        animate={{
                          y: [0, -4, 0],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium animate-pulse">
                    {status === 'streaming' ? 'Enhancing...' : 'Processing...'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border/70">
              <div className="flex items-center gap-2">
                <ImageUploadTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    title="Upload images (⌘U)"
                    className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20 group"
                  >
                    <Upload size={18} className="group-hover:scale-105 transition-transform" />
                  </Button>
                </ImageUploadTrigger>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEnhancePrompt}
                  disabled={isEmpty || isLoading}
                  title="Enhance prompt (⌘E)"
                  className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20 group"
                >
                  <Sparkles
                    size={18}
                    className={cn(
                      "transition-all group-hover:scale-105",
                      isLoading && "text-primary animate-pulse"
                    )}
                  />
                </Button>

                {originalPromptRef.current && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRevert}
                      title="Revert to original prompt"
                      className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20 group"
                    >
                      <RotateCcw size={18} className="group-hover:scale-105 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="items-center justify-center gap-4 text-muted-foreground/60 mt-auto text-[10px] font-mono hidden md:flex">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted/40 rounded border border-border/20">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-muted/40 rounded border border-border/20">↵</kbd>
                  <span>submit</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted/40 rounded border border-border/20">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-muted/40 rounded border border-border/20">E</kbd>
                  <span>enhance</span>
                </div>
              </div>

              <Button
                onClick={handleFinalSubmit}
                disabled={isEmpty || isLoading || isFinalSubmitting}
                className="text-sm font-medium transition-all duration-200"
              >
                {isFinalSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Start Building'}
              </Button>
            </div>
          </ImageDragContainer>
        </div>
      </motion.div>

      <AuthDialog
        setAuthModalAction={() => textAreaRef.current?.focus()}
      >
        <Button
          ref={authButtonRef}
          className='hidden'
        />
      </AuthDialog>
    </>
  );
}