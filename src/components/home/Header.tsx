'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebarStore";
import { PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth";

export default function Header({ isAuthenticated, image }: { isAuthenticated: boolean, image: string }) {
    const toggleSidebar = useSidebarStore(state => state.toggleSidebar);
    const router = useRouter();

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between md:justify-start gap-17 p-6 pl-10 h-20 z-50">
            <span className="text-2xl font-bold">
                Helix
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
            >
                <PanelLeft size={18} />
            </Button>
            <div className="items-center gap-3 ml-auto hidden md:flex">
                <ThemeToggle />
                {isAuthenticated ? (
                    <Image
                        src={image || ""}
                        width={32}
                        height={32}
                        alt="User"
                        onClick={() => authClient.signOut({
                            fetchOptions: { onSuccess: () => router.push("/auth") }
                        })}
                        className="rounded-full border border-border cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    />
                ) : (
                    <Button
                        onClick={() => router.push("/auth")}
                    >
                        Login
                    </Button>
                )}
            </div>
        </header>
    )
}