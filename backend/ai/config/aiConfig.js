/**
 * Centralized AI Configuration
 */
export const aiConfig = {
  // Primary active provider: 'openai' or 'gemini'
  provider: process.env.AI_PROVIDER || "openai",

  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.1
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    temperature: 0.1
  }
};
