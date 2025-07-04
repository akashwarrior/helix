"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Problem', href: '#problem' },
  { name: 'Solution', href: '#solution' },
  { name: 'Features', href: '#features' },
  { name: 'Showcase', href: '#showcase' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => setIsMobileMenuOpen(prev => !prev);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between glass-card px-6 py-3 rounded-full bg-black/60 backdrop-blur-md">
            {/* Logo */}
            <motion.span
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Helix
              </span>
            </motion.span>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* CTA Button */}
            <Link href="/auth">
              <motion.button
                className="hidden md:block btn-primary text-sm px-6 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={handleMobileMenuToggle}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md md:hidden"
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : "100%"
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-2xl text-slate-300 hover:text-white transition-colors"
              onClick={(e) => handleNavClick(e, item.href)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </motion.a>
          ))}
          <Link href="/auth">
            <motion.button
              className="btn-primary text-lg px-8 py-3 mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </nav>
      </motion.div>
    </>
  );
};