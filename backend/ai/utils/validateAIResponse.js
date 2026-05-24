const ALLOWED_SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist"
];

const ALLOWED_SEVERITIES = ["low", "medium", "high"];

/**
 * Validates and sanitizes structured output from the LangChain sequence.
 * Enforces category validation and maps specialities to allowed options.
 * 
 * @param {object} parsedResponse 
 * @returns {object} Sanitized and type-safe response
 */
export const validateAIResponse = (parsedResponse) => {
  const fallbackResponse = {
    speciality: "General physician",
    severity: "medium",
    possible_conditions: ["General symptoms requiring evaluation"],
    precautions: ["Seek professional medical evaluation.", "Rest and monitor your symptoms."],
    emergency: false
  };

  if (!parsedResponse || typeof parsedResponse !== 'object') {
    return fallbackResponse;
  }

  const validated = {};

  // 1. Validate speciality and map to allowed set (case-insensitive check)
  if (parsedResponse.speciality && typeof parsedResponse.speciality === 'string') {
    const matched = ALLOWED_SPECIALITIES.find(
      s => s.toLowerCase() === parsedResponse.speciality.trim().toLowerCase()
    );
    validated.speciality = matched || "General physician";
  } else {
    validated.speciality = "General physician";
  }

  // 2. Validate severity
  if (
    parsedResponse.severity && 
    typeof parsedResponse.severity === 'string' && 
    ALLOWED_SEVERITIES.includes(parsedResponse.severity.toLowerCase())
  ) {
    validated.severity = parsedResponse.severity.toLowerCase();
  } else {
    validated.severity = "medium";
  }

  // 3. Validate possible conditions array
  if (Array.isArray(parsedResponse.possible_conditions)) {
    validated.possible_conditions = parsedResponse.possible_conditions
      .filter(item => typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim());
  } else {
    validated.possible_conditions = ["Consult a doctor for diagnostic possibilities"];
  }

  // 4. Validate precautions array
  if (Array.isArray(parsedResponse.precautions)) {
    validated.precautions = parsedResponse.precautions
      .filter(item => typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim());
    if (validated.precautions.length === 0) {
      validated.precautions = fallbackResponse.precautions;
    }
  } else {
    validated.precautions = fallbackResponse.precautions;
  }

  // 5. Validate emergency boolean
  if (typeof parsedResponse.emergency === 'boolean') {
    validated.emergency = parsedResponse.emergency;
  } else if (typeof parsedResponse.emergency === 'string') {
    validated.emergency = parsedResponse.emergency.toLowerCase() === 'true';
  } else {
    validated.emergency = false;
  }

  return validated;
};
