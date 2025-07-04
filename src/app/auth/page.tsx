"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client'
import Link from 'next/link';

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
                fetchOptions: {
                    onError: () => setIsLoading(false)
                }
            })
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <main className="min-h-screen bg-black overflow-hidden">
            <div className="min-h-screen flex max-w-7xl mx-auto">
                {/* Left Side - Branding */}
                <motion.section
                    className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]"></div>

                    {/* Floating Elements */}
                    <motion.div
                        className="absolute top-20 right-20 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
                        animate={{
                            y: [0, -8, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-32 left-20 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
                        animate={{
                            y: [0, 8, 0],
                            scale: [1, 0.95, 1],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 3
                        }}
                    />

                    <div className="relative z-10">
                        <motion.h1
                            className="text-6xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            Helix
                        </motion.h1>
                        <motion.p
                            className="text-xl text-neutral-300 mb-8 max-w-md leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                        >
                            Build stunning websites with AI-powered design assistance.
                            Transform your ideas into beautiful, responsive web experiences.
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4 text-sm text-neutral-400"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Real-time Preview</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span>Export Ready</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Right Side - Auth Form */}
                <motion.section
                    className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-neutral-950/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Welcome back
                            </h2>
                            <p className="text-neutral-400">
                                Sign in to continue to Helix
                            </p>
                        </div>

                        {/* Sign In Button */}
                        <motion.button
                            onClick={handleGoogleAuth}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </motion.button>

                        {/* Security Note */}
                        <div className="text-center p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 mb-8">
                            <p className="text-sm text-neutral-300 mb-1">Secure & Fast</p>
                            <p className="text-xs text-neutral-500">
                                Your data is protected with enterprise-grade security
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="text-center space-y-4">
                            <p className="text-xs text-neutral-500">
                                By signing in, you agree to our{' '}
                                <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-neutral-300 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to home
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </div>
        </main>
    );
}