"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';

const features = [
  {
    id: 1,
    title: "Interactive by Default",
    description: "Every element responds to user input with buttery-smooth animations.",
    color: "from-cyan-400 to-blue-400",
  },
  {
    id: 2,
    title: "Performance, Perfected",
    description: "Hardware-accelerated animations that maintain 60fps on any device.",
    color: "from-blue-400 to-purple-400",
  },
  {
    id: 3,
    title: "Future-Ready (3D)",
    description: "Built-in support for Three.js and WebGL-powered experiences.",
    color: "from-purple-400 to-pink-400",
  },
];

export default function FeaturesSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      // Make features transition more smoothly and evenly
      const adjustedProgress = Math.max(0, Math.min(1, progress * 1.2));
      const featureIndex = Math.min(
        Math.floor(adjustedProgress * features.length),
        features.length - 1
      );
      setActiveFeature(featureIndex);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="space-y-4"
                initial={{ opacity: 0.3, scale: 0.95 }}
                animate={{
                  opacity: activeFeature === index ? 1 : 0.3,
                  scale: activeFeature === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-3xl sm:text-4xl font-bold">
                  <span
                    className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                  >
                    {feature.title}
                  </span>
                </h3>
                <p className="text-lg text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive visualization */}
          <div
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden glass-card"
            onMouseMove={handleMouseMove}
          >
            {/* Background gradient */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, ${
                  activeFeature === 0
                    ? "rgba(34, 211, 238, 0.1)"
                    : activeFeature === 1
                    ? "rgba(129, 140, 248, 0.1)"
                    : "rgba(192, 132, 252, 0.1)"
                } 0%, transparent 70%)`,
              }}
            />

            {/* Dynamic helix visualization */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              {/* Interactive helix for feature 1 */}
              {activeFeature === 0 && (
                <motion.g
                  animate={{
                    rotate: mousePosition.x * 30,
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={200 + Math.cos((i * Math.PI * 2) / 3) * 80}
                      cy={200 + Math.sin((i * Math.PI * 2) / 3) * 80}
                      r="40"
                      fill={`url(#gradient-${i})`}
                      animate={{
                        cx: 200 + Math.cos((i * Math.PI * 2) / 3 + mousePosition.x * 2) * 80,
                        cy: 200 + Math.sin((i * Math.PI * 2) / 3 + mousePosition.y * 2) * 80,
                      }}
                    />
                  ))}
                </motion.g>
              )}

              {/* Performance visualization for feature 2 */}
              {activeFeature === 1 && (
                <motion.g>
                  {[...Array(6)].map((_, i) => (
                    <motion.rect
                      key={i}
                      x={50 + i * 50}
                      y={200}
                      width="30"
                      height="100"
                      fill={`rgba(129, 140, 248, ${0.5 + i * 0.1})`}
                      animate={{
                        height: 100 + Math.sin(Date.now() / 200 + i) * 50,
                        y: 200 - Math.sin(Date.now() / 200 + i) * 25,
                      }}
                      transition={{ duration: 0 }}
                    />
                  ))}
                </motion.g>
              )}

              {/* 3D visualization for feature 3 */}
              {activeFeature === 2 && (
                <motion.g
                  animate={{
                    rotateX: mousePosition.y * 30,
                    rotateY: mousePosition.x * 30,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.path
                    d="M 100 200 Q 200 100 300 200 T 100 200"
                    stroke="url(#gradient-3d)"
                    strokeWidth="3"
                    fill="none"
                    animate={{
                      d: `M 100 200 Q ${200 + mousePosition.x * 50} ${100 + mousePosition.y * 50} 300 200 T 100 200`,
                    }}
                  />
                </motion.g>
              )}

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="gradient-3d" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
} 