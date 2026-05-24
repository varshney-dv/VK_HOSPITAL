import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AiChecker = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);

  // Suggested symptoms for quick testing
  const sampleSymptoms = [
    { label: "Skin rash and itching", text: "I have red rashes on my arms and persistent skin itching for two days." },
    { label: "Headache & stiff neck", text: "I am experiencing a sudden, very severe headache along with stiffness in my neck and high fever." },
    { label: "Stomach ache & bloating", text: "I have stomach cramps, bloating, and nausea after eating meals since yesterday." }
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || symptoms.trim().length < 5) {
      toast.warn("Please describe your symptoms in more detail (at least 5 characters).");
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate loading steps to enhance the user experience
    setLoadingStep(1); // "Connecting to AI Clinician..."
    const step1 = setTimeout(() => setLoadingStep(2), 1000); // "Analyzing symptom indicators..."
    const step2 = setTimeout(() => setLoadingStep(3), 2000); // "Determining medical speciality..."
    const step3 = setTimeout(() => setLoadingStep(4), 3000); // "Finding available doctors..."

    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/analyze-symptoms`, {
        symptoms: symptoms.trim()
      });

      // Brief delay to allow the animations to feel natural
      await new Promise(resolve => setTimeout(resolve, 3800));

      if (data.success) {
        setResult(data);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.message || "Failed to analyze symptoms.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while connecting to the AI service.");
    } finally {
      // Clear timeouts just in case
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // Severity indicator color mapper
  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return { bg: "bg-red-50 text-red-700 border-red-200", label: "High Severity" };
      case "medium":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "Medium Severity" };
      case "low":
        return { bg: "bg-green-50 text-green-700 border-green-200", label: "Low Severity" };
      default:
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Informational" };
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto">
      {/* Header and Brand */}
      <div className="text-center pt-5 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight flex items-center justify-center gap-2">
          AI Symptom Checker <span className="text-primary text-2xl md:text-3xl">✨</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm md:text-base">
          Describe your symptoms in natural language, and our AI model will direct you to the correct department and available doctors.
        </p>
      </div>

      {/* Main Form Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden p-6 md:p-8 mb-10 transition-all duration-300 hover:shadow-lg">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="symptoms">
              How are you feeling today?
            </label>
            <textarea
              id="symptoms"
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., 'I have had a mild headache, scratchy throat, and runny nose since yesterday morning. No breathing difficulties...')"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700 resize-none text-sm md:text-base"
              disabled={loading}
            />
          </div>

          {/* Quick templates */}
          {!loading && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Try Examples:</span>
              {sampleSymptoms.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSymptoms(sample.text)}
                  className="text-xs bg-gray-50 hover:bg-primary/10 hover:text-primary border border-gray-200 hover:border-primary/20 text-gray-600 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !symptoms.trim()}
              className={`w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  Analyze Symptoms <span className="text-sm">🔍</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State Section */}
      {loading && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-12 text-center shadow-inner flex flex-col items-center justify-center space-y-6 animate-pulse">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-primary/15 rounded-full animate-ping"></div>
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg">
              AI
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold text-lg">AI Triage In Progress</p>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              {loadingStep === 1 && "Connecting to secure medical AI assistant..."}
              {loadingStep === 2 && "Analyzing safety and severity indicators..."}
              {loadingStep === 3 && "Determining recommended clinical specialty..."}
              {loadingStep === 4 && "Retrieving matching medical specialists..."}
            </p>
          </div>
          {/* Progress Dot Indicator */}
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4].map((dot) => (
              <div
                key={dot}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  loadingStep >= dot ? "bg-primary scale-125" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Emergency Alert Banner */}
          {result.aiAnalysis.emergency && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-xl shadow-sm flex items-start gap-3 animate-bounce">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div>
                <p className="font-bold text-base">Urgently Required Action</p>
                <p className="text-sm text-red-700 mt-0.5">
                  Your described symptoms indicate a potential medical emergency. Please seek immediate assistance or go to the nearest emergency room instead of waiting for a routine appointment.
                </p>
              </div>
            </div>
          )}

          {/* AI Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommended Routing</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{result.aiAnalysis.speciality}</h3>
                
                {/* Severity Badge */}
                {(() => {
                  const styles = getSeverityStyles(result.aiAnalysis.severity);
                  return (
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${styles.bg}`}>
                      {styles.label}
                    </span>
                  );
                })()}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50">
                <button
                  onClick={() => navigate(`/doctors/${result.aiAnalysis.speciality}`)}
                  className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1.5 group cursor-pointer"
                >
                  View all in department
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Possible Conditions Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Potential Conditions to Discuss</div>
              <ul className="space-y-2.5">
                {result.aiAnalysis.possible_conditions.map((condition, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary/70 mt-0.5">•</span>
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                *Note: These are only statistical possibilities to help you discuss with your practitioner and are not diagnosis.
              </p>
            </div>

            {/* Precautions Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suggested Precautions</div>
              <ul className="space-y-2.5">
                {result.aiAnalysis.precautions.map((precaution, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Doctors Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Recommended Doctors for You <span className="text-sm font-medium text-gray-400">({result.recommendedDoctors.length} available)</span>
            </h2>

            {result.recommendedDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {result.recommendedDoctors.map((doc, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/appointment/${doc._id}`)}
                    className="bg-white border border-blue-100 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2.5 hover:shadow-lg transition-all duration-500"
                  >
                    <div className="bg-blue-50 relative aspect-square overflow-hidden">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                        Available Now
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold text-base truncate">{doc.name}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{doc.speciality}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                        <span className="text-gray-400 font-medium">{doc.experience} Experience</span>
                        <span className="text-gray-900 font-semibold">₹{doc.fees}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
                <span className="text-3xl block mb-2">🧑‍⚕️</span>
                <p className="font-semibold text-gray-700">No specific {result.aiAnalysis.speciality} doctors are available currently.</p>
                <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                  You can search for general physicians or contact customer support to book custom appointments.
                </p>
                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-4 bg-primary text-white text-xs font-semibold px-5 py-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  Browse All Doctors
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Static Disclaimer */}
      <div className="mt-12 bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-5 text-center text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto shadow-inner">
        <span className="font-bold text-slate-600 block mb-1">Medical Disclaimer</span>
        AI recommendations are informational only and not a substitute for professional medical advice. If you are experiencing a medical emergency, please call your local emergency services immediately or visit the nearest emergency room.
      </div>
    </div>
  );
};

export default AiChecker;
