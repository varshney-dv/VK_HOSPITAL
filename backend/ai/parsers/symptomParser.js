import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

/**
 * Structured Output Parser defined using Zod.
 * Enforces JSON response layout.
 */
export const symptomParser = StructuredOutputParser.fromZodSchema(
  z.object({
    speciality: z
      .string()
      .describe("Exactly one of: 'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'"),
    severity: z
      .enum(["low", "medium", "high"])
      .describe("The estimated severity of the symptoms"),
    possible_conditions: z
      .array(z.string())
      .describe("A list of high-level conditions to discuss with a doctor. Never diagnose with certainty."),
    precautions: z
      .array(z.string())
      .describe("A list of safe, general precautions to take while seeking medical advice (e.g. rest, hydration)."),
    emergency: z
      .boolean()
      .describe("Whether the symptoms require urgent/emergency medical attention")
  })
);
