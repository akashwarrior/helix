"use client";

import { gsap } from "gsap/gsap-core";
import * as m from "motion/react-m";
import { useState, memo, useEffect, useRef } from "react";
import { customEase } from "@/utils/animations";

const NAV_ITEMS = [
  { name: "Features", href: "#features" },
  { name: "Showcase", href: "#showcase" },
  { name: "About", href: "#about" },
] as const;

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);

        // Update active section based on scroll position
        const sections = NAV_ITEMS.map((item) => item.href.substring(1));
        const currentSection = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        setActiveSection(currentSection);
      });
    };

    // Animate nav items on mount
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        {
          y: -20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: customEase.smooth,
          delay: 0.5,
        },
      );
    }, navRef);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.kill(true);
    };
  }, []);

  return (
    <m.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className={`${scrolled ? "py-3" : "py-4"} transition-all duration-300`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto rounded-2xl transition-all duration-300 border
              ${scrolled
                ? "glass-card border-white/[0.08] shadow-2xl shadow-blue-500/5 backdrop-blur-xl"
                : "border-transparent"
              }`}
          >
            <div className="flex items-center justify-between h-14 md:h-16 px-6">
              {/* Logo with animated gradient */}
              <m.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="nav-item relative flex items-center gap-3 group"
              >
                <span className="text-xl md:text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    HELIX
                  </span>
                </span>
                <m.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                >
                  Beta
                </m.span>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </m.a>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <nav className="relative flex items-center">
                  {/* Active indicator */}
                  <div
                    ref={indicatorRef}
                    className="absolute h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg transition-all duration-300"
                    style={{ opacity: 0 }}
                  />

                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                      <m.a
                        key={item.name}
                        href={item.href}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={(e) => {
                          const target = e.target as HTMLElement;
                          if (indicatorRef.current) {
                            gsap.to(indicatorRef.current, {
                              x: target.offsetLeft,
                              width: target.offsetWidth,
                              opacity: 1,
                              duration: 0.2,
                              ease: customEase.smooth,
                            });
                          }
                        }}
                        onHoverEnd={() => {
                          if (indicatorRef.current) {
                            gsap.to(indicatorRef.current, {
                              opacity: 0,
                              duration: 0.2,
                              ease: customEase.smooth,
                            });
                          }
                        }}
                        className={`nav-item px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative ${isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                          }`}
                      >
                        {item.name}
                        {isActive && (
                          <m.div
                            layoutId="activeSection"
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg -z-10"
                            transition={{ type: "spring", duration: 0.6 }}
                          />
                        )}
                      </m.a>
                    );
                  })}
                </nav>

                <m.a
                  href="#cta"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="nav-item btn-primary !px-5 !py-2 !text-sm group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join Waitlist
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
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
                </m.a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <m.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05] z-50"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <m.path
                      initial={false}
                      animate={{
                        d: mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                      }}
                      transition={{ duration: 0.3 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </m.button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden absolute top-full left-0 w-full h-full z-50 bg-black"
              >
                <div className="px-6 py-4 space-y-1 border-t border-white/[0.08]">
                  {NAV_ITEMS.map((item, index) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                      <m.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.1,
                          damping: 10,
                          stiffness: 100,
                        }}
                        className={`block px-4 py-3 text-sm font-medium rounded-lg
                            ${isActive
                            ? " bg-gradient-to-r from-blue-600/10 to-purple-600/10"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                          }`}
                      >
                        {item.name}
                      </m.a>
                    );
                  })}
                  <m.a
                    href="#cta"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4"
                  >
                    <button className="btn-primary w-full !text-sm">
                      Join Waitlist
                    </button>
                  </m.a>
                </div>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </m.nav>
  );
}

export default memo(Navigation);
