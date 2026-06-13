
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/VITE_GOOGLE_GEMINI_AI_API_KEY=(.*)/);
const API_KEY = match ? match[1].trim() : null;

if (!API_KEY) {
    console.error("❌ API_KEY not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function runTest() {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of models) {
        try {
            console.log(`🔍 Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'Hello'");
            const response = await result.response;
            console.log(`✅ ${modelName} works: ${response.text()}`);
            break; // Stop after first success
        } catch (error) {
            console.error(`❌ ${modelName} failed: ${error.message}`);
        }
    }
}

runTest();
