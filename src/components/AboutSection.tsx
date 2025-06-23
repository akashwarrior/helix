"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import { useScroll, useTransform, LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useCardScroll } from "@/utils/scrollAnimations";
import { animateCounter, createScrollObserver, customEase } from "@/utils/animations";

const milestones = [
  {
    date: "March 2025",
    title: "Project Started",
    description: "Initial concept and development began",
    status: "completed",
  },
  {
    date: "April 2025",
    title: "Alpha Testing",
    description: "Internal testing with core features",
    status: "completed",
  },
  {
    date: "June 2025",
    title: "Beta Testing",
    description: "Public beta with early access program",
    status: "current",
  },
  {
    date: "July 2025",
    title: "Official Launch (Beta)",
    description: "Full platform release with all features",
    status: "upcoming",
  },
];

// Separate component for stat items to use hooks properly
function StatItem({ stat, index }: { stat: { value: number; label: string; suffix: string }, index: number }) {
  const valueRef = useRef<HTMLSpanElement>(null);

  return (
    <m.div
      key={stat.label}
      className="text-center stat-item"
    >
      <m.div
        className="text-3xl md:text-4xl font-bold gradient-text mb-2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
      >
        <span
          ref={valueRef}
          data-counter={stat.label}
          data-value={stat.value}
          data-suffix={stat.suffix}
          className="stat-counter"
        >
          0
        </span>
      </m.div>
      <div className="text-sm text-slate-600">{stat.label}</div>
    </m.div>
  );
}

