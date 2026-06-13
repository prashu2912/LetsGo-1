import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/VITE_GOOGLE_GEMINI_AI_API_KEY=(.*)/);
const API_KEY = match ? match[1].trim() : null;

const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro"
];

const prompt = `Generate a comprehensive and highly personalized Travel Plan for Location: Paris for 3 Days for Just Me with a Cheap budget. 

Your goal is to provide a trend-focused, budget-optimized, and exhaustive guide. Please follow these strict instructions:
1. **Nearby Famous & Hidden Places**: Identify and include both world-famous landmarks and "hidden gem" local spots nearby Paris. Ensure accuracy based on Google Maps data.
2. **Cheaper & Newly Started Services**: Specifically look for and include budget-friendly (cheap) options and suggest "newly started" or "trending" restaurants and services that offer great value.
3. **Transport Optimization**: Include detailed nearby transport options (local cabs, bike rentals, bike-taxis, or shuttle services) with estimated costs and specific advice on how to book them (e.g., apps or local stands).
4. **Food & Restaurants**: Suggest 5+ highly-rated but affordable restaurants reflecting the local cuisine. Include diverse options from street food to cozy cafes.
5. **Detailed Itinerary**: Provide a day-by-day plan (Morning, Afternoon, Evening) with:
   - Place Name, Exhaustive Description, Place Image URL (Unsplash), Geo-coordinates (lat, lng), Ticket Pricing/Entry Fee, Rating, and "Time to travel to" and "Stay duration".

IMPORTANT: Ensure the data is NOT limited to any specific region like Vizag unless asked. It MUST be accurate for the Paris provided.

Return the response strictly in raw JSON format with this structure:
{
  "tripName": "A catchy title for the Paris trip",
  "hotels": [],
  "restaurants": [],
  "itinerary": {},
  "transport": []
}
Do not include any text outside the JSON block. Do not use markdown code fences.`;

async function runTest() {
    for (const modelName of MODELS) {
        try {
            console.log(`\n🔍 Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 2048,
                },
            });
            const response = await result.response;
            console.log(`✅ ${modelName} works. Response length: ${response.text().length}`);
            break;
        } catch (error) {
            console.error(`❌ ${modelName} failed:`, error.message);
        }
    }
}

runTest();
