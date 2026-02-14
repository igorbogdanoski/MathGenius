import { GoogleGenAI, SchemaType } from "@google/genai";
import { Problem } from '../types';

// In a real scenario, we use the API key. 
// For this demo, we mock the response to avoid crashing if no key is present.
const isConfigured = !!process.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (isConfigured) {
  ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY as string });
}

export const generateExplanation = async (problem: Problem, language: string): Promise<string> => {
  if (!ai) return "AI Configuration missing. Using static explanation.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the math problem "${problem.question[language as keyof typeof problem.question]}" to a 14 year old student in ${language}. 
      Keep it brief.
      IMPORTANT: Wrap all mathematical formulas, variables, and numbers in LaTeX delimiters '$' (e.g., $y=2x$, $10^{\\circ}$).`,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("AI Error", error);
    return "AI service temporarily unavailable.";
  }
};

export const generateSVG = async (description: string): Promise<string | null> => {
  if (!ai) return null;

  try {
    const prompt = `Create a simple, clean, flat-design SVG illustration for a math problem educational app. 
    The description of the scene is: "${description}".
    
    Rules:
    1. Return ONLY the <svg> code. Do not wrap it in markdown ticks or add text.
    2. Use simple shapes and vibrant colors suitable for a high school math app.
    3. Keep the SVG simpler rather than complex.
    4. Ensure viewBox is "0 0 200 200".
    5. Do NOT include any text inside the SVG, only shapes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    let svg = response.text || "";
    svg = svg.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    return svg;
  } catch (error) {
    console.error("AI SVG Error", error);
    return null;
  }
};

export const generateSimilarProblem = async (originalProblem: Problem, language: string): Promise<Problem | null> => {
  if (!ai) return null;

  try {
    const prompt = `
      Act as a math teacher. I have a problem: "${originalProblem.question.EN}".
      Create a NEW variation of this problem with different numbers but the exact same logic and difficulty.
      Return valid JSON matching this structure:
      {
        "question": { "EN": "...", "MK": "...", "SQ": "...", "TR": "..." },
        "correctAnswer": "...",
        "ai_tutor_logic": {
          "hint": { "EN": "...", "MK": "...", "SQ": "...", "TR": "..." },
          "explanation": { "EN": "...", "MK": "...", "SQ": "...", "TR": "..." }
        }
      }
      IMPORTANT:
      1. Ensure translations are accurate.
      2. The correct answer must be calculated correctly based on the new numbers.
      3. Wrap all mathematical formulas and variables in LaTeX delimiters '$' (e.g. $y=mx+c$).
      4. Return ONLY the JSON string, no markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    
    // Construct new problem object based on original
    return {
      ...originalProblem,
      id: `${originalProblem.id}_var_${Date.now()}`,
      question: data.question,
      correctAnswer: data.correctAnswer,
      ai_tutor_logic: data.ai_tutor_logic,
      // Keep type and config but clear specific points if they don't match new math
      // For complex graph problems, we might need more advanced AI logic, 
      // but for input/text problems this works great.
      graphConfig: undefined 
    };
  } catch (error) {
    console.error("Variation Error", error);
    return null;
  }
};