import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon: ReactNode;
  className?: string;
}

export function ToolHeader({ title, icon, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-muted-foreground mb-1 font-semibold",
        className,
      )}
    >
      {icon}
      {title}
    </div>
  );
}
