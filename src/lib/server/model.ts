import { createGoogleGenerativeAI } from "@ai-sdk/google";

function getGeminiModel() {
  const gemini = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  return gemini("gemma-3-27b-it", {
    // structuredOutputs: true,
    // useSearchGrounding: true,
  });
}

export const model = getGeminiModel();
