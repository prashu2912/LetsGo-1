import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationImage } from '@/hooks/useLocationImage';

function UserTripCardItem({ trip, onDelete }) {
    const { userSelection, tripData, id } = trip;
    const { imageUrl } = useLocationImage(userSelection?.location);

    return (
        <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
            {/* Gradient Overlay for modern look */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <Link to={'/view-trip/' + id} className="flex-1">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                        src={imageUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={userSelection?.location}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{userSelection?.location?.split(',')[0]}</span>
                    </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <h2 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 capitalize">
                        {userSelection?.location}
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700">{userSelection?.noOfDays} Days</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700">{userSelection?.traveler}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <span className="text-xs font-bold text-emerald-700">{userSelection?.budget}</span>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-6 pb-6 pt-2 flex justify-between items-center mt-auto">
                <Link to={'/view-trip/' + id} className="w-full mr-2">
                    <Button variant="outline" className="w-full rounded-2xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 font-bold text-xs py-5 transition-all">
                        View Details
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(id);
                    }}
                    className="h-10 w-10 min-w-[40px] rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-slate-100 bg-white"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default UserTripCardItem;
