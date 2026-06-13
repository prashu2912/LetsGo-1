import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWithPlaces = ({ placeId }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);

    // Initial map setup
    useEffect(() => {
        if (mapRef.current && !mapInstance.current && placeId?.lat && placeId?.lng) {
            mapInstance.current = L.map(mapRef.current, {
                center: [placeId.lat, placeId.lng],
                zoom: 13,
                scrollWheelZoom: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            markerInstance.current = L.marker([placeId.lat, placeId.lng])
                .addTo(mapInstance.current)
                .bindPopup('<div class="p-2 font-medium text-slate-900">Your destination! 📍</div>');
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update map when placeId changes
    useEffect(() => {
        if (mapInstance.current && placeId?.lat && placeId?.lng) {
            const pos = [placeId.lat, placeId.lng];
            mapInstance.current.setView(pos, 13);

            if (markerInstance.current) {
                markerInstance.current.setLatLng(pos);
            } else {
                markerInstance.current = L.marker(pos)
                    .addTo(mapInstance.current)
                    .bindPopup('<div class="p-2 font-medium text-slate-900">Your destination! 📍</div>');
            }
        }
    }, [placeId]);

    if (!placeId || !placeId.lat || !placeId.lng) return null;

    return (
        <div className="w-full mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.25rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div
                    ref={mapRef}
                    className="relative h-[450px] w-full rounded-[1rem] overflow-hidden border border-slate-200 shadow-2xl bg-white"
                    style={{ zIndex: 1 }}
                />
            </div>
        </div>
    );
};

export default MapWithPlaces;
