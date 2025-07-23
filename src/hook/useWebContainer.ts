import { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { useMessagesStore } from "@/store/messagesStore";
import { usePreviewUrlStore } from "@/store/previewUrlStore";
import { StepType } from "@/lib/server/constants";
import { executeCommand } from "@/lib/webcontainer";

export interface UseWebContainerReturn {
  error: string | null;
  webContainer: WebContainer;
}

export function useWebContainer(): UseWebContainerReturn {
  const setPreviewUrl = usePreviewUrlStore((state) => state.setPreviewUrl);
  const { messages, updateMessage } = useMessagesStore();
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<WebContainer>();
  const processingSteps = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const container = await WebContainer.boot({
          workdirName: "helix",
        });
        container.on("server-ready", (port, url) => setPreviewUrl(url));

        container.on("error", (err) => setError(err.message));

        containerRef.current = container;
        setReady(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to initialize WebContainer";
        console.error("WebContainer initialization failed:", errorMessage);
        setError(errorMessage);
      }
    })();

    return () => {
      containerRef.current?.teardown();
      containerRef.current = undefined;
      setPreviewUrl("");
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || processingSteps.current) return;
    const webContainer = containerRef.current;
    processingSteps.current = true;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "assistant") return;

    (async () => {
      for (let idx = 0; idx < lastMessage.steps.length; idx++) {
        const { content, path, stepType, isPending, isArtifactComplete } = lastMessage.steps[idx];
        if (!isPending || !isArtifactComplete) continue;

        try {
          if (stepType === StepType.RUN_SCRIPT) {
            if (!content) continue;
            const cmd = content.split(" ")[0]?.trim();
            const args = content
              .split(" ")
              .slice(1)
              .filter((arg) => arg.trim());
            await executeCommand(webContainer, cmd, args);
          } else {
            const pathParts = path?.split("/").slice(0, -1).join("/");
            try {
              if (pathParts?.trim()) {
                await webContainer?.fs.mkdir(pathParts, { recursive: true });
              }
            } catch {
              // Directory might already exist
            }
            await webContainer?.fs.writeFile(path!, content!);
          }

          lastMessage.steps[idx] = {
            ...lastMessage.steps[idx],
            isPending: false,
          };
          updateMessage({ ...lastMessage });
        } catch (stepError) {
          console.error(`Error in step ${idx + 1}:`, stepError);
        }
      }
      processingSteps.current = false;
    })();
  }, [ready, messages]);

  return {
    error,
    webContainer: containerRef.current!,
  };
}
