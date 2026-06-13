import React from 'react';
import { Plane, ExternalLink, Clock, CreditCard } from 'lucide-react';

function Flights({ trip }) {
    if (!trip?.tripData?.flights || trip?.tripData?.flights?.length === 0) return null;

    return (
        <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="p-3 bg-sky-100 text-sky-600 rounded-2xl">🛫</span>
                Flight / Transport Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trip?.tripData?.flights.map((flight, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        {/* Background subtle pattern or blob can go here if needed */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-sky-500" />
                                    {flight?.airlineName}
                                </h3>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="text-center">
                                        <p className="font-black text-slate-800">{flight?.departure}</p>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center relative">
                                        <div className="w-full h-[2px] bg-slate-200 absolute"></div>
                                        <Plane className="w-4 h-4 text-slate-400 rotate-90 absolute" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-slate-800">{flight?.arrival}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4 relative z-10">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                    <Clock className="w-4 h-4 text-sky-400" />
                                    {flight?.estimatedDuration}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                    <CreditCard className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-600 font-bold">{flight?.priceRange}</span>
                                </div>
                            </div>

                            {flight?.bookingLink && flight.bookingLink !== 'Nav' && (
                                <a
                                    href={flight?.bookingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                                >
                                    Book <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Flights;
