import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629, // Default to India center
};

const MapWithPlaces = ({ placeId }) => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    // The script is already loaded in index.html, so we can just use window.google

    useEffect(() => {
        if (!placeId || !window.google) return;

        // Use a dummy div for PlacesService if map is not ready, or use Map directly if ready
        const dummyService = new window.google.maps.places.PlacesService(document.createElement('div'));

        // 1. Get Details for the selected place
        dummyService.getDetails({ placeId, fields: ['geometry', 'name'] }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry && place.geometry.location) {
                const newCenter = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setCenter(newCenter);

                // 2. If map is loaded, we can fetch nearby tourist attractions or restaurants
                if (map) {
                    map.panTo(newCenter);
                    fetchNearbyPlaces(newCenter, map);
                } else {
                    // If map is not loaded yet, fetch places using the dummy service
                    fetchNearbyPlacesWithService(newCenter, dummyService);
                }
            }
        });

    }, [placeId]);

    const fetchNearbyPlaces = (location, mapInstance) => {
        const service = new window.google.maps.places.PlacesService(mapInstance);
        executeSearch(service, location);
    };

    const fetchNearbyPlacesWithService = (location, service) => {
        executeSearch(service, location);
    };

    const executeSearch = (service, location) => {
        const request = {
            location,
            radius: '5000', // 5 km radius
            type: ['tourist_attraction'],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setPlaces(results);
            }
        });
    };

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
        // If we already have a center that is not default, fetch places
        if (center.lat !== defaultCenter.lat || center.lng !== defaultCenter.lng) {
            fetchNearbyPlaces(center, mapInstance);
        }
    }, [center]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return (
        <div className="w-full mt-5">
            <h2 className="text-lg font-medium mb-3">Nearby Tourist Attractions</h2>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Render a marker for the selected city/location (optional, a different color could be used) */}

                {/* Render nearby places */}
                {places.map((place) => (
                    <MarkerF
                        key={place.place_id}
                        position={{
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        }}
                        onClick={() => setSelectedPlace(place)}
                    />
                ))}

                {selectedPlace && (
                    <InfoWindowF
                        position={{
                            lat: selectedPlace.geometry.location.lat(),
                            lng: selectedPlace.geometry.location.lng(),
                        }}
                        onCloseClick={() => setSelectedPlace(null)}
                    >
                        <div className="p-2 max-w-xs">
                            <h3 className="font-bold text-sm">{selectedPlace.name}</h3>
                            <p className="text-xs text-gray-600">{selectedPlace.vicinity}</p>
                            {selectedPlace.rating && (
                                <p className="text-xs mt-1">⭐ {selectedPlace.rating}</p>
                            )}
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </div>
    );
};

export default MapWithPlaces;
