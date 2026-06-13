import { useState, useEffect } from 'react';

/**
 * Fetches a unique image for a place/hotel/restaurant.
 *
 * Priority:
 *  1. If geoCoordinates are valid → use OpenStreetMap static map centered on that exact location
 *  2. Otherwise → Wikipedia PageImages API search by name
 *  3. Final fallback → curated Unsplash photo by category
 *
 * @param {string} name - Place/hotel/restaurant name
 * @param {string} category - 'hotel' | 'restaurant' | 'place'
 * @param {{ lat: number, lng: number } | null} geoCoordinates - Optional coordinates
 */
const FALLBACKS = {
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    place: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
};

const isValidCoord = (coords) =>
    coords &&
    typeof coords.lat === 'number' &&
    typeof coords.lng === 'number' &&
    coords.lat !== 0 &&
    coords.lng !== 0;

const buildMapImageUrl = ({ lat, lng }, zoom = 17) => {
    // OpenStreetMap static map — free, no API key, unique per location with a red marker
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=600x400&maptype=mapnik&markers=${lat},${lng},red-marker-m`;
};

export const usePlaceImage = (name, category = 'place', geoCoordinates = null) => {
    const fallback = FALLBACKS[category] || FALLBACKS.place;
    const [imageUrl, setImageUrl] = useState(fallback);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const resolve = (url) => {
            if (isMounted) { setImageUrl(url); setLoading(false); }
        };

        // 1️⃣ If we have valid geo-coordinates, use OpenStreetMap static map
        if (isValidCoord(geoCoordinates)) {
            const mapUrl = buildMapImageUrl(geoCoordinates);
            resolve(mapUrl);
            return () => { isMounted = false; };
        }

        // 2️⃣ No coordinates — try Wikipedia PageImages by name
        if (!name) { resolve(fallback); return; }

        const fetchWiki = async () => {
            setLoading(true);
            try {
                const q = name.split(',')[0].trim();
                const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&prop=pageimages&piprop=original&format=json&origin=*`;

                const res = await fetch(url);
                const data = await res.json();
                const pages = data.query?.pages;

                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    const src = pages[pageId]?.original?.source;
                    if (pageId !== '-1' && src) {
                        resolve(src);
                        return;
                    }
                }
                resolve(fallback);
            } catch {
                resolve(fallback);
            }
        };

        fetchWiki();
        return () => { isMounted = false; };
    }, [name, category, geoCoordinates?.lat, geoCoordinates?.lng]);

    return { imageUrl, loading };
};
