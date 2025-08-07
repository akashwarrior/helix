"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onRequest: () => setIsLoading(true),
        onError: () => {
          toast.error("Something went wrong");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <main className="relative z-10 min-h-screen flex bg-background overflow-hidden items-center justify-around">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-10 home-container" />

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
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
            transition={{ duration: 0.6 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.98em"
                    height="1em"
                    viewBox="0 0 256 262"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
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
                <a
                  href="/terms"
                  className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-6"
          >
            <div
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to home
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
