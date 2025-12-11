import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize without creating connection immediately to allow for runtime checking if needed,
// though here we assume key is present.
const ai = new GoogleGenAI({ apiKey });

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "API Keyが設定されていません。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, concise AI assistant for a smart home display. Your answers should be short, friendly, and in Japanese. Limit responses to 2-3 sentences unless asked for more detail.",
      }
    });

    return response.text || "すみません、よく聞き取れませんでした。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "申し訳ありません。現在AIサービスに接続できません。";
  }
};