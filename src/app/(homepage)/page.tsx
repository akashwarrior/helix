'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { Upload, Sparkles, Send, X, RotateCcw, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// Types
interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

interface ErrorState {
  type: 'network' | 'auth' | 'validation' | 'server' | null;
  message: string;
}

export default function HelixApp() {
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = authClient.useSession();

  const { append, status, setMessages } = useChat({
    api: '/api/enhance',
    onResponse(response) {
      if (!response.ok) {
        if (response.status === 401) {
          setError({ type: 'auth', message: 'Please sign in to continue' });
          return;
        }
        setError({ type: 'server', message: 'Failed to enhance prompt. Please try again.' });
        return;
      }

      const body = response.clone().body;
      const decoder = new TextDecoder();
      let text = '';
      const textarea = textAreaRef.current;
      if (!textarea) return;
      textarea.value = '';

      // get the text from the response stream
      body?.pipeTo(new WritableStream({
        write(chunk) {
          text = decoder
            .decode(chunk)
            .split('0:"')[1]?.split('"')[0]?.replace(/\\n/g, '\n');
          if (text) {
            textarea.value += text;
            handleTextAreaChange();
          }
        }
      })).catch((err) => {
        console.error('Stream processing error:', err);
        setError({ type: 'network', message: 'Connection error. Please try again.' });
      });
    },
    onFinish: () => {
      textAreaRef.current?.focus();
      setError({ type: null, message: '' });
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setError({ type: 'server', message: 'Something went wrong. Please try again.' });
    }
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [error, setError] = useState<ErrorState>({ type: null, message: '' });
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<'enhance' | 'submit' | null>(null);

  const originalPromptRef = useRef<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';
  const isAuthenticated = !!session?.user;

  const handleTextAreaChange = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 288)}px`;
    textarea.scrollTop = textarea.scrollHeight;
    setIsEmpty(textarea.value.trim() === '');

    // Clear errors when user types
    if (error.type) {
      setError({ type: null, message: '' });
    }
  };

  const handleEnhancePrompt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setAuthModalAction('enhance');
      return;
    }

    const input = textAreaRef.current?.value.trim();

    if (!input) {
      setError({ type: 'validation', message: 'Please enter a prompt to enhance' });
      return;
    }

    if (isLoading) return;

    try {
      setMessages([]);
      originalPromptRef.current = input;
      setError({ type: null, message: '' });

      await append({
        role: 'user',
        content: input
      });
    } catch (error) {
      console.error('Enhance error:', error);
      setError({ type: 'server', message: 'Failed to enhance prompt. Please try again.' });
    }
  };

  const handleRevert = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.value = originalPromptRef.current ?? '';
    handleTextAreaChange();
    originalPromptRef.current = null;
    setError({ type: null, message: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (uploadedImages.length + files.length > maxFiles) {
      setError({ type: 'validation', message: `You can only upload up to ${maxFiles} images` });
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError({ type: 'validation', message: 'Please upload only image files' });
        return;
      }

      if (file.size > maxSize) {
        setError({ type: 'validation', message: 'Image size must be less than 10MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, {
          id: `${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          name: file.name
        }]);
      };
      reader.onerror = () => {
        setError({ type: 'server', message: 'Failed to process image. Please try again.' });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setAuthModalAction('submit');
      return;
    }

    const input = textAreaRef.current?.value.trim();

    if (!input) {
      setError({ type: 'validation', message: 'Please enter a prompt to submit' });
      return;
    }

    if (isFinalSubmitting) return;

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

      if (!response.ok) {
        if (response.status === 401) {
          setError({ type: 'auth', message: 'Please sign in to continue' });
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.chatId) {
        router.push(`/chat/${data.chatId}`);
      } else {
        throw new Error('No chat ID returned');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError({
        type: 'server',
        message: 'Failed to create chat. Please try again.'
      });
    } finally {
      setIsFinalSubmitting(false);
    }
  };

  const handleSignIn = () => router.push('/auth');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl h-full px-4 flex flex-col items-center justify-center mx-auto gap-12 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
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

          {/* Auth status indicator */}
          {!isAuthLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              {isAuthenticated ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-300">Signed in as {session.user.email}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 border border-neutral-700 rounded-full">
                  <LogIn size={14} className="text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    <button
                      onClick={handleSignIn}
                      className="underline hover:no-underline transition-all hover:text-white"
                    >
                      Sign in
                    </button> to unlock all features
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="w-full">
          {/* Error Display */}
          <AnimatePresence>
            {error.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-lg flex items-center gap-3 bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">
                  {error.message}
                </p>
                <button
                  onClick={() => setError({ type: null, message: '' })}
                  className="ml-auto p-1 rounded transition-colors hover:bg-red-500/20"
                >
                  <X size={16} className="text-red-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Images Preview */}
          <AnimatePresence>
            {uploadedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-neutral-300">
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} attached
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {5 - uploadedImages.length} remaining
                  </span>
                </div>

                {/* Images Grid */}
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group"
                    >
                      {/* Image Container */}
                      <div className="relative w-14 h-14 rounded-lg bg-neutral-800/50 border border-neutral-700/50 group-hover:border-neutral-600/80 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-neutral-900/20">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover transition-transform duration-200 rounded-lg"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                        {/* Remove Button */}
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/90 hover:scale-110 border border-neutral-600/50"
                          title="Remove image"
                        >
                          <X size={10} className="stroke-[2.5]" />
                        </button>

                        {/* File Name Tooltip */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-neutral-900/90 backdrop-blur-sm rounded text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-neutral-600/30 whitespace-nowrap pointer-events-none z-10">
                          {image.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Container */}
          <div className="relative rounded-2xl transition-all duration-300 bg-neutral-900 border border-neutral-800 focus-within:border-neutral-700 p-4">
            <textarea
              ref={textAreaRef}
              onChange={handleTextAreaChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFinalSubmit(e);
                }
              }}
              placeholder="Describe your website or app idea..."
              disabled={isLoading || isFinalSubmitting}
              className="w-full placeholder-muted-foreground focus:outline-none resize-none leading-relaxed bg-transparent transition-all min-h-[60px] max-h-64 disabled:opacity-50"
              style={{ transition: 'height 0.1s ease-out' }}
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-4 top-4 flex space-x-1">
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
                    className="w-1.5 h-1.5 bg-accent rounded-full"
                  />
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isFinalSubmitting}
                  className="p-2 rounded-lg hover:bg-neutral-800 transition-all duration-150 disabled:opacity-50 group"
                  title="Upload images (max 5, 10MB each)"
                >
                  <Upload size={18} className="text-muted-foreground group-hover:text-white" />
                </button>

                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEmpty || isLoading || isFinalSubmitting}
                  className="p-2 rounded-lg hover:bg-neutral-800 transition-all duration-150 disabled:opacity-50 group"
                  title="Enhance prompt with AI"
                >
                  <Sparkles size={18} className={`transition-colors ${isLoading ? 'text-accent animate-pulse' : 'text-muted-foreground group-hover:text-white'}`} />
                </button>

                <AnimatePresence>
                  {originalPromptRef.current && !isLoading && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleRevert}
                      className="p-2 rounded-lg hover:bg-neutral-800 transition-all duration-150 group"
                      title="Revert to original prompt"
                    >
                      <RotateCcw size={18} className="text-muted-foreground group-hover:text-white" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isEmpty || isLoading || isFinalSubmitting}
                className="px-6 py-2 rounded-lg flex items-center gap-2 bg-accent hover:bg-accent/90 text-white transition-all duration-150 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                {isFinalSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                <span className="text-sm font-medium">
                  {isFinalSubmitting ? 'Creating...' : 'Start Building'}
                </span>
              </button>
            </div>
          </div>

          {/* Help text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 text-sm text-muted-foreground"
          >
            Press <kbd className="px-1.5 py-0.5 text-xs bg-neutral-800 rounded">Enter</kbd> to submit,
            <kbd className="px-1.5 py-0.5 text-xs bg-neutral-800 rounded ml-1">Shift + Enter</kbd> for new line
          </motion.p>
        </div>
      </motion.div>

      {/* Authentication Modal */}
      <AnimatePresence>
        {authModalAction !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setAuthModalAction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-[400px] w-full shadow-2xl"
            >
              <div className="text-center">
                {/* Brand */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-white">Helix</h1>
                </div>

                {/* Content */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-white mb-2">
                    To continue, please sign in
                  </h2>
                  <p className="text-sm text-neutral-400">
                    {authModalAction === 'enhance'
                      ? 'Enhance your prompt with AI assistance'
                      : 'Start building your website'
                    }
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setAuthModalAction(null)}
                    className="w-full bg-transparent text-neutral-400 font-medium py-3 px-6 rounded-lg hover:bg-neutral-800 transition-all duration-200 text-sm border border-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}