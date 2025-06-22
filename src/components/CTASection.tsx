"use client";

import { useRef, useState } from "react";
import * as m from "motion/react-m";
import { LazyMotion, domAnimation } from "motion/react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        id="cta"
        className="relative min-h-screen flex items-center justify-center"
      >

        {/* Content */}
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          <m.h2
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8"
          >
            <span className="gradient-text">Be Part of the Revolution</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto"
          >
            Join our exclusive beta program and be among the first to experience
            the future of website building. Limited spots available.
          </m.p>

          {/* Email Signup Form */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-md mx-auto mb-8"
          >
            {!submitted ? (
              <m.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="relative"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary whitespace-nowrap"
                  >
                    Join Waitlist
                  </m.button>
                </div>
              </m.form>
            ) : (
              <m.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="glass-card p-6 text-center"
              >
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-slate-400">
                  We&apos;ll notify you when Helix launches.
                </p>
              </m.div>
            )}
          </m.div>

          {/* Current Stats */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 md:mt-16"
          >
            {[
              { value: "100+", label: "Waitlist Members" },
              { value: "July 2025", label: "Beta Launch" },
              { value: "100%", label: "Free Access" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </m.div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
