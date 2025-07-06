"use client";

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-4">
            <span className="text-foreground">Built for </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Modern Web
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to create stunning, interactive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group bg-card/50 rounded-2xl overflow-hidden p-8 h-full transition-transform duration-300 hover:scale-105 border border-border/50">

              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-all duration-500`} />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">
                  <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                {feature.id === 1 && (
                  <div className="mt-6 w-full h-3 bg-muted/50 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full w-2/3 group-hover:w-full transition-all duration-1000" />
                  </div>
                )}

                {feature.id === 2 && (
                  <div className="mt-6 flex gap-2">
                    <div className="w-6 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm group-hover:h-6 transition-all duration-500" />
                    <div className="w-6 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm group-hover:h-8 transition-all duration-700" />
                    <div className="w-6 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm group-hover:h-12 transition-all duration-600" />
                    <div className="w-6 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm group-hover:h-12 transition-all duration-800" />
                    <div className="w-6 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm group-hover:h-8 transition-all duration-500" />
                  </div>
                )}

                {feature.id === 3 && (
                  <div className="mt-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg relative overflow-hidden group-hover:rotate-x-12 group-hover:rotate-y-180 transition-transform duration-[600ms]">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 opacity-50" />
                    <div className="absolute inset-1 bg-gradient-to-br from-purple-400 to-pink-400 rounded-md" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 