
import React from 'react';
import { Car, Bike, Train, Info } from 'lucide-react';

function Transport({ trip }) {
    const transport = trip?.tripData?.transport;

    if (!transport) return null;

    return (
        <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">🚗</span>
                Transport Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transport.map((item, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                                {item?.type?.toLowerCase().includes('cab') || item?.type?.toLowerCase().includes('uber') ? <Car className="w-6 h-6 text-indigo-600" /> :
                                    item?.type?.toLowerCase().includes('bike') ? <Bike className="w-6 h-6 text-indigo-600" /> :
                                        <Train className="w-6 h-6 text-indigo-600" />}
                            </div>
                            <span className="text-sm font-black text-emerald-600 font-['Inter']">{item.estimatedCost}</span>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{item.type}</h3>
                            <p className="text-slate-500 text-xs mb-3">{item.details}</p>
                        </div>

                        <div className="mt-auto flex items-center gap-2 text-[10px] bg-indigo-50 text-indigo-700 p-3 rounded-xl font-bold">
                            <Info className="w-3 h-3" />
                            <span>Booking: {item.bookingInfo}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Transport;
