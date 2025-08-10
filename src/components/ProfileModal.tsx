"use client";

import { useTheme } from "next-themes";
import { signOut, useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ProfileModalProps {
  children: React.ReactNode;
}

export default function ProfileModal({ children }: ProfileModalProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const user = session?.user;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
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

        <div className="bg-muted/40 rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Credits
            </span>
            <span className="text-sm font-mono text-foreground">∞</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Daily refills
            </span>
            <span className="text-sm font-mono text-foreground">∞</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Deployments
            </span>
            <span className="text-sm font-mono text-foreground">∞</span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <div className="flex bg-muted py-1 px-2 gap-2 items-center rounded-lg">
              <Button
                variant={theme === "system" ? "secondary" : "ghost"}
                size="icon"
                className="h-4 w-4 transition-all hover:scale-105"
                onClick={() => setTheme("system")}
              >
                <Monitor />
              </Button>
              <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                size="icon"
                className="h-4 w-4 transition-all hover:scale-105"
                onClick={() => setTheme("light")}
              >
                <Sun />
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                size="icon"
                className="h-4 w-4 transition-all hover:scale-105"
                onClick={() => setTheme("dark")}
              >
                <Moon />
              </Button>
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
