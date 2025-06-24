"use client";

import * as m from "motion/react-m";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    // @ts-expect-error - m.button is not typed
    <m.button
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      disabled={loading || disabled}
      className={`relative h-fit ${className} ${loading ? "cursor-not-allowed opacity-80" : ""}`}
      {...props}
    >
      <span className={`flex items-center justify-center gap-2 ${loading ? "invisible" : ""}`}>
        {children}
      </span>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </div>
      )}
    </m.button>
  );
} 