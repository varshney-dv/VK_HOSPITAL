import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { aiConfig } from "../config/aiConfig.js";

/**
 * Initializes and returns the Gemini Chat model provider.
 * Supports model name overrides for maximum resilience.
 * 
 * @param {string} [modelOverride] 
 * @returns {ChatGoogleGenerativeAI}
 */
export const getGeminiProvider = (modelOverride = null) => {
  const config = aiConfig.gemini;
  if (!config.apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in your backend .env file.");
  }

  return new ChatGoogleGenerativeAI({
    apiKey: config.apiKey,
    model: modelOverride || config.model,
    temperature: config.temperature,
    maxRetries: 2 // Built-in LangChain retry
  });
};
