import { useEffect, useState } from "react";
import { useSandboxStore } from "@/store/sandbox";

export const useSandboxState = () => {
  const sandboxId = useSandboxStore((state) => state.sandboxId);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!sandboxId) return;

    const revalidate = async () => {
      const res = await fetch(`/api/sandboxes/${sandboxId}`);
      const { status } = await res.json();

      if (
        status === "stopping" ||
        status === "stopped" ||
        status === "failed"
      ) {
        setIsActive(false);
      }
    };

    const timeout = setTimeout(revalidate, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [sandboxId]);

  return {
    isActive,
  };
};
