
import React from 'react';
import { Star, MapPin, Globe, Phone } from 'lucide-react';
import { usePlaceImage } from '@/hooks/usePlaceImage';

function HotelCard({ hotel }) {
    // Pass geoCoordinates so each hotel gets a unique map image of its exact location
    const { imageUrl } = usePlaceImage(
        hotel?.hotelName,
        'hotel',
        hotel?.geoCoordinates
            ? { lat: parseFloat(hotel.geoCoordinates.lat), lng: parseFloat(hotel.geoCoordinates.lng) }
            : null
    );

    return (
        <div className="group h-full bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                    src={imageUrl}
                    alt={hotel?.hotelName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                    }}
                />
                {/* Map pin badge overlay — shows this is a real map location image */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" /> Live Map
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-900">{hotel?.rating}</span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{hotel?.hotelName}</h3>
                <p className="text-slate-500 text-xs flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{hotel?.hotelAddress}</span>
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-lg font-black text-blue-600 font-['Inter']">{hotel?.price}</span>
                    <div className="flex gap-2">
                        <a
                            href={hotel?.mapUrl && hotel?.mapUrl !== 'Nav'
                                ? hotel.mapUrl
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotelName + ' ' + hotel?.hotelAddress)}`}
                            target="_blank" rel="noreferrer"
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="View on Map"
                        >
                            <MapPin className="w-4 h-4" />
                        </a>
                        {hotel?.websiteUrl && hotel?.websiteUrl !== 'Nav' && (
                            <a
                                href={hotel.websiteUrl.startsWith('http') ? hotel.websiteUrl : `https://${hotel.websiteUrl}`}
                                target="_blank" rel="noreferrer"
                                className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full transition-colors" title="Visit Website"
                            >
                                <Globe className="w-4 h-4" />
                            </a>
                        )}
                        {hotel?.contactNumber && hotel?.contactNumber !== 'Nav' && (
                            <a href={`tel:${hotel.contactNumber}`}
                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors" title="Call Hotel"
                            >
                                <Phone className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Hotels({ trip }) {
    return (
        <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="p-3 bg-blue-100 text-blue-600 rounded-2xl">🏨</span>
                Hotel Recommendations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {trip?.tripData?.hotels?.map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    );
}

export default Hotels;
