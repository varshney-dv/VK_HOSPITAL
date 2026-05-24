import { runSymptomAnalysis } from "../ai/chains/symptomAnalysisChain.js";
import { validateAIResponse } from "../ai/utils/validateAIResponse.js";
import doctorModel from "../modules/doctorModel.js";

/**
 * Controller to handle symptom analysis and doctor recommendations.
 * POST /api/ai/analyze-symptoms
 * 
 * @param {object} req 
 * @param {object} res 
 */
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid and detailed description of your symptoms (at least 5 characters)."
      });
    }

    // Call LangChain symptom analysis chain
    let parsedResult;
    try {
      parsedResult = await runSymptomAnalysis(symptoms.trim());
    } catch (apiError) {
      console.error("LangChain AI execution failed: ", apiError);
      return res.status(500).json({
        success: false,
        message: "Symptom analysis is temporarily unavailable. Please try again later or consult a general physician directly.",
        error: apiError.message
      });
    }

    // Validate and sanitize AI response
    const aiAnalysis = validateAIResponse(parsedResult);

    // Query database for matching available doctors based on the mapped speciality
    let recommendedDoctors = [];
    try {
      recommendedDoctors = await doctorModel.find({
        speciality: aiAnalysis.speciality,
        available: true
      }).select(["-password", "-email"]); // Exclude sensitive information
    } catch (dbError) {
      console.error("Database query for matching doctors failed: ", dbError);
      // We still return the AI analysis even if doctor querying fails
    }

    // Send the final response
    return res.json({
      success: true,
      aiAnalysis,
      recommendedDoctors
    });

  } catch (error) {
    console.error("Error in AI Controller: ", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during symptom analysis.",
      error: error.message
    });
  }
};
