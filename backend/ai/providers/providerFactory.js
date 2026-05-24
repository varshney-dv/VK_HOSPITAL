import { getOpenAIProvider } from "./openaiProvider.js";
import { getGeminiProvider } from "./geminiProvider.js";
import { aiConfig } from "../config/aiConfig.js";

/**
 * Factory to dynamically fetch an active LLM provider.
 * Automatically falls back to the alternate provider if credentials or initializations fail.
 * 
 * @param {string} [preferredProvider] 'openai' | 'gemini'
 * @param {object} [options] 
 * @returns {object} Instantiated LangChain chat model
 */
export const getAIProvider = (preferredProvider = aiConfig.provider, options = {}) => {
  const selectedProvider = (preferredProvider || "openai").toLowerCase();

  try {
    if (selectedProvider === "openai") {
      return getOpenAIProvider();
    } else if (selectedProvider === "gemini") {
      return getGeminiProvider(options.model);
    } else {
      throw new Error(`Invalid provider: ${preferredProvider}`);
    }
  } catch (error) {
    console.warn(`[AI Factory] Preferred provider "${selectedProvider}" initialization failed: ${error.message}. Resolving fallback...`);

    // Provider Fallback logic
    if (selectedProvider === "openai") {
      try {
        return getGeminiProvider(options.model);
      } catch (fallbackError) {
        throw new Error(`Both OpenAI and Gemini providers failed to initialize. First error: ${error.message}. Fallback error: ${fallbackError.message}`);
      }
    } else {
      try {
        return getOpenAIProvider();
      } catch (fallbackError) {
        throw new Error(`Both Gemini and OpenAI providers failed to initialize. First error: ${error.message}. Fallback error: ${fallbackError.message}`);
      }
    }
  }
};
