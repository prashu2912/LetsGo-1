import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/VITE_GOOGLE_GEMINI_AI_API_KEY=(.*)/);
const API_KEY = match ? match[1].trim() : null;

const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = `Generate a comprehensive and highly personalized Travel Plan for Location: Paris for 3 Days for Just Me with a Cheap budget. 

Return strictly JSON with tripName, hotels, restaurants, itinerary, and transport arrays. Do not include markdown code fences.`;

async function runTest() {
    try {
        console.log(`\n🔍 Testing gemini-2.5-flash...`);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const response = await result.response;
        console.log(`✅ Success! Response length: ${response.text().length}`);
    } catch (error) {
        console.error(`❌ Failed:`, error.message);
    }
}

runTest();
