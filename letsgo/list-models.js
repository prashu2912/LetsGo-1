import fs from 'fs';

const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/VITE_GOOGLE_GEMINI_AI_API_KEY=(.*)/);
const API_KEY = match ? match[1].trim() : null;

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            const available = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name);
            fs.writeFileSync('available-models.json', JSON.stringify(available, null, 2));
            console.log("Wrote to available-models.json");
        } else {
            console.error("Error fetching models:", data);
        }
    } catch (err) {
        console.error("Network error:", err);
    }
}
listModels();
