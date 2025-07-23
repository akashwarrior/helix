"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onResponse: () => setIsLoading(false),
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    });
  };

  return (
    <main className="relative z-10 min-h-screen flex bg-background overflow-hidden items-center justify-around">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <section className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 py-20 relative max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Helix
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
              Transform your ideas into stunning web experiences with AI-powered
              design assistance
            </p>
          </div>

          <div className="space-y-4">
            {[
              "AI-powered layout generation",
              "Real-time collaborative editing",
              "Enterprise-grade security",
              "One-click deployment",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex items-center gap-8 pt-4 text-center text-foreground text-lg"
          >
            {[
              { value: "10k+", label: "Websites Built" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="flex-1 lg:max-w-lg flex items-center justify-center p-6 lg:p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
              Helix
            </h1>
            <p className="text-muted-foreground">
              Build the future of web design
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="text-muted-foreground">
                Sign in to continue building amazing experiences
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden group mb-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isLoading && "opacity-100",
                )}
              />
            </Button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center space-y-4"
            >
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to home
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
