"use client";

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

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

export default function FeaturesSectionAlt() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-4">
            <span className="text-white">Built for </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Modern Web
            </span>
          </h2>
          <p className="text-xl text-slate-300">
            Everything you need to create stunning, interactive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="glass-card p-8 h-full transition-all duration-300 hover:scale-105">
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-2xl`}
                  animate={{
                    opacity: hoveredFeature === feature.id ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">
                  <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </span>
                </h3>
                <p className="text-slate-400">{feature.description}</p>

                {/* Interactive element */}
                {feature.id === 1 && (
                  <motion.div
                    className="mt-6 w-full h-2 bg-slate-800 rounded-full overflow-hidden"
                    animate={{
                      opacity: hoveredFeature === feature.id ? 1 : 0.5,
                    }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                      animate={{
                        x: hoveredFeature === feature.id ? "0%" : "-100%",
                      }}
                      transition={{ duration: 1 }}
                    />
                  </motion.div>
                )}

                {feature.id === 2 && (
                  <div className="mt-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-16 bg-gradient-to-t from-blue-400 to-purple-400 rounded"
                        animate={{
                          height: hoveredFeature === feature.id
                            ? `${40 + Math.sin(Date.now() / 200 + i) * 20}px`
                            : "40px",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                )}

                {feature.id === 3 && (
                  <motion.div
                    className="mt-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"
                    animate={{
                      rotateY: hoveredFeature === feature.id ? 180 : 0,
                      rotateX: hoveredFeature === feature.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 