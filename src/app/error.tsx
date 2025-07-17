"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

function LiquidLoader() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <svg viewBox="0 0 100 100" className="w-full h-full will-change-transform">
        <defs>
          <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 20 50 Q 35 30 50 50 T 80 50"
          stroke="url(#liquid-gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              "M 20 50 Q 35 30 50 50 T 80 50",
              "M 20 50 Q 35 70 50 50 T 80 50",
              "M 20 50 Q 35 30 50 50 T 80 50",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-red-600/10 via-orange-600/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-8 px-6 py-12 bg-card/70 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full border border-destructive/20"
      >
        <div className="flex flex-col items-center gap-3 w-full">
          <LiquidLoader />
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="text-red-500 dark:text-red-400 animate-pulse" size={40} />
            <span className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
              Oops! Error
            </span>
          </motion.div>
          <motion.p
            className="text-lg text-muted-foreground text-center max-w-xs font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Something went wrong. Please try again or return to the homepage.
          </motion.p>
        </div>
        <svg className="w-full h-8 mb-2" viewBox="0 0 400 40" fill="none" preserveAspectRatio="none">
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0 20 Q100 ${10 + i * 5} 200 20 T400 20`}
              stroke={i % 2 === 0 ? "#ef4444" : "#f97316"}
              strokeWidth={2 + i}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 - i * 0.1 }}
              transition={{ duration: 1.5, delay: 0.2 * i }}
            />
          ))}
        </svg>
        <div className="flex gap-4 w-full justify-center mt-2">
          <Button
            size="lg"
            className="rounded-full px-8 py-4 text-lg font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:scale-105 transition-transform"
            onClick={() => reset()}
          >
            Retry
          </Button>
        </div>
      </motion.section>
    </main>
  );
} 