"use client";

import { useRef, useState } from "react";
import { Group } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import * as m from "motion/react-m";
import ComingSoonModal from "./ui/ComingSoonModal";

function NeuralNetwork() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.5} />
      </Sphere>

      {/* Orbiting elements */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 6;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <group key={i}>
            <Box args={[0.3, 0.3, 0.3]} position={[x, y, 0]}>
              <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.3} />
            </Box>
            <Torus args={[0.5, 0.1, 16, 32]} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.2} opacity={0.5} transparent />
            </Torus>
          </group>
        );
      })}
    </group>
  );
}

const items = [
  {
    title: 'AI-Powered Design',
    description: 'Transform ideas into reality with neural networks trained on millions of designs',
    icon: '🤖',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Infinite Possibilities',
    description: 'Generate unlimited variations and explore creative dimensions',
    icon: '✨',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Real-time Processing',
    description: 'Experience instant feedback with GPU-accelerated computations',
    icon: '⚡',
    gradient: 'from-cyan-600 to-blue-600'
  }
]

export default function NeuralSection() {
  const [showTechModal, setShowTechModal] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

      {/* Neural Network 3D Background */}
      <div className="absolute inset-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <NeuralNetwork />
        </Canvas>
      </div>

      {/* Floating glow effects */}
      <m.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
      />
      <m.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 text-sm font-bold tracking-wider border border-purple-500/30 backdrop-blur-sm">
              🧠 NEURAL ARCHITECTURE
            </span>
          </m.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">
              Neural Architecture
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Powered by advanced neural networks that understand your creative vision
            and transform it into stunning 3D experiences
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {items.map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              <div className="relative glass-card glass-card-hover rounded-2xl p-8 text-center h-full">
                {/* Icon */}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className={`text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
              </div>
            </m.div>
          ))}
        </m.div>

        {/* Bottom CTA */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTechModal(true)}
            className="btn-primary group"
          >
            <span className="flex items-center gap-2">
              Explore the Technology
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </m.button>
        </m.div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showTechModal}
        onClose={() => setShowTechModal(false)}
        title="AI Technology Deep Dive"
        description="Discover how our proprietary AI engine transforms natural language into production-ready code. Learn about our neural networks, optimization algorithms, and the future of web development."
        icon={
          <svg
            className="w-10 h-10 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </section>
  );
} 