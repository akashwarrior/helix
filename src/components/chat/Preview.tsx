"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useSandboxStore } from "@/store/sandbox";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  AlertCircle,
  Loader2,
} from "lucide-react";


export default function Preview() {
  const { status, url } = useSandboxStore();
  const [currentUrl, setCurrentUrl] = useState(url);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(url || '')
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCurrentUrl(url || '');
    setInputValue(url || '');
  }, [url])


  const refreshIframe = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true)
      setError(null)
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl
          setIsLoading(false)
        }
      }, 10)
    }
  }

  const loadNewUrl = () => {
    if (iframeRef.current && inputValue) {
      if (inputValue !== currentUrl) {
        setIsLoading(true)
        setError(null)
        iframeRef.current.src = inputValue
      } else {
        refreshIframe()
      }
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load the page')
  }

  return (
    <div className="h-full flex flex-col border relative overflow-hidden">
      <motion.div
        className="h-12 flex items-center justify-between px-4 border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground/85"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground/85"
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground/85"
              onClick={refreshIframe}
              disabled={isLoading}
            >
              <RotateCcw size={16} className={cn(isLoading && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground/85"
              onClick={() => {
                setCurrentUrl(url || '')
                refreshIframe()
              }}
            >
              <Home size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-2 bg-card rounded-lg pl-3 py-1.5 min-w-[200px] w-max border border-neutral-700/50">
            <Globe size={14} className="text-blue-400" />
            <input
              type="text"
              className="text-xs h-6 font-mono border-none outline-none w-full overflow-visible"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onClick={(event) => event.currentTarget.select()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                  loadNewUrl()
                }
              }}
              disabled={!url}
            />
          </div>
        </div>
      </motion.div>

      <div className="flex-1 bg-white relative overflow-hidden">
        {(!currentUrl || status !== 'running') ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={32} className="text-blue-600" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Refreshing preview...
                </h3>
                <p className="text-sm text-gray-600">Loading your app</p>
              </div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center max-w-md mx-auto p-8">
              <motion.div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <AlertCircle size={32} className="text-red-500" />
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Preview Error
              </motion.h3>
              <motion.p
                className="text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {error}
              </motion.p>
              <Button
                onClick={refreshIframe}
                variant="destructive"
                className="shadow-lg"
                asChild
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Try Again
                </motion.button>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full border-none"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Browser content"
            />
          </div>
        )}
      </div>
    </div>
  );
}
