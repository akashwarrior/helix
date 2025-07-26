"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "@/lib/auth";
import { useSidebarStore } from "@/store/sidebarStore";
import { motion } from "motion/react";

interface HeaderProps {
  openAuthModal: () => void;
}

export default function Header({ openAuthModal }: HeaderProps) {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between md:justify-start gap-17 p-6 pl-10 h-20 z-50">
      <h1 className="text-2xl font-bold">
        Helix
      </h1>

      <Button
        size="icon"
        variant="ghost"
        onClick={toggleSidebar}
      >
        <PanelLeft size={18} />
      </Button>

      <div className="items-center ml-auto hidden md:flex gap-3">
        <ThemeToggle />

        {!isPending && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
          >
            {isAuthenticated ? (
              <Image
                src={session?.user.image || "/profile_icon.png"}
                width={32}
                height={32}
                alt="User Profile"
                onClick={() => signOut()}
                className="rounded-full border transition-all duration-200 cursor-pointer hover:opacity-80"
              />
            ) : (
              <Button onClick={openAuthModal}>
                Login
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
