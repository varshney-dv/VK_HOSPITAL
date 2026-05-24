import { ChatOpenAI } from "@langchain/openai";
import { aiConfig } from "../config/aiConfig.js";

/**
 * Initializes and returns the OpenAI Chat model provider.
 * 
 * @returns {ChatOpenAI}
 */
export const getOpenAIProvider = () => {
  const config = aiConfig.openai;
  if (!config.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in your backend .env file.");
  }
  
  return new ChatOpenAI({
    apiKey: config.apiKey,
    model: config.model,
    temperature: config.temperature,
    maxRetries: 2 // Built-in LangChain retry
  });
};
