import express from "express";
import { analyzeSymptoms } from "../controllers/aiController.js";

const aiRouter = express.Router();

// Public route for symptom analysis
aiRouter.post("/analyze-symptoms", analyzeSymptoms);

export default aiRouter;
