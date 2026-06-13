import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCcw, Quote, Compass, Camera, Coffee, Mountain, Map as MapIcon } from 'lucide-react';
import { getAiResponse } from '../../service/AIModel';

const questions = [
    {
        id: 1,
        question: "What's your ideal morning on vacation?",
        options: [
            { id: 'a', text: 'Coffee in a bustling city cafe', icon: <Coffee className="w-6 h-6" /> },
            { id: 'b', text: 'Sunrise hike to a mountain peak', icon: <Mountain className="w-6 h-6" /> },
            { id: 'c', text: 'Peaceful stroll on a quiet beach', icon: <Camera className="w-6 h-6" /> },
            { id: 'd', text: 'Exploring a hidden library or museum', icon: <MapIcon className="w-6 h-6" /> },
        ]
    },
    {
        id: 2,
        question: "Pick a travel aesthetic:",
        options: [
            { id: 'a', text: 'Neon nights & skyscraper views', icon: <Sparkles className="w-6 h-6 text-purple-500" /> },
            { id: 'b', text: 'Rustic cottages & forest trails', icon: <Compass className="w-6 h-6 text-green-500" /> },
            { id: 'c', text: 'Vibrant markets & street food', icon: <Coffee className="w-6 h-6 text-orange-500" /> },
            { id: 'd', text: 'Luxury lounges & infinity pools', icon: <Sparkles className="w-6 h-6 text-blue-500" /> },
        ]
    },
    {
        id: 3,
        question: "What's your travel 'must-have'?",
        options: [
            { id: 'a', text: 'A camera for every moment', icon: <Camera className="w-6 h-6" /> },
            { id: 'b', text: 'Comfortable walking boots', icon: <Mountain className="w-6 h-6" /> },
            { id: 'c', text: 'A local language phrasebook', icon: <MapIcon className="w-6 h-6" /> },
            { id: 'd', text: 'A completely empty schedule', icon: <Coffee className="w-6 h-6" /> },
        ]
    }
];

function TravelVibe() {
    const [step, setStep] = useState(0); // 0: start, 1: quiz, 2: loading, 3: result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const startQuiz = () => setStep(1);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            generateVibe(newAnswers);
        }
    };

    const generateVibe = async (finalAnswers) => {
        setLoading(true);
        setStep(2);

        const prompt = `Based on these travel preferences: ${finalAnswers.join(', ')}. 
    Generate a creative "Travel Persona" name (like 'The Neon Nomad' or 'The Quiet Chronicler'). 
    Include a 2-sentence description of their travel style, 3 'vibe-check' emojis, and 2 destination recommendations. 
    Format the response as JSON with keys: "personaName", "description", "emojis", "recommendations" (array).`;

        try {
            const response = await getAiResponse(prompt);
            // Clean potential markdown code blocks from response
            const jsonResponse = response.replace(/```json|```/g, '').trim();
            setResult(JSON.parse(jsonResponse));
            setStep(3);
        } catch (error) {
            console.error("Error generating vibe:", error);
            // Fallback result in case of error
            setResult({
                personaName: "The Explorer",
                description: "You have a curious soul and love discovering new places, whether they are in the city or in nature.",
                emojis: "🌍 ✨ 🗺️",
                recommendations: ["Tokyo, Japan", "Swiss Alps"]
            });
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setCurrentQuestion(0);
        setAnswers([]);
        setResult(null);
    };

    return (
        <div className="py-24 px-6 md:px-16 bg-gradient-to-b from-slate-50 to-white" id="vibe-check">
            <div className="max-w-4xl mx-auto">
                {step === 0 && (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-medium text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Feature</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Unlock Your <span className="text-blue-600">Travel Persona</span>
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
                            Answer a few aesthetic questions and let our AI determine your unique travel vibe and ideal destinations.
                        </p>
                        <button
                            onClick={startQuiz}
                            className="px-10 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                        >
                            Start Vibe Check <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-slate-900 text-center">
                            {questions[currentQuestion].question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions[currentQuestion].options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.text)}
                                    className="group p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex items-center gap-6 text-left"
                                >
                                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {option.icon}
                                    </div>
                                    <span className="text-lg font-semibold text-slate-700 group-hover:text-slate-900">
                                        {option.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="text-center py-20 space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            <Sparkles className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Consulting the Travel Stars...</h3>
                        <p className="text-slate-500 italic">"Analyzing your vibe for the perfect match"</p>
                    </div>
                )}

                {step === 3 && result && (
                    <div className="glass-effect p-8 md:p-12 rounded-[2.5rem] border-2 border-blue-50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
                        <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 select-none">
                            {result.emojis}
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="space-y-2">
                                <p className="text-blue-600 font-bold tracking-widest uppercase text-sm">Your Travel Persona Is:</p>
                                <h3 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                                    {result.personaName}
                                </h3>
                            </div>

                            <div className="flex items-start gap-4">
                                <Quote className="w-10 h-10 text-blue-200 shrink-0" />
                                <p className="text-xl text-slate-600 leading-relaxed italic">
                                    {result.description}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <p className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <MapIcon className="w-5 h-5 text-indigo-500" />
                                    Recommended for you:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.recommendations.map((dest, i) => (
                                        <div key={i} className="px-6 py-4 bg-slate-50 rounded-2xl font-semibold text-slate-700 border border-slate-100 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            {dest}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={reset}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Try Again
                                </button>
                                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                                    Sign Up to Save Vibe
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TravelVibe;
