'use client';

import { authClient } from "@/lib/auth-client";
import { useSidebarStore } from "@/store/sidebarStore";
import { PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export default function Header() {
    const toggleSidebar = useSidebarStore(state => state.toggleSidebar);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between md:justify-start gap-17 p-6 pl-10 h-20">
            <span className="text-2xl font-bold">
                Helix
            </span>
            <button
                onClick={toggleSidebar}
                className="p-1.5 hover:bg-primary/10 rounded-lg"
            >
                <PanelLeft size={18} />
            </button>
            <div className="items-center gap-2 ml-auto hidden md:flex">
                <AnimatePresence mode="wait">
                    {isPending ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"
                        />
                    ) : session?.user ? (
                        <motion.div
                            key="user-image"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="cursor-pointer"
                            onClick={() => authClient.signOut()}
                        >
                            <Image
                                src={session.user.image || ""}
                                width={32}
                                height={32}
                                alt="User"
                                className="rounded-full"
                            />
                        </motion.div>
                    ) : (
                        <motion.button
                            key="login-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/80 cursor-pointer"
                            onClick={() => router.push("/auth")}
                        >
                            Login
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}