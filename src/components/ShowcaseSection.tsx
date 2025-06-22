"use client";

import { gsap } from "gsap";
import { useRef, useState, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as m from "motion/react-m";
import { LazyMotion, domAnimation, useScroll, useTransform } from "motion/react";
import { customEase } from "@/utils/animations";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    icon: "🏢",
    name: "Business",
    templates: 120,
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: "🎓",
    name: "Education",
    templates: 85,
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: "🏥",
    name: "Healthcare",
    templates: 65,
    color: "from-emerald-600 to-green-600",
  },
  {
    icon: "🍔",
    name: "Restaurant",
    templates: 95,
    color: "from-orange-600 to-red-600",
  },
  {
    icon: "🏠",
    name: "Real Estate",
    templates: 75,
    color: "from-indigo-600 to-purple-600",
  },
  {
    icon: "💼",
    name: "Agency",
    templates: 110,
    color: "from-pink-600 to-rose-600",
  },
  {
    icon: "📸",
    name: "Photography",
    templates: 55,
    color: "from-cyan-600 to-blue-600",
  },
  {
    icon: "🎵",
    name: "Music",
    templates: 45,
    color: "from-violet-600 to-purple-600",
  },
];

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  useLayoutEffect(() => {
    // Detect mobile for performance optimizations
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger after all elements are rendered
      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());

      const title = sectionRef.current?.querySelector(".showcase-title");
      if (title) {
        const chars = title.textContent?.split("") || [];
        title.innerHTML = chars
          .map(
            (char) =>
              `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`,
          )
          .join("");

        gsap.fromTo(
          title.querySelectorAll("span"),
          {
            opacity: 0,
            y: isMobile ? 50 : 100,
            rotateX: isMobile ? 0 : -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: isMobile ? 0.6 : 1,
            stagger: isMobile ? 0.01 : 0.02,
            ease: isMobile ? customEase.smooth : customEase.bounce,
            force3D: true,
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            },
          },
        );
      }

      // Industry cards animation with mobile optimization
      gsap.fromTo(
        ".industry-card",
        {
          opacity: 0,
          scale: isMobile ? 0.9 : 0,
          rotateY: isMobile ? 0 : -90,
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: isMobile ? 0.4 : 0.6,
          stagger: {
            each: isMobile ? 0.03 : 0.05,
            from: isMobile ? "start" : "random"
          },
          ease: customEase.smoothOut,
          force3D: true,
          scrollTrigger: {
            trigger: ".industry-grid",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
          },
        },
      );

      // Subtitle animation with mobile optimization
      const subtitle = sectionRef.current?.querySelector('p.text-xl');
      if (subtitle) {
        gsap.fromTo(subtitle,
          {
            opacity: 0,
            y: isMobile ? 20 : 30,
            filter: isMobile ? 'blur(0px)' : 'blur(10px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: isMobile ? 0.6 : 1,
            delay: isMobile ? 0.3 : 0.5,
            ease: customEase.smooth,
            force3D: true,
            scrollTrigger: {
              trigger: subtitle,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            }
          }
        );
      }

      // Badge animation with mobile optimization
      const badge = sectionRef.current?.querySelector('.tracking-wider');
      if (badge) {
        gsap.fromTo(badge,
          {
            opacity: 0,
            scale: isMobile ? 0.9 : 0.5,
            rotateX: isMobile ? 0 : -180
          },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? customEase.smooth : customEase.elastic,
            force3D: true,
            scrollTrigger: {
              trigger: badge,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            }
          }
        );
      }

      // Simplified animations for remaining elements on mobile
      if (!isMobile) {
        // Industry section title animation
        const industryTitle = sectionRef.current?.querySelector('h3');
        if (industryTitle) {
          gsap.fromTo(industryTitle,
            {
              opacity: 0,
              y: 50,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: customEase.smooth,
              scrollTrigger: {
                trigger: industryTitle,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play pause resume reverse",
              }
            }
          );
        }
      }

      // CTA buttons animation with mobile optimization
      gsap.fromTo('.btn-primary, .btn-secondary',
        {
          opacity: 0,
          y: isMobile ? 20 : 30,
          scale: isMobile ? 0.98 : 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 0.4 : 0.6,
          stagger: isMobile ? 0.05 : 0.1,
          ease: customEase.smooth,
          force3D: true,
          scrollTrigger: {
            trigger: '.mt-20',
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
          }
        }
      );

    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        id="showcase"
        className="relative py-24 md:py-32 overflow-hidden"
      >
        {/* gradient background  */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        {/* glow effect */}
        <m.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        />
        <m.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
        />

        <div className="mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <m.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-block mb-6"
              >
                <span className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 text-sm font-bold tracking-wider border border-purple-500/30 backdrop-blur-sm">
                  ✨ TEMPLATE SHOWCASE
                </span>
              </m.div>
              <h2 className="showcase-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white">
                Build Anything
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Choose from hundreds of stunning templates or start from
                scratch. Every template is fully customizable with our visual
                builder.
              </p>
            </div>

            {/* Industry Templates Grid */}
            <m.div style={{ y, scale }} className="relative">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Templates for Every Industry
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  No matter your business, we have the perfect starting point.
                  All templates are coming with the official launch.
                </p>
              </div>

              <div className="industry-grid grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry, index) => (
                  <m.div
                    key={industry.name}
                    className="industry-card relative group"
                    onMouseEnter={() => setHoveredIndustry(index)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`relative glass-card p-6 text-center cursor-pointer overflow-hidden border transition-all duration-300 ${hoveredIndustry === index
                        ? "border-white/20"
                        : "border-white/5"
                        }`}
                    >
                      {/* Animated background */}
                      <div
                        className={`absolute inset-0 scale-200 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                      />

                      {/* Content */}
                      <div className="relative z-10 text-5xl mb-3">
                        {industry.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {industry.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        <m.span
                          key="hover"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`font-bold bg-gradient-to-r ${industry.color} bg-clip-text text-transparent`}
                        >
                          {hoveredIndustry === index
                            ? "Explore Templates →"
                            : `${industry.templates}+ templates`}
                        </m.span>
                      </p>
                    </div>
                  </m.div>
                ))}
              </div>

              {/* CTA Section */}
              <m.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-20 text-center"
              >
                <p className="text-lg text-slate-400 mb-6">
                  Can&apos;t find what you&apos;re looking for? No problem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary group"
                  >
                    <span className="flex items-center gap-2">
                      Start from Scratch
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </m.button>
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary"
                  >
                    Request a Template
                  </m.button>
                </div>
              </m.div>
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
