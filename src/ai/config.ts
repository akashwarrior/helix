import type { JSONValue } from "ai";
import { google } from "@ai-sdk/google";

export type GoogleModels = Parameters<typeof google>[0];
export const DEFAULT_MODEL: GoogleModels =
  "gemini-2.5-flash-lite-preview-09-2025";

export function getAvailableModels() {
  return [
    { name: "Gemini Pro", id: "gemini-2.5-pro" },
    { name: "Gemini Flash", id: "gemini-2.5-flash-preview-09-2025" },
    { name: "Gemini Flash Lite", id: "gemini-2.5-flash-lite-preview-09-2025" },
  ];
}

export interface ModelOptions {
  model: ReturnType<typeof google>;
  providerOptions?: Record<string, Record<string, JSONValue>>;
}

export function getModelOptions(
  modelId: GoogleModels = DEFAULT_MODEL,
): ModelOptions {
  return {
    model: google(modelId),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: -1,
          includeThoughts: true,
        },
      },
    },
  };
}
