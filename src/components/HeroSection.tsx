"use client";

import { useState, useEffect } from "react";
import * as m from "motion/react-m";
import { LazyMotion, domAnimation } from "motion/react";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const launchDate = new Date("2025-07-11");

    function updateCountdown() {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        clearInterval(interval);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      >
        <div className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Coming Soon Badge */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center w-fit mx-auto gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-400">
              Launching Soon
            </span>
          </m.div>

          {/* Decorative elements with scroll animations */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />

          {/* Main title with enhanced styling */}
          <div className="mb-6 relative">
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold gradient-text leading-[0.9] tracking-tighter">
              {[..."HELIX"].map((char, idx) => (
                <m.span
                  key={idx}
                  className="inline-block"
                  initial={{ opacity: 0, y: 30, rotateX: -45, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{
                    delay: idx * 0.08,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1.2,
                    duration: 0.8,
                  }}
                >
                  {char}
                </m.span>
              ))}
            </span>
            <m.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-slate-400 mt-4 tracking-wide"
            >
              The Future of{" "}
              <span className="text-gradient-blue">Website Building</span>
            </m.span>
          </div>

          {/* Subtitle with better typography */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Create stunning{" "}
            <span className="text-white font-medium">3D websites</span> with
            AI-powered design,
            <br className="hidden sm:block" />
            drag-and-drop simplicity, and cosmic creativity
          </m.p>

          {/* Launch Countdown */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center gap-4 md:gap-8 mb-10"
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
            ].map((item, index) => (
              <m.div
                key={item.label}
                className="text-center glass-card px-4 py-3 md:px-6 md:py-4 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  {item.value}
                </div>
                <div className="text-xs md:text-sm text-slate-600">
                  {item.label}
                </div>
              </m.div>
            ))}
          </m.div>

          {/* Pre-launch Stats */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="gap-8 mb-10 text-sm"
          >
            <div className="text-2xl font-bold text-gradient-blue mb-1">
              100+
            </div>
            <div className="text-slate-600">Early Access Requests</div>
          </m.div>

          {/* CTA Buttons with enhanced design */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full sm:w-auto min-w-[200px] shimmer group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Early Access
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
            </m.button>

            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary w-full sm:w-auto min-w-[200px] group"
            >
              <span className="flex items-center gap-2">
                Watch Preview
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </m.button>
          </m.div>
        </div>

        {/* glow effects with scroll animations - optimized for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-48 h-48 md:w-96 md:h-96 will-change-transform">
            <div className="w-full h-full bg-blue-600/20 rounded-full blur-[60px] md:blur-[100px]" />
            <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-[40px] md:blur-[80px] scale-75" />
          </div>
          <div className="absolute bottom-[20%] left-[10%] w-48 h-48 md:w-96 md:h-96 will-change-transform">
            <div className="w-full h-full bg-purple-600/20 rounded-full blur-[60px] md:blur-[100px]" />
            <div className="absolute inset-0 bg-pink-400/10 rounded-full blur-[40px] md:blur-[80px] scale-75" />
          </div>
        </div>
      </m.section>
    </LazyMotion>
  );
}
