
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Wallet, Users, MapPin } from 'lucide-react';
import { useLocationImage } from '@/hooks/useLocationImage';

function InfoSection({ trip }) {
    const { imageUrl } = useLocationImage(trip?.userSelection?.location);

    return (
        <div className="mb-12 w-full flex flex-col items-center">
            <div className="relative h-[300px] md:h-[500px] w-full max-w-7xl rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
                <img
                    src={imageUrl}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 blur-[2px] scale-105 group-hover:blur-none"
                    alt={trip?.userSelection?.location}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-20 left-10 md:left-16 text-white text-left z-10 w-full pr-10">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 drop-shadow-2xl">
                        {trip?.userSelection?.location}
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-lg">Your Custom Trip Itinerary</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 md:px-10 rounded-[2rem] -mt-12 relative z-20 mx-4 md:mx-auto border border-slate-100 max-w-fit transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-slate-700">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-base font-bold">{trip?.userSelection?.noOfDays} Days</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-slate-700">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                    <span className="text-base font-bold">{trip?.userSelection?.budget}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-slate-700">
                    <Users className="w-5 h-5 text-rose-500" />
                    <span className="text-base font-bold font-['Inter']">{trip?.userSelection?.traveler}</span>
                </div>
            </div>
        </div>
    );
}

export default InfoSection;
