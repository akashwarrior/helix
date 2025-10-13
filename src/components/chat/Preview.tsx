"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";


export default function Preview({ url }: { url: string }) {
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current && url) {
      setError(null)
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = url
        }
      }, 10)
    }
  }

  useEffect(() => {
    refreshIframe()
  }, [url])

  const handleIframeLoad = () => setError(null)
  const handleIframeError = () => setError('Failed to load the page')

  return (
    <div className="h-full flex flex-col border relative overflow-hidden">
      <div className="flex-1 bg-white relative overflow-hidden flex">
        {!url ? (
          <div className="flex flex-col items-center m-auto">
            <Loader2 size={34} className="text-blue-600 animate-spin mb-6" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Refreshing Preview
            </h3>
            <p className="text-sm text-gray-600">Loading Your App</p>
          </div>
        ) : error ? (
          <div className="h-full flex-1 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
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
        ) : (
          <div className="relative w-full flex-1 h-full">
            <iframe
              ref={iframeRef}
              src={url}
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
