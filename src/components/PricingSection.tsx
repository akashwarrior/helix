"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useSectionReveal, useCardScroll, useParallaxScroll } from "@/utils/scrollAnimations";

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    originalPrice: "$29",
    period: "/month",
    description: "Perfect for personal projects and small websites",
    features: [
      "Up to 5 projects",
      "Basic templates",
      "1GB storage",
      "Community support",
      "SSL certificate",
      "Basic analytics",
    ],
    gradient: "from-cyan-600 to-blue-600",
    popular: false,
  },
  {
    name: "Professional",
    price: "$0",
    originalPrice: "$79",
    period: "/month",
    description: "Ideal for freelancers and growing businesses",
    features: [
      "Unlimited projects",
      "Premium templates",
      "50GB storage",
      "Priority support",
      "Custom domains",
      "Advanced analytics",
      "Team collaboration",
      "API access",
    ],
    gradient: "from-purple-600 to-pink-600",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$0",
    originalPrice: "$299",
    period: "/month",
    description: "For agencies and large organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "White-label options",
      "Dedicated support",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "Training sessions",
    ],
    gradient: "from-orange-600 to-red-600",
    popular: false,
  },
];

// Separate component for pricing cards to use hooks properly
function PricingCard({ tier, index }: { tier: typeof pricingTiers[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { y: cardY, opacity: cardOpacity, rotate: cardRotate } = useCardScroll(cardRef, index);

  return (
    <m.div
      ref={cardRef}
      style={{ y: cardY, opacity: cardOpacity }}
      className="relative"
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {tier.popular && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          className="absolute -top-4 left-0 right-0 flex justify-center z-10"
        >
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold tracking-wide">
            MOST POPULAR
          </span>
        </m.div>
      )}

      <m.div
        style={{ rotate: cardRotate }}
        className={`relative h-full glass-card p-8 flex flex-col ${tier.popular && "ring-2 ring-purple-500/50"}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h3
            className={`text-2xl font-bold mb-2 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}
          >
            {tier.name}
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            {tier.description}
          </p>

          {/* Price with animated reveal */}
          <m.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6 + index * 0.1,
              type: "spring",
              damping: 10
            }}
            className="mb-2"
          >
            <span className="text-5xl font-bold text-white">
              {tier.price}
            </span>
            <span className="text-slate-500">{tier.period}</span>
          </m.div>
          <div className="text-sm text-slate-600">
            <span className="line-through">{tier.originalPrice}</span>
            <span className="ml-2 text-green-500 font-semibold">
              Free during beta
            </span>
          </div>
        </div>

        {/* Features with staggered animation */}
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, i) => (
            <m.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.7 + index * 0.1 + i * 0.05
              }}
              className="flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-slate-400">
                {feature}
              </span>
            </m.li>
          ))}
        </ul>

        {/* CTA Button */}
        <m.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${tier.gradient} text-white font-semibold transition-all duration-300 hover:shadow-lg mt-auto`}
        >
          Get Early Access
        </m.button>
      </m.div>
    </m.div>
  );
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Section reveal animation
  const { y: sectionY, opacity: sectionOpacity } = useSectionReveal(sectionRef);

  // Background parallax
  const bgLeftRef = useRef<HTMLDivElement>(null);
  const bgRightRef = useRef<HTMLDivElement>(null);
  const { y: bgLeftY } = useParallaxScroll(bgLeftRef);
  const { y: bgRightY } = useParallaxScroll(bgRightRef);

  // Badge floating animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const badgeY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        id="pricing"
        className="relative py-20 md:py-32 overflow-hidden"
      >
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <m.div
            style={{ y: sectionY, opacity: sectionOpacity }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <m.span
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="gradient-text"
              >
                Start Today (Beta)
              </m.span>
            </h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-4"
            >
              Join our beta program and get access to all features for free. No
              credit card required.
            </m.p>
            <m.div
              style={{ y: badgeY }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20"
            >
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-yellow-500">
                Prices will apply after beta ends
              </span>
            </m.div>
          </m.div>

          {/* Pricing Grid with scroll animations */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {pricingTiers.map((tier, index) => (
              <PricingCard key={tier.name} tier={tier} index={index} />
            ))}
          </div>
        </div>

        {/* Decorative elements with parallax */}
        <m.div
          ref={bgLeftRef}
          style={{ y: bgLeftY }}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-[150px]"
        />
        <m.div
          ref={bgRightRef}
          style={{ y: bgRightY }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]"
        />
      </section>
    </LazyMotion>
  );
}
