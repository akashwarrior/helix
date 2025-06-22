"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <div className="mb-8">
            <m.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#errorGradient)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                />
                <defs>
                  <linearGradient
                    id="errorGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
            </m.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-400 text-lg mb-8">
              We encountered an unexpected error. Don&apos;t worry, our team has
              been notified.
            </p>
          </div>

          <div className="space-x-4">
            <button onClick={reset} className="btn-primary">
              Try again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="btn-secondary"
            >
              Go home
            </button>
          </div>

          {/* Error details in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-red-950/20 border border-red-900/50 rounded-lg text-left">
              <p className="text-red-400 font-mono text-sm break-all">
                {error?.message}
              </p>
            </div>
          )}
        </m.div>
      </div>
    </LazyMotion>
  );
}
