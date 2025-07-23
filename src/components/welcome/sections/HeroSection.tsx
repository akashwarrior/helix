"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-600/5 via-purple-600/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center mt-20">
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-foreground">Build with </span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Flow
          </span>
          <br />
          <span className="text-foreground">Not </span>
          <span className="text-muted-foreground">Friction</span>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Helix is the definitive platform for crafting beautifully animated,
          high-performance websites. Go from idea to interactive in record time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link href="/auth">
            <Button
              size="lg"
              className="text-lg px-10 py-4 h-auto rounded-full hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Enhanced visual elements */}
        <motion.div
          className="absolute top-0 left-0 w-32 h-32 border border-border/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 border border-border/30 rounded-full"
          animate={{
            rotate: [360, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </section>
  );
}