// Separate component for timeline items to use hooks properly
function TimelineItem({ milestone, index }: { milestone: typeof milestones[0], index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { opacity: itemOpacity } = useCardScroll(itemRef, index);

  return (
    <m.div
      ref={itemRef}
      style={{ opacity: itemOpacity }}
      className={`timeline-item relative flex items-center mb-8 ${index % 2 === 0 && "md:flex-row-reverse"}`}
    >
      {/* Content */}
      <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"} ml-16 md:ml-0`}>
        <div
          className={`glass-card p-6 inline-block ring-2 
         ${milestone.status === "current"
              ? "ring-purple-500/50"
              : milestone.status === "upcoming"
                ? "ring-slate-500/50"
                : "ring-green-500/50"
            }`}
        >
          <div
            className={`text-sm font-semibold mb-1 
          ${milestone.status === "completed"
                ? "text-green-400"
                : milestone.status === "current"
                  ? "text-purple-400"
                  : "text-slate-500"
              }`}
          >
            {milestone.date}
          </div>
          <h4 className="text-lg font-bold text-white mb-1">
            {milestone.title}
          </h4>
          <p className="text-sm text-slate-400">
            {milestone.description}
          </p>
        </div>
      </div>

      {/* Dot */}
      <m.div
        whileInView={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 
          ${milestone.status === "completed" ? "bg-green-500" : milestone.status === "current"
            ? "bg-purple-500 animate-pulse"
            : "bg-slate-600"
          }`}
      >
        {milestone.status === "current" && (
          <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping" />
        )}
      </m.div>
    </m.div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Timeline scroll progress
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    // Detect mobile for performance optimizations
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger after all elements are rendered
      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());

      // Title animation with mobile optimization
      const title = sectionRef.current?.querySelector('.about-title-text');
      if (title) {
        const words = title.textContent?.split(' ') || [];
        title.innerHTML = words.map(word =>
          `<span class="inline-block mx-1">${word}</span>`
        ).join('');

        gsap.fromTo(title.querySelectorAll('span'),
          {
            opacity: 0,
            y: isMobile ? 40 : 80,
            rotateY: isMobile ? 0 : -45,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: isMobile ? 0.6 : 0.8,
            stagger: isMobile ? 0.08 : 0.1,
            ease: isMobile ? customEase.smooth : customEase.elastic,
            force3D: true,
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            }
          }
        );
      }

      // Enhanced quote animation with mobile optimization
      const quote = quoteRef.current?.querySelector('blockquote');
      if (quote) {
        const words = quote.textContent?.split(' ') || [];
        quote.innerHTML = words.map(word =>
          `<span class="inline-block mx-1 quote-word">${word}</span>`
        ).join('');

        gsap.fromTo(quote.querySelectorAll('span'),
          {
            opacity: 0,
            y: isMobile ? 20 : 40,
            scale: isMobile ? 0.95 : 0.8,
            rotateX: isMobile ? 0 : -45,
            filter: isMobile ? 'blur(0px)' : 'blur(10px)',
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: isMobile ? 0.6 : 0.8,
            stagger: {
              each: isMobile ? 0.02 : 0.03,
              from: "center"
            },
            ease: customEase.smooth,
            force3D: true,
            scrollTrigger: {
              trigger: quote,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            }
          }
        );
      }

      // Animate the mission card with mobile optimization
      gsap.fromTo(quoteRef.current,
        {
          opacity: 0,
          scale: isMobile ? 0.95 : 0.9,
          y: isMobile ? 30 : 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: isMobile ? 0.8 : 1,
          ease: customEase.smooth,
          force3D: true,
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
          }
        }
      );

      // Animate cite text with mobile optimization
      gsap.fromTo('.mission-cite',
        {
          opacity: 0,
          x: isMobile ? -30 : -50,
          filter: isMobile ? 'blur(0px)' : 'blur(5px)'
        },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: isMobile ? 0.6 : 0.8,
          delay: isMobile ? 0.3 : 0.5,
          ease: customEase.smooth,
          force3D: true,
          scrollTrigger: {
            trigger: '.mission-cite',
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
          }
        }
      );

      // Enhanced timeline animation with mobile optimization
      const timelineItems = gsap.utils.toArray('.timeline-item') as HTMLElement[];
      timelineItems.forEach((item, index) => {
        gsap.fromTo(item,
          {
            opacity: 0,
            x: isMobile ? 0 : (index % 2 === 0 ? 100 : -100),
            y: isMobile ? 30 : 0,
            rotateY: isMobile ? 0 : (index % 2 === 0 ? 45 : -45),
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotateY: 0,
            duration: isMobile ? 0.6 : 1,
            ease: customEase.smooth,
            force3D: true,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: isMobile ? "play none none none" : "play pause resume reverse",
            }
          }
        );
      });

      // Animate timeline line with mobile optimization
      if (timelineLineRef.current) {
        gsap.fromTo(timelineLineRef.current,
          {
            scaleY: 0,
            transformOrigin: "top center"
          },
          {
            scaleY: 1,
            duration: isMobile ? 1.5 : 2,
            ease: customEase.smooth,
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: isMobile ? 2 : 1,
              toggleActions: "play pause resume reverse",
            }
          }
        );
      }

      // Stats animation - only trigger once when visible
      const statsContainer = sectionRef.current?.querySelector('.grid');
      if (statsContainer) {
        ScrollTrigger.create({
          trigger: statsContainer,
          start: "top 80%",
          once: true,
          onEnter: () => {
            // Trigger counter animations
            const counters = statsContainer.querySelectorAll('[data-counter]');
            counters.forEach((counter) => createScrollObserver(
              document.querySelectorAll(`[data-counter="${counter.getAttribute('data-counter')}"]`),
              () => {
                if (counter instanceof HTMLElement) {
                  const value = parseInt(counter.getAttribute('data-value') || '0');
                  const suffix = counter.getAttribute('data-suffix') || '';
                  animateCounter(counter, value, 2000, suffix);
                }
              }
            ));
          }
        });
      }

      // Floating animation for orbs - disabled on mobile
      if (!isMobile) {
        gsap.to('.mission-orb-1', {
          x: 50,
          y: -30,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        gsap.to('.mission-orb-2', {
          x: -50,
          y: 30,
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="about"
        ref={sectionRef}
        className="relative py-20 md:py-32 overflow-hidden"
      >
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Section Header with scroll animations */}
          <div className="text-center mb-16 md:mb-20">
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold tracking-wide">
                OUR MISSION
              </span>
            </m.div>
            <h2 className="about-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="about-title-text">Building the Future</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
              We&apos;re on a mission to democratize web development by making it accessible,
              intuitive, and powerful for everyone.
            </p>
          </div>

          {/* Mission Statement with scroll animations */}
          <div ref={quoteRef} className="relative mb-16">
            {/* Animated gradient orbs */}
            <div className="mission-orb-1 absolute -top-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-[80px]" />
            <div className="mission-orb-2 absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />


            <div className="relative glass-card p-8 md:p-12 lg:p-16 text-center overflow-hidden">

              {/* Main quote with scroll reveal */}
              <blockquote className="relative z-10 text-xl md:text-2xl lg:text-3xl font-light leading-relaxed tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200">
                  We believe everyone should have the power to create beautiful,
                  functional websites without writing a single line of code.
                  Helix is our answer to that vision.
                </span>
              </blockquote>

              {/* Author */}
              <cite className="mission-cite relative z-10 block mt-6 md:mt-8">
                <div className="inline-flex items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                  <span className="text-sm md:text-base font-medium tracking-wider uppercase bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    The Helix Team
                  </span>
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                </div>
              </cite>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/20 rounded-br-2xl" />
            </div>
          </div>

          {/* Current Stats with scroll animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { value: 3, label: "Months in Development", suffix: "" },
              { value: 100, label: "Beta Waitlist Members", suffix: "+" },
              { value: 4, label: "Active Users", suffix: "" },
              { value: 10, label: "Features Planned", suffix: "+" },
            ].map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Development Timeline with scroll animations */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <m.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gradient-subtle"
              >
                Our Journey
              </m.span>
            </h3>
            <div ref={timelineRef} className="timeline-container relative">
              {/* Timeline line with scroll progress */}
              <m.div
                ref={timelineLineRef}
                style={{ height: timelineHeight }}
                className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 h-full"
              />

              {milestones.map((milestone, index) => (
                <TimelineItem key={milestone.date} milestone={milestone} index={index} />
              ))}
            </div>
          </div>

          {/* Team Section with scroll animations */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              <span className="text-gradient-subtle">
                Built by Developers, for Everyone
              </span>
            </h3>
            <p className="text-slate-500 max-w-2xl mx-auto mb-8">
              Our team consists of passionate developers, designers, and
              creators who believe in making web development accessible to all.
              We&apos;re committed to building the best website builder on the
              planet.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                Join Our Journey
              </m.button>
              <m.a
                href="mailto:team@helix.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Contact Team
              </m.a>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
