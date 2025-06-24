"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domAnimation, LazyMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export default function CosmicBackground({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  // Reduce number of elements on mobile
  const starCounts = {
    large: isMobile ? 5 : 15,
    medium: isMobile ? 10 : 30,
    small: isMobile ? 30 : 100,
    shooting: isMobile ? 1 : 3
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="fixed inset-0 -z-20 transition-opacity duration-1000 opacity-100">
          <div className="absolute inset-0 overflow-hidden">
            {/* Large stars with performance optimization */}
            {[...Array(starCounts.large)].map((_, i) => (
              <div
                key={`star-large-${i}`}
                className={`absolute w-1 h-1 bg-blue-100 rounded-full ${isMobile ? '' : 'animate-twinkle'}`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  transform: 'translateZ(0)',
                  willChange: isMobile ? 'auto' : 'opacity, transform',
                }}
              >
                {!isMobile && (
                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm" />
                )}
              </div>
            ))}

            {/* Medium stars - reduced animation on mobile */}
            {[...Array(starCounts.medium)].map((_, i) => (
              <div
                key={`star-medium-${i}`}
                className={`absolute w-[0.5px] h-[0.5px] bg-cyan-200 rounded-full ${isMobile ? 'opacity-60' : 'animate-pulse'}`}
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
          {!isMobile && (
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
          )}
        </div>
      </div>
      <LazyMotion features={domAnimation}>
        {children}
      </LazyMotion>
    </>
  );
}
