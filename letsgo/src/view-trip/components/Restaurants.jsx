
import React from 'react';
import { Utensils, Star, MapPin, Globe, Phone } from 'lucide-react';
import { usePlaceImage } from '@/hooks/usePlaceImage';

function RestaurantCard({ restaurant }) {
    // Pass geoCoordinates so each restaurant gets a unique map image
    const { imageUrl } = usePlaceImage(
        restaurant?.restaurantName,
        'restaurant',
        restaurant?.geoCoordinates
            ? { lat: parseFloat(restaurant.geoCoordinates.lat), lng: parseFloat(restaurant.geoCoordinates.lng) }
            : null
    );

    return (
        <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Image Header */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                    src={imageUrl}
                    alt={restaurant?.restaurantName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
                    }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Live Map badge */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" /> Live Map
                </div>
                {/* Cuisine badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {restaurant?.cuisine}
                    </span>
                </div>
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-900">{restaurant?.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{restaurant?.restaurantName}</h3>
                <p className="text-slate-400 text-xs flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{restaurant?.address}</span>
                </p>
                <p className="text-slate-600 text-xs italic mb-4 line-clamp-2">"{restaurant?.description}"</p>
                <div className="flex gap-2 flex-wrap">
                    <a
                        href={restaurant?.mapUrl && restaurant?.mapUrl !== 'Nav'
                            ? restaurant.mapUrl
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant?.restaurantName + ' ' + restaurant?.address)}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition-colors text-xs font-bold"
                    >
                        <MapPin className="w-3 h-3" /> Map
                    </a>
                    {restaurant?.websiteUrl && restaurant?.websiteUrl !== 'Nav' && (
                        <a
                            href={restaurant.websiteUrl.startsWith('http') ? restaurant.websiteUrl : `https://${restaurant.websiteUrl}`}
                            target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full transition-colors text-xs font-bold"
                        >
                            <Globe className="w-3 h-3" /> Site
                        </a>
                    )}
                    {restaurant?.contactNumber && restaurant?.contactNumber !== 'Nav' && (
                        <a
                            href={`tel:${restaurant.contactNumber}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors text-xs font-bold"
                        >
                            <Phone className="w-3 h-3" /> Call
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function Restaurants({ trip }) {
    if (!trip?.tripData?.restaurants) return null;

    return (
        <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="p-3 bg-rose-100 text-rose-600 rounded-2xl">🍽️</span>
                Famous Restaurants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {trip?.tripData?.restaurants.map((restaurant, index) => (
                    <RestaurantCard key={index} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}

export default Restaurants;
