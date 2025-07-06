'use client';

import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sparkles, Shield } from "lucide-react";
import Link from "next/link";

interface AuthDialogProps {
    setAuthModalAction: (action: boolean) => void;
    children: React.ReactNode;
}

export default function AuthDialog({ setAuthModalAction, children }: AuthDialogProps) {
    return (
        <Dialog onOpenChange={setAuthModalAction}>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-8 max-w-md! w-full bg-card/95 border-0 shadow-none outline-none rounded-2xl overflow-hidden">
                <div className=" backdrop-blur-xl">
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Helix
                            </h1>
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                Sign in required
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Unlock AI-powered features and enhance your workflow with intelligent design assistance
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="p-1.5 rounded-full bg-primary/10">
                                    <Sparkles size={12} className="text-primary" />
                                </div>
                                <span>AI Enhanced</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="p-1.5 rounded-full bg-emerald-500/10">
                                    <Shield size={12} className="text-emerald-500" />
                                </div>
                                <span>Secure</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/auth"
                                className={cn(buttonVariants({ variant: "default" }),
                                    "w-full py-5.5 group overflow-hidden relative"
                                )}
                            >
                                <span className="relative z-10">Login</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full py-5.5 text-muted-foreground hover:text-foreground"
                                >
                                    Maybe later
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    )
}