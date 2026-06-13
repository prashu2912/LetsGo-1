import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Wallet, Sparkles } from 'lucide-react';

const destinations = [
    {
        name: "Prague, Czech Republic",
        tagline: "The City of a Hundred Spires",
        budget: "Low ($30-40/day)",
        image: "/student-picks/prague.png",
        highlight: "Old Town Magic",
        color: "from-orange-500 to-red-600"
    },
    {
        name: "Bali, Indonesia",
        tagline: "Island of the Gods",
        budget: "Very Low ($25-35/day)",
        image: "/student-picks/bali.png",
        highlight: "Tropical Paradise",
        color: "from-emerald-500 to-teal-700"
    },
    {
        name: "Lisbon, Portugal",
        tagline: "The City of Seven Hills",
        budget: "Medium ($50-60/day)",
        image: "/student-picks/lisbon.png",
        highlight: "Coastal Charm",
        color: "from-blue-500 to-indigo-700"
    },
    {
        name: "Budapest, Hungary",
        tagline: "Paris of the East",
        budget: "Low ($35-45/day)",
        image: "/student-picks/budapest.png",
        highlight: "Danube Night Views",
        color: "from-purple-500 to-pink-600"
    }
];

function StudentExplorer() {
    return (
        <div className="py-20 px-6 md:px-16 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1 rounded-full text-sm font-bold">
                            STUDENT PICKS 2024
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                            Explore Without <span className="text-blue-600">The Debt</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl">
                            Curated destinations that offer the best student experiences, high energy, and the lowest costs.
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-full px-8 py-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold group">
                        View All Destinations
                        <Sparkles className="ml-2 w-4 h-4 text-blue-500 group-hover:animate-pulse" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((dest, index) => (
                        <div
                            key={index}
                            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 cursor-pointer"
                        >
                            {/* Image Layer */}
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Content Layer */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <div className={`w-12 h-1 mb-4 rounded-full bg-gradient-to-r ${dest.color}`} />
                                <Badge className="w-fit mb-3 bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30">
                                    {dest.highlight}
                                </Badge>
                                <h3 className="text-2xl font-black leading-tight mb-2 tracking-tight group-hover:translate-x-1 transition-transform border-none">
                                    {dest.name}
                                </h3>
                                <p className="text-white/70 text-sm mb-6 line-clamp-2 italic">"{dest.tagline}"</p>

                                <div className="flex items-center gap-4 text-sm font-bold bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                        <span>{dest.budget}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Button */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100 transition-transform">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                                    <MapPin className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentExplorer;
