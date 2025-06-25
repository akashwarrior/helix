"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import * as m from "motion/react-m";
import { customEase } from "@/utils/animations";
import { useGSAP } from "@gsap/react";
import ComingSoonModal from "@/components/ui/ComingSoonModal";

gsap.registerPlugin(useGSAP)

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
  const [showStartModal, setShowStartModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useGSAP(() => {
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
          y: 100,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.02,
          ease: customEase.bounce,
          force3D: true,
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play pause resume reverse",
          },
        },
      );
    }


    gsap.fromTo(".industry-title",
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
          trigger: ".industry-title",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play pause resume reverse",
        }
      }
    );

    // CTA buttons animation with mobile optimization
    gsap.fromTo('.btn-primary, .btn-secondary',
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: customEase.smooth,
        force3D: true,
        scrollTrigger: {
          trigger: '.mt-20',
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play pause resume reverse",
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <>
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
            <m.div className="relative">
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
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", delay: index * 0.05 }}
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
                    onClick={() => setShowStartModal(true)}
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
                    onClick={() => setShowRequestModal(true)}
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

      {/* Coming Soon Modals */}
      <ComingSoonModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        title="Blank Canvas Builder"
        description="Our visual builder will let you create stunning websites from scratch with drag-and-drop simplicity. Design freely with complete control over every element."
        icon={
          <svg
            className="w-10 h-10 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      />

      <ComingSoonModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Template Request"
        description="Have a specific template in mind? We're building our template library based on your needs. Submit your request and we'll prioritize it for development."
        icon={
          <svg
            className="w-10 h-10 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        }
      />
    </>
  );
}
