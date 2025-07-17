"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-blue-600/10 via-purple-600/10 to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-8 px-6 py-12 bg-card/70 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full"
            >
                <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="text-blue-500 dark:text-blue-400" size={48} />
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground mb-1">Page Not Found</h2>
                    <p className="text-muted-foreground text-center max-w-xs">
                        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform">
                        Go Home
                    </Button>
                </Link>
            </motion.section>
        </main>
    );
} 