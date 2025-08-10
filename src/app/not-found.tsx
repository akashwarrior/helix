"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex items-center justify-center">
      <div className="home-container fixed inset-0 z-0 overflow-hidden" />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        {/* 404 Card */}
        <div className="bg-card/60 supports-[backdrop-filter]:bg-card/70 border rounded-2xl p-8 backdrop-blur-md text-center">
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
              <FileQuestion size={32} className="text-muted-foreground" />
            </div>
          </motion.div>

          {/* 404 Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <div className="text-6xl font-bold brand-gradient-text mb-2">
              404
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Page Not Found
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground mb-6 leading-relaxed max-w-md mx-auto"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back to building beautiful websites.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
          >
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Go Home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-6 border-t border-border/50"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Search size={16} />
              <span>
                Try searching for what you need or start a new project
              </span>
            </div>
          </motion.div>
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            💡 Even the best websites have 404 pages. The important part is
            making them beautiful—just like Helix does.
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
