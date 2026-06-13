import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GOOGLE_GEMINI_AI_API_KEY is missing from environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.5-pro",
  "gemini-pro-latest"
];

/**
 *  Generates a response from the AI model.
 *  Tries multiple models to handle potential 404 errors for specific versions.
 */
export const getAiResponse = async (prompt) => {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !API_KEY.startsWith("AIza")) {
    throw new Error("API_KEY_MISSING");
  }

  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`🤖 [AI] Attempting ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      // Simpler generation method for better compatibility across models
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      const text = response.text();

      if (text && text.length > 50) {
        console.log(`✅ [AI] Success with ${modelName}`);
        return text;
      }
      throw new Error("Empty or too short response from AI.");

    } catch (error) {
      console.warn(`⚠️ [AI] Model ${modelName} failed:`, error.message);
      lastError = error;

      // If it's a quota error, stop trying others
      if (error.message.includes("429") || error.message.includes("quota")) {
        throw new Error("API_QUOTA_EXCEEDED");
      }

      // If it's a 404, we continue to the next model in the list
    }
  }

  console.error("❌ [AI] All models failed. Last error:", lastError.message);
  throw lastError;
};

/**
 * Generates a conversational response for the AI Chatbot.
 */
export const getChatResponse = async (chatHistory) => {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !API_KEY.startsWith("AIza")) {
    throw new Error("API_KEY_MISSING");
  }

  // Format history for Gemini API
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const systemPrompt = {
    role: 'user',
    parts: [{ text: "You are the 'LetsGo AI Travel Assistant', a friendly, concise, and highly knowledgeable travel expert. Help users plan trips, suggest destinations, find budget deals, and answer questions about the world. Keep your responses short, trendy, and nicely formatted using markdown and emojis when appropriate. Never use markdown code blocks for normal text." }]
  };

  let lastChatError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`🤖 [Chatbot] Attempting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [systemPrompt, ...formattedHistory],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      const response = await result.response;
      const text = response.text();

      if (text) {
        return text;
      }
    } catch (error) {
      console.warn(`⚠️ [Chatbot] Model ${modelName} failed:`, error.message);
      lastChatError = error;

      // Stop trying if it is a general API key error or prompt flag, but usually let it keep trying for quota
      if (error.message.includes("API key not valid")) {
        throw new Error("Your API key is invalid.");
      }
    }
  }

  console.error("❌ [Chatbot] All models failed for chat. Last error:", lastChatError?.message);
  throw new Error("I'm having trouble connecting to my travel database right now. Please try again later!");
};

