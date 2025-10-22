"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSandboxStore } from "@/store/sandbox";
import { AlertCircle, Loader2, Globe, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

export default function Preview() {
  const url = useSandboxStore(state => state.url);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current && url) {
      setError(null)
      setLoading(true)
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = url + inputValue
        }
      }, 10)
    }
  }

  const handleIframeLoad = () => {
    console.log('iframe loaded')
    setError(null);
    setLoading(false);
  }
  
  const handleIframeError = () => {
    setError('Failed to load the page');
    setLoading(false);
  }

  return (
    <>
      <div className="mx-auto z-50 absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card rounded-lg pl-3 pr-1.5 py-1 min-w-[200px] w-fit border border-neutral-700/50">
        <Globe size={20} className="text-blue-400" />
        <input
          type="text"
          className="text-xs h-6 font-mono border-none outline-none w-full overflow-hidden"
          defaultValue={'/'}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur()
              setInputValue(event.currentTarget.value)
            }
          }}
          disabled={!url}
        />

        <a
          href={url && (url + inputValue)}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in New Tab"
        >
          <Button
            size="icon"
            variant="ghost"
            className="size-6 text-muted-foreground hover:text-foreground/85"
          >
            <ExternalLinkIcon size={12} />
          </Button>
        </a>

        <Button
          size="icon"
          variant="ghost"
          className="size-6 text-muted-foreground hover:text-foreground/85"
          onClick={refreshIframe}
          disabled={loading}
        >
          <RefreshCcwIcon size={12} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>
      <div className="h-full flex flex-col border relative overflow-hidden">
        <div className="flex-1 bg-white relative overflow-hidden flex h-full items-center justify-center">
          {(!url || loading) ? (
            <div className="flex flex-col items-center m-auto">
              <Loader2 size={34} className="text-blue-600 animate-spin mb-6" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Refreshing Preview
              </h3>
              <p className="text-sm text-gray-600">Loading Your App</p>
            </div>
          ) : error && (
            <div className="w-full h-full flex-1 flex items-center justify-center bg-linear-to-br from-red-50 to-red-100">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Preview Error
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {error}
                </p>
                <Button
                  onClick={refreshIframe}
                  variant="destructive"
                  className="shadow-lg"
                  asChild
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {url && !error && (
            <iframe
              ref={iframeRef}
              src={url + inputValue}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Browser content"
              className={cn("w-full h-full border-none", loading && "hidden")}
            />
          )}
        </div>
      </div>
    </>
  );
}
