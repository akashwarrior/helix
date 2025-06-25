"use client";

import { useEffect, useState } from "react";
import { domAnimation, LazyMotion } from "motion/react";

const starCounts = {
  large: 15,
  medium: 30,
  small: 100,
  shooting: 3
};

export default function CosmicBackground({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="fixed inset-0 -z-20 transition-opacity duration-1000 opacity-100">
          <div className="absolute inset-0 overflow-hidden">
            {/* Large stars with performance optimization */}
            {[...Array(starCounts.large)].map((_, i) => (
              <div
                key={`star-large-${i}`}
                className={`absolute w-1 h-1 bg-blue-100 rounded-full animate-twinkle`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  transform: 'translateZ(0)',
                  willChange: 'opacity, transform',
                }}
              >
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm" />
              </div>
            ))}

            {/* Medium stars - reduced animation on mobile */}
            {[...Array(starCounts.medium)].map((_, i) => (
              <div
                key={`star-medium-${i}`}
                className={`absolute w-[0.5px] h-[0.5px] bg-cyan-200 rounded-full animate-pulse`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  transform: 'translateZ(0)',
                }}
              />
            ))}

            {/* Small stars (static) - reduced count on mobile */}
            {[...Array(starCounts.small)].map((_, i) => (
              <div
                key={`star-small-${i}`}
                className="absolute w-[0.3px] h-[0.3px] bg-slate-500 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.5,
                  transform: 'translateZ(0)',
                }}
              />
            ))}
          </div>

          {/* Shooting stars - reduced on mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(starCounts.shooting)].map((_, i) => (
              <div
                key={`shooting-star-${i}`}
                className="absolute h-[1px] w-20 animate-shooting-star"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 7 + Math.random() * 5}s`,
                  animationDuration: '3s',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <LazyMotion features={domAnimation}>
        {children}
      </LazyMotion>
    </>
  );
}
