"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RotateCcw, ArrowLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  const errorMessage = error?.message || "Something unexpected happened";
  const isNetworkError = errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch');
  const isServerError = errorMessage.toLowerCase().includes('server') ||
    error?.digest;

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex items-center justify-center">
      <div className="home-container fixed inset-0 z-0 overflow-hidden" />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        <div className="bg-card/60 supports-[backdrop-filter]:bg-card/70 border rounded-2xl p-8 backdrop-blur-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={32} className="text-destructive" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold mb-4 tracking-tight"
          >
            Something went wrong
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {isNetworkError
                ? "Connection issue detected. Please check your internet and try again."
                : isServerError
                  ? "Our servers are having a moment. We're working to fix this."
                  : "Don't worry, this happens sometimes. Let's get you back on track."
              }
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-4 p-4 bg-muted/50 rounded-lg">
                <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 text-xs text-muted-foreground font-mono break-all">
                  <div><strong>Error:</strong> {error?.name || 'Unknown'}</div>
                  <div><strong>Message:</strong> {errorMessage}</div>
                  {error?.digest && <div><strong>Digest:</strong> {error.digest}</div>}
                  {error?.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Go Home
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Still having trouble?{" "}
            <a 
              href="https://x.com/skyGuptaCS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Contact support
            </a>
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}