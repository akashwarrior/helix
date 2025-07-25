"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

function FloatingParticles() {
  return [...Array(10)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 will-change-transform"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [-20, -100],
      }}
      transition={{
        duration: 3,
        delay: 1 + i * 0.2,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    />
  ));
}

export default function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-600/5 via-purple-600/5 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-foreground">Helix Makes it </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Fluid
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our platform abstracts away the complexity. With intuitive tools and
            a performance-first architecture, you can design and ship stunning
            animations with ease.
          </p>
        </motion.div>

        <motion.div
          className="relative h-96 overflow-hidden rounded-2xl will-change-transform"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10" />

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {[0, 1].map((strand) => (
              <motion.path
                key={strand}
                d={`M 0 ${200} 
                    Q 100 ${strand === 0 ? 100 : 300} 200 ${200}
                    T 400 ${200}
                    Q 500 ${strand === 0 ? 300 : 100} 600 ${200}
                    T 800 ${200}`}
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{
                  duration: 2,
                  delay: 0.5 + strand * 0.2,
                  ease: "easeOut",
                }}
                className="will-change-transform"
              />
            ))}

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            className="absolute inset-0 flex items-center justify-center text-2xl font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Effortless Flow
            </span>
          </motion.div>

          {isInView && <FloatingParticles />}

          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/20 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
