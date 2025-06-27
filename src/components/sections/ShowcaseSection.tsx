"use client";

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useState } from 'react';

const showcaseItems = [
  {
    id: 1,
    title: "Magnetic Button",
    description: "Smooth magnetic hover effect",
    gradient: "from-cyan-500 to-blue-500",
    component: MagneticButton,
  },
  {
    id: 2,
    title: "Morphing Card",
    description: "Shape-shifting on interaction",
    gradient: "from-blue-500 to-purple-500",
    component: MorphingCard,
  },
  {
    id: 3,
    title: "Particle Field",
    description: "Interactive particle system",
    gradient: "from-purple-500 to-pink-500",
    component: ParticleField,
  },
  {
    id: 4,
    title: "3D Product",
    description: "Rotating 3D model showcase",
    gradient: "from-pink-500 to-red-500",
    component: RotatingCube,
  },
  {
    id: 5,
    title: "Liquid Loader",
    description: "Fluid loading animation",
    gradient: "from-orange-500 to-yellow-500",
    component: LiquidLoader,
  },
];

function MagneticButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={buttonRef}
      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Hover Me
    </motion.button>
  );
}


function MorphingCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl cursor-pointer"
      animate={{
        borderRadius: isHovered ? "50%" : "16px",
        rotate: isHovered ? 180 : 0,
      }}
      transition={{ type: "spring", stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
        {isHovered ? "✨" : "Hover"}
      </div>
    </motion.div>
  );
}


function ParticleField() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = { id: Date.now(), x, y };

    setParticles(prev => [...prev.slice(-20), newParticle]);
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{ x: particle.x - 4, y: particle.y - 4, scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setParticles(prev => prev.filter(p => p.id !== particle.id))}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center text-white/50">
        Move your mouse
      </div>
    </div>
  );
}


function RotatingCube() {
  return (
    <motion.div
      className="w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl"
      animate={{
        rotateY: 360,
        rotateX: 360,
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-white font-bold">
        3D
      </div>
    </motion.div>
  );
}


function LiquidLoader() {
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
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


export default function ShowcaseSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [0, -600, -1200]);
  const smoothX = useSpring(x, { damping: 30, stiffness: 100 });

  return (
    <section ref={containerRef} className="relative py-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.h2
          className="text-4xl sm:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">Don&apos;t just build websites</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Build experiences
          </span>
        </motion.h2>
      </div>

      {/* Horizontally scrolling showcase */}
      <div className="relative overflow-x-hidden">
        <motion.div className="relative" style={{ x: smoothX }}>
          <div className="flex gap-6 px-4 pb-8">
            {showcaseItems.map((item, index) => {
              return (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-80 h-96 glass-card p-6 flex flex-col"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    <span className={`bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.title}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400 mb-6">{item.description}</p>

                  <div className="flex-1 flex items-center justify-center">
                    <item.component />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}