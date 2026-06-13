
import React from 'react';
import { Clock, Star, MapPin, Map } from 'lucide-react';
import { usePlaceImage } from '@/hooks/usePlaceImage';

function ActivityCard({ activity }) {
    // Pass geoCoordinates for a unique map image of each itinerary place
    const { imageUrl } = usePlaceImage(
        activity?.placeName,
        'place',
        activity?.geoCoordinates
            ? { lat: parseFloat(activity.geoCoordinates.lat), lng: parseFloat(activity.geoCoordinates.lng) }
            : null
    );

    // Fall back priority: AI-provided URL → map image from hook
    const finalImg = activity?.placeImageUrl && activity.placeImageUrl.startsWith('http')
        ? activity.placeImageUrl
        : imageUrl;

    return (
        <div className="group bg-white rounded-[2rem] border border-slate-100/50 shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full bg-gradient-to-b from-white to-slate-50/30">
            <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0 m-3 mb-0 rounded-[1.5rem]">
                <img
                    src={finalImg}
                    alt={activity?.placeName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imageUrl;
                    }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/30 shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {activity?.bestTimeToVisit || 'Varies'}
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="flex items-center gap-1.5 bg-yellow-400/90 backdrop-blur-md text-yellow-950 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-yellow-950" />
                        <span>{activity?.rating || '4.5'}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h4 className="font-black text-slate-800 text-xl mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{activity?.placeName}</h4>
                <p className="text-slate-500 text-sm line-clamp-3 mb-5 leading-relaxed font-medium">{activity?.placeDetails}</p>

                <div className="mt-auto pt-4 border-t border-slate-100/80 flex items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{activity?.timeRequired}</span>
                    </div>
                    
                    <div className="flex bg-blue-50/80 px-3 py-1.5 rounded-xl">
                       <span className="font-bold text-blue-700">{activity?.ticketPricing}</span>
                    </div>
                    
                    <a
                        href={
                            activity?.geoCoordinates?.lat && activity?.geoCoordinates?.lng
                                ? `https://www.google.com/maps/search/?api=1&query=${activity.geoCoordinates.lat},${activity.geoCoordinates.lng}`
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity?.placeName)}`
                        }
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-center bg-slate-900 hover:bg-blue-600 text-white w-8 h-8 rounded-full transition-colors shadow-md"
                        title="View on Map"
                    >
                        <Map className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}

function Itinerary({ trip }) {
    const itinerary = trip?.tripData?.itinerary;
    if (!itinerary) return null;

    return (
        <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 flex items-center gap-4">
                <span className="p-4 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-3xl shadow-sm border border-emerald-50">🧭</span>
                Your Detailed Itinerary
            </h2>

            <div className="space-y-16 pl-2 md:pl-6">
                {Object.entries(itinerary).map(([day, activities], index) => (
                    <div key={index} className="relative pl-8 md:pl-12 border-l-[3px] border-slate-200/50 pb-4">
                        <div className="absolute -left-[14px] top-0 flex flex-col items-center">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-md ring-2 ring-emerald-50" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-wide flex items-center gap-3">
                            <span className="text-emerald-500">{day}</span>
                            <div className="h-px bg-slate-200 flex-1 hidden sm:block ml-4"></div>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activities.map((activity, actIndex) => (
                                <ActivityCard key={actIndex} activity={activity} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Itinerary;
