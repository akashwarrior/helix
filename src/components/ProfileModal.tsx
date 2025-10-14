"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./ui/animated-background";
import { LogOut, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: 'System',
    id: 'system',
    icon: <MonitorIcon className="h-4 w-4" />,
  },
]

interface ProfileModalProps {
  children?: React.ReactNode;
}

export default function ProfileModal({ children }: ProfileModalProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const user = session?.user;

  const handleSignOut = () => signOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || user?.image && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
          >
            <Image
              src={user?.image || "/profile_icon.png"}
              width={30}
              height={30}
              alt={"User Profile"}
              className="rounded-full border transition-all duration-200 cursor-pointer hover:opacity-80"
            />
          </motion.div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-w-[280px] p-4 space-y-3.5 shadow-lg border rounded-lg"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={user?.image || "/profile_icon.png"}
              width={40}
              height={40}
              alt="User Profile"
              className="w-10 h-10 rounded-full ring-1 ring-border object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate leading-tight">
              {user?.name || "Akash Gupta"}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user?.email || "akashwarrior@gmail.com"}
            </p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            Beta
          </span>
        </div>

        <div className="bg-muted/40 rounded-lg p-3 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">
              Credits
            </span>
            <span className="font-mono text-foreground">∞</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">
              Daily refills
            </span>
            <span className="font-mono text-foreground">∞</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">
              Deployments
            </span>
            <span className="font-mono text-foreground">∞</span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-3 px-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <div className="text-xs text-zinc-400 flex gap-2">
              <AnimatedBackground
                className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
                defaultValue={theme}
                enableHover={false}
                onValueChange={(id) => setTheme(id as string)}
              >
                {THEMES_OPTIONS.map((theme) => {
                  return (
                    <button
                      key={theme.id}
                      className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
                      data-id={theme.id}
                    >
                      {theme.icon}
                    </button>
                  )
                })}
              </AnimatedBackground>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-3">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start h-9 px-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group"
          >
            <LogOut
              size={14}
              className="mr-2.5 transition-transform group-hover:translate-x-0.5"
            />
            Sign Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
