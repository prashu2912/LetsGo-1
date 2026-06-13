import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!API_KEY) {
    console.error("MISSING API KEY");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const getChatResponse = async (chatHistory) => {
    const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const systemPrompt = {
        role: 'user',
        parts: [{ text: "You are the 'LetsGo AI Travel Assistant'..." }]
    };

    const modelName = "gemini-2.5-flash";

    try {
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
        return response.text();
    } catch (error) {
        console.error("API ERROR:", error);
    }
};

const history = [
    { role: 'bot', text: 'Hi there! I am your AI Travel Assistant.' },
    { role: 'user', text: 'What are some hidden gems in Paris?' }
];

getChatResponse(history).then(res => console.log("RESPONSE:", res));
