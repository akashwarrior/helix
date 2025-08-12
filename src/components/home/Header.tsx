"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/auth";
import { useSidebarStore } from "@/store/toggleSidebar";
import { motion } from "motion/react";
import ProfileModal from "@/components/ProfileModal";

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-current"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface HeaderProps {
  openAuthModal: () => void;
}

export default function Header({ openAuthModal }: HeaderProps) {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <header className="fixed top-4 left-0 right-0 mx-3 flex items-center justify-between md:justify-start gap-17 pr-6 pl-10 h-16 z-50">
      <h1 className="text-2xl font-bold brand-gradient-text tracking-tight">
        Helix
      </h1>

      <Button size="icon" variant="ghost" onClick={toggleSidebar}>
        <PanelLeft size={18} />
      </Button>

      <div className="items-center ml-auto hidden md:flex gap-6">
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About Us
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/skyGuptaCS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Contact us on X (Twitter)"
            >
              <XIcon size={18} />
            </Link>
          </div>
        </nav>

        <ThemeToggle />

        {!isPending && (
          <motion.div initial={{ width: 0 }} animate={{ width: "auto" }}>
            {isAuthenticated ? (
              <ProfileModal>
                <Image
                  src={session?.user.image || "/profile_icon.png"}
                  width={30}
                  height={30}
                  alt="User Profile"
                  className="rounded-full border transition-all duration-200 cursor-pointer hover:opacity-80"
                />
              </ProfileModal>
            ) : (
              <Button onClick={openAuthModal}>Login</Button>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
