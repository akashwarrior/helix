"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Great Animations are </span>
            <span className="text-red-400">Hard</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Juggling complex libraries, fighting performance issues, and endless tweaking.
            Building fluid web experiences is a constant battle between creativity and code.
          </p>
        </motion.div>

        {/* Visual representation of complexity */}
        <motion.div
          className="relative h-96 overflow-hidden rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20" />

          {/* Chaotic lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            {[...Array(15)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${i * 50} ${200 + Math.sin(i) * 100} Q${400 + i * 20} ${100 + Math.cos(i) * 50} ${800 - i * 30} ${200 + Math.sin(i + 1) * 80}`}
                stroke={i % 2 === 0 ? "#ef4444" : "#f97316"}
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Glitch effect text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-2xl font-mono text-red-400"
              animate={isInView ? {
                x: [0, -2, 2, -2, 0],
                textShadow: [
                  "0 0 0 rgba(239, 68, 68, 0)",
                  "2px 2px 0 rgba(239, 68, 68, 0.5)",
                  "-2px -2px 0 rgba(249, 115, 22, 0.5)",
                  "2px -2px 0 rgba(239, 68, 68, 0.5)",
                  "0 0 0 rgba(239, 68, 68, 0)"
                ]
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              ERROR: Too Complex
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 