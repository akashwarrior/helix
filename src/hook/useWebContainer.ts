import { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { usePreviewUrlStore } from "@/store/previewUrlStore";
import { useWebContainerStore } from "@/store/webContainerStore";

export interface UseWebContainerReturn {
  error: string | null;
  isReady: boolean;
}

export function useWebContainer(): UseWebContainerReturn {
  const setPreviewUrl = usePreviewUrlStore((state) => state.setPreviewUrl);
  const setWebContainer = useWebContainerStore(
    (state) => state.setWebContainer,
  );
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<WebContainer>();

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        containerRef.current = await WebContainer.boot({
          workdirName: "helix",
        });

        containerRef.current.on("server-ready", (port, url) =>
          setPreviewUrl(url),
        );
        setWebContainer(containerRef.current);
        setIsReady(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize WebContainer",
        );
      }
    })();

    return () => {
      containerRef.current?.teardown();
      containerRef.current = undefined;
      setPreviewUrl("");
      setIsReady(false);
    };
  }, [setPreviewUrl, setWebContainer]);

  return {
    error,
    isReady,
  };
}
