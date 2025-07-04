"use client";

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto text-center mt-20">
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-white">Build with </span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Flow
          </span>
          <br />
          <span className="text-white">Not </span>
          <span className="text-slate-400">Friction</span>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
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
          <button
            onClick={() => router.push('#cta')}
            className="btn-primary text-lg px-10 py-4 hover:scale-105 transition-transform duration-200"
          >
            Join the Waitlist
          </button>
        </motion.div>
      </div>
    </section>
  );
}