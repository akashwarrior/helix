"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useHeaderOption } from "@/store/headerOptions";
import { TextEffect } from "../ui/text-effect";
import { ArrowLeft, GlobeIcon, Loader2 } from "lucide-react";
import ProfileModal from "../ProfileModal";

export default function ChatHeader() {
  const router = useRouter();
  const { setActiveView, title, loading } = useHeaderOption();

  return (
    <header className="sticky top-0 z-40 h-14 flex items-center px-3">
      <div className="flex items-center gap-2 flex-1">
        <Button size="icon" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>

        <h1 className="font-medium truncate text-foreground">
          {title && <TextEffect per="char" preset="blur">
            {title}
          </TextEffect>}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {loading && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveView("Preview")}
          >
            <Loader2 size={14} className="animate-spin" />
            <span className="hidden sm:inline">
              Workspace
            </span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          className="flex items-center justify-center transition-all duration-200 overflow-hidden"
        >
          <GlobeIcon size={14} />
          <span className="hidden sm:inline">Deploy</span>
        </Button>

        <div />

        <ProfileModal />
      </div>
    </header>
  );
}
