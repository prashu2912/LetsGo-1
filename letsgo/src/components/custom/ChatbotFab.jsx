import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Bot, User } from 'lucide-react';

const ChatbotFab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi there! I'm your AI Travel Assistant. Where are we heading next? 🌍" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Lightweight markdown to HTML specifically for Gemini
    const formatText = (text) => {
        if (!text) return null;
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>')
            .replace(/\n/g, '<br/>');
        return <div dangerouslySetInnerHTML={{ __html: html }} className="leading-relaxed space-y-1 break-words" />;
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const newHistory = [...messages, { role: 'user', text: input }];
        setMessages(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            // Use the actual AI chat function
            import('@/service/AIModel').then(async (module) => {
                const responseText = await module.getChatResponse(newHistory);
                setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
                setIsLoading(false);
            }).catch(err => {
                console.error("AI Dynamic Import Error", err);
                setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble thinking right now." }]);
                setIsLoading(false);
            });

        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: error.message || "Something went wrong!" }]);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">LetsGo Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                    }`}>
                                    {msg.role === 'user' ? msg.text : formatText(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-4 rounded-2xl text-sm shadow-sm bg-white text-slate-700 border border-slate-200 rounded-tl-none flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about travel..."
                            className="rounded-xl border-slate-200 focus:border-blue-500 transition-all h-11 disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-11 px-4 shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-white dark:border-slate-900 group relative"
            >
                {isOpen ? <X size={28} /> : <Bot size={28} />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                )}
            </button>
        </div>
    );
};

export default ChatbotFab;
