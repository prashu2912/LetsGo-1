
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env.local if dotenv is missing
function getApiKey() {
    try {
        const envPath = path.resolve(__dirname, 'letsgo', '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/VITE_GOOGLE_GEMINI_AI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const API_KEY = getApiKey();

if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE" || API_KEY.startsWith("AIza") === false) {
    console.error("❌ API_KEY is missing or invalid! Found:", API_KEY);
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testAI() {
    const prompt = "Generate a short 1-day trip plan for Paris in JSON format. Just return the JSON.";
    console.log("🚀 Testing AI with key:", API_KEY.substring(0, 10) + "...");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ AI Response received:");
        console.log(text);
    } catch (error) {
        console.error("❌ AI Error:", error.message);
        if (error.stack) console.error(error.stack);
    }
}

testAI();
