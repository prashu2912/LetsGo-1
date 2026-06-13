import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, Award, Share2, MapPin } from 'lucide-react';

const WORLD_GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson";

function TravelMap() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const geoJsonLayer = useRef(null);
    const [geoData, setGeoData] = useState(null);
    const [visitedCountries, setVisitedCountries] = useState(new Set(['India', 'United States of America']));
    const [stats, setStats] = useState({ count: 2, percentage: 1.2 });

    useEffect(() => {
        fetch(WORLD_GEOJSON_URL)
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Error loading map data:", err));

        const saved = localStorage.getItem('visitedCountries');
        if (saved) {
            setVisitedCountries(new Set(JSON.parse(saved)));
        }
    }, []);

    // Initialize Map
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [20, 0],
                zoom: 2,
                minZoom: 2,
                scrollWheelZoom: false,
                zoomControl: true,
                attributionControl: false
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Handle GeoJSON and Visited Updates
    useEffect(() => {
        if (!mapInstance.current || !geoData) return;

        if (geoJsonLayer.current) {
            mapInstance.current.removeLayer(geoJsonLayer.current);
        }

        geoJsonLayer.current = L.geoJSON(geoData, {
            style: (feature) => {
                const isVisited = visitedCountries.has(feature.properties.name || feature.properties.NAME);
                return {
                    fillColor: isVisited ? '#2563eb' : '#f1f5f9',
                    weight: 1,
                    opacity: 1,
                    color: '#cbd5e1',
                    fillOpacity: isVisited ? 0.8 : 0.5
                };
            },
            onEachFeature: (feature, layer) => {
                layer.on({
                    click: (e) => {
                        const countryName = feature.properties.name || feature.properties.NAME;
                        setVisitedCountries(prev => {
                            const next = new Set(prev);
                            if (next.has(countryName)) next.delete(countryName);
                            else next.add(countryName);
                            return next;
                        });
                    },
                    mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({
                            fillOpacity: 0.9,
                            fillColor: visitedCountries.has(feature.properties.name || feature.properties.NAME) ? '#1d4ed8' : '#e2e8f0'
                        });
                    },
                    mouseout: (e) => {
                        const l = e.target;
                        const isVisited = visitedCountries.has(feature.properties.name || feature.properties.NAME);
                        l.setStyle({
                            fillColor: isVisited ? '#2563eb' : '#f1f5f9',
                            fillOpacity: isVisited ? 0.8 : 0.5
                        });
                    }
                });
                layer.bindTooltip(feature.properties.name || feature.properties.NAME);
            }
        }).addTo(mapInstance.current);

        // Update Stats
        const total = geoData.features.length;
        const count = visitedCountries.size;
        setStats({
            count,
            percentage: ((count / total) * 100).toFixed(1)
        });
        localStorage.setItem('visitedCountries', JSON.stringify(Array.from(visitedCountries)));

    }, [geoData, visitedCountries]);

    return (
        <div className="py-24 px-6 md:px-16 bg-white" id="scratch-map">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium text-sm">
                            <Globe className="w-4 h-4" />
                            <span>Interactive Tracker</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Your Personal <span className="text-indigo-600">Scratch Map</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Click on the countries you've explored to "scratch" them off your map. Track your progress and share your travel resume with friends.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center min-w-[140px]">
                            <p className="text-3xl font-black text-slate-900">{stats.count}</p>
                            <p className="text-sm text-slate-500 font-medium">Countries</p>
                        </div>
                        <div className="p-6 bg-indigo-600 rounded-3xl text-center min-w-[140px] text-white shadow-lg shadow-indigo-200">
                            <p className="text-3xl font-black">{stats.percentage}%</p>
                            <p className="text-sm text-indigo-100 font-medium">Of World</p>
                        </div>
                    </div>
                </div>

                <div className="relative h-[600px] rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-50">
                    <div ref={mapRef} className="h-full w-full bg-slate-50 z-0" />

                    {!geoData && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-medium italic">Unrolling the world map...</p>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-8 left-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg z-10 flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                        <span className="text-sm font-bold text-slate-700">Visited</span>
                        <div className="w-4 h-4 rounded-full bg-slate-200 ml-2"></div>
                        <span className="text-sm font-bold text-slate-700">To Explore</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelMap;
