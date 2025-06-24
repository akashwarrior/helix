"use client";

import { useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import { useScroll, useTransform, MotionValue } from "motion/react";
import { useSectionReveal, useParallaxScroll } from "@/utils/scrollAnimations";

// CSS-based feature animations
function FeatureAnimation({ type }: { type: string }) {
  if (type === "cube") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* AI Neural Network Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Central core */}
            <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse shadow-lg shadow-blue-500/50" />

            {/* Rotating frame */}
            <div className="absolute inset-0 rounded-lg border-2 border-blue-400/30 animate-spin-slow" />
            <div className="absolute inset-2 rounded-lg border-2 border-cyan-400/20 animate-spin-reverse" />

            {/* Neural connections */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{
                  top: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                  left: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "sphere") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 3D Sphere Effect */}
        <div className="relative w-32 h-32">
          {/* Gradient sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 animate-pulse-slow shadow-2xl shadow-purple-500/50" />

          {/* Orbital rings */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-spin-slow transform rotateX-45" />
          <div className="absolute inset-0 rounded-full border-2 border-pink-400/20 animate-spin-reverse transform rotateY-45" />

          {/* Glowing particles */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full animate-float"
                style={{
                  top: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  left: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-white/20 to-transparent blur-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Deploy Rocket Effect */}
      <div className="relative w-40 h-32">
        {/* Rocket body */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-full animate-bounce shadow-lg shadow-cyan-500/50" />

        {/* Exhaust flames */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4">
          <div className="w-6 h-8 bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent rounded-b-full blur-sm animate-pulse" />
          <div className="absolute inset-0 w-6 h-8 bg-gradient-to-t from-red-500 via-orange-500 to-transparent rounded-b-full blur-md animate-pulse-slow" />
        </div>

        {/* Cloud ring */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-32 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-xl animate-pulse" />
        </div>

        {/* Stars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Design",
    description: "Let our AI assistant help you create stunning layouts with smart suggestions and auto-optimization",
    icon: "cube",
    gradient: "from-blue-600 to-cyan-600",
    shadowColor: "rgba(59, 130, 246, 0.5)",
    status: "In Development",
    progress: 75,
  },
  {
    title: "3D Components",
    description: "Drag-and-drop 3D elements, animations, and interactive components without coding",
    icon: "sphere",
    gradient: "from-purple-600 to-pink-600",
    shadowColor: "rgba(168, 85, 247, 0.5)",
    status: "Beta Testing",
    progress: 90,
  },
  {
    title: "One-Click Deploy",
    description: "Deploy to the edge with automatic SSL, CDN, and performance optimization built-in",
    icon: "torus",
    gradient: "from-cyan-600 to-blue-600",
    shadowColor: "rgba(6, 182, 212, 0.5)",
    status: "Coming Soon",
    progress: 60,
  },
];

// Separate component for feature cards to use hooks properly
function FeatureCard({ feature, index, progressScale }: {
  feature: typeof features[0],
  index: number,
  progressScale: MotionValue<number>
}) {
  return (
    <m.div
      className="group relative"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 glass-card glass-card-hover z-20`} />

      {/* Glass card with enhanced styling */}
      <m.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative h-full p-8 lg:p-10 transition-all duration-300 glass-card"
      >
        {/* Status badge */}
        <m.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          className="absolute top-4 right-4"
        >
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold 
                ${feature.status === "Beta Testing"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : feature.status === "In Development"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}
          >
            {feature.status}
          </span>
        </m.div>

        {/* CSS Animation Container */}
        <div className="relative h-40 md:h-48 mb-8 -mx-4">
          <FeatureAnimation type={feature.icon} />

          {/* Glow effect background */}
          <m.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${feature.shadowColor} 0%, transparent 70%)`,
              filter: "blur(40px)",
              transform: "translateZ(0)",
              zIndex: -1,
            }}
          />
        </div>

        {/* Text Content */}
        <h3 className={`text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
          {feature.title}
        </h3>
        <p className="text-slate-400 leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Progress indicator with scroll animation */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">
              Development Progress
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {feature.progress}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <m.div
              style={{
                scaleX: progressScale,
                transformOrigin: "left"
              }}
              className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full`}
            />
          </div>
        </div>
      </m.div>
    </m.div>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Main section reveal animation
  const { y: sectionY, opacity: sectionOpacity } = useSectionReveal(sectionRef);

  // Parallax for background elements
  const bgLeftRef = useRef<HTMLDivElement>(null);
  const bgRightRef = useRef<HTMLDivElement>(null);
  const { y: bgLeftY } = useParallaxScroll(bgLeftRef);
  const { y: bgRightY } = useParallaxScroll(bgRightRef);

  // Progress bars animation
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 80%", "center center"],
  });

  const progressScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  if (!render) return null;

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with scroll animations */}
          <m.div
            style={{ y: sectionY, opacity: sectionOpacity }}
            className="text-center mb-16 md:mb-20"
          >
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide">
                FEATURES IN DEVELOPMENT
              </span>
            </m.div>
            <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <m.span
                initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1 }}
                className="gradient-text"
              >
                Build Without Limits
              </m.span>
            </h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto"
            >
              Everything you need to create modern, interactive websites. No
              coding required, just pure creativity.
            </m.p>
          </m.div>

          {/* Features Grid with scroll animations */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} progressScale={progressScale} />
            ))}
          </div>

          {/* Coming Soon Features with scroll animations */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <h3 className="text-xl font-semibold text-slate-400 mb-8">
              More Features Coming Soon
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: "🎨", name: "Template Library", status: "Q2 2024" },
                { icon: "👥", name: "Team Collaboration", status: "Q2 2024" },
                {
                  icon: "📊",
                  name: "Analytics Dashboard",
                  status: "Q3 2024",
                },
                { icon: "🔌", name: "Plugin Ecosystem", status: "Q3 2024" },
                { icon: "🌍", name: "Multi-language", status: "Q2 2024" },
                { icon: "📱", name: "Mobile Editor", status: "Q4 2024" },
                { icon: "🔒", name: "Advanced Security", status: "Q3 2024" },
                { icon: "⚡", name: "AI Content Gen", status: "Q4 2024" },
              ].map((item, index) => (
                <m.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="glass-card p-4 text-center cursor-pointer group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-slate-300">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {item.status}
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </div>

      {/* Decorative elements with parallax */}
      <m.div
        ref={bgLeftRef}
        style={{ y: bgLeftY }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]"
      />
      <m.div
        ref={bgRightRef}
        style={{ y: bgRightY }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]"
      />
    </section>
  );
}
