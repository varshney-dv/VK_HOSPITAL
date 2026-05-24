import { RunnableSequence } from "@langchain/core/runnables";
import { getAIProvider } from "../providers/providerFactory.js";
import { symptomPromptTemplate } from "../prompts/symptomPrompt.js";
import { symptomParser } from "../parsers/symptomParser.js";
import { aiConfig } from "../config/aiConfig.js";

/**
 * Executes the symptom analysis chain using LangChain RunnableSequence.
 * Features built-in timeout handling, OpenAI-to-Gemini provider failover,
 * and Gemini model fallback (1.5-flash -> 2.5-flash).
 * 
 * @param {string} symptoms 
 * @returns {Promise<object>} Parsed output matching Zod schema
 */
export const runSymptomAnalysis = async (symptoms) => {
  const primaryProvider = aiConfig.provider;
  
  // Step 1: Run with configured preferred provider
  try {
    console.log(`[AI Chain] Invoking chain with primary provider: ${primaryProvider}`);
    return await executeChainWithProvider(primaryProvider, symptoms);
  } catch (primaryError) {
    console.error(`[AI Chain] Primary provider "${primaryProvider}" failed:`, primaryError.message);
  }

  // Step 2: Fallback to alternative provider
  const fallbackProvider = primaryProvider === "openai" ? "gemini" : "openai";
  console.log(`[AI Chain] Attempting failover to provider "${fallbackProvider}"...`);
  try {
    return await executeChainWithProvider(fallbackProvider, symptoms);
  } catch (fallbackError) {
    console.error(`[AI Chain] Fallback provider "${fallbackProvider}" failed:`, fallbackError.message);
    throw new Error(`AI Triage Chain completely failed. Details: ${fallbackError.message}`);
  }
};

/**
 * Invokes the RunnableSequence chain using the specified provider type.
 * Includes timeout handling and Gemini model fallback.
 */
const executeChainWithProvider = async (providerType, symptoms) => {
  const TIMEOUT_MS = 15000; // 15s timeout limit
  
  const runSequence = async (providerInstance) => {
    const chain = RunnableSequence.from([
      {
        symptoms: (input) => input.symptoms,
        format_instructions: () => symptomParser.getFormatInstructions()
      },
      symptomPromptTemplate,
      providerInstance,
      symptomParser
    ]);

    return await chain.invoke({ symptoms });
  };

  // Helper to execute with timeout
  const runWithTimeout = async (providerInstance) => {
    return await Promise.race([
      runSequence(providerInstance),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout of ${TIMEOUT_MS}ms exceeded`)), TIMEOUT_MS)
      )
    ]);
  };

  if (providerType === "gemini") {
    // Gemini fallback sequence: gemini-1.5-flash -> gemini-2.5-flash
    const geminiModels = ["gemini-1.5-flash", "gemini-2.5-flash"];
    let lastGeminiError = null;

    for (const modelName of geminiModels) {
      try {
        console.log(`[AI Chain] Instantiating Gemini model: ${modelName}`);
        const provider = getAIProvider("gemini", { model: modelName });
        return await runWithTimeout(provider);
      } catch (err) {
        console.warn(`[AI Chain] Gemini model "${modelName}" run failed: ${err.message}. Trying next fallback...`);
        lastGeminiError = err;
      }
    }
    throw lastGeminiError || new Error("All Gemini models failed in sequence.");
  } else {
    // OpenAI execution
    const provider = getAIProvider("openai");
    return await runWithTimeout(provider);
  }
};
