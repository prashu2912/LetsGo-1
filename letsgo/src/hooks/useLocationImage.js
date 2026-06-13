import { useState, useEffect } from 'react';

/**
 * A custom hook that fetches a real, identified image of a location
 * using the free Wikipedia Search & PageImages API.
 * Falls back to a deterministic, aesthetic placeholder if not found.
 */
export const useLocationImage = (location) => {
    const [imageUrl, setImageUrl] = useState("/placeholder.jpg");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!location) return;

        let isMounted = true;

        const fetchImage = async () => {
            setLoading(true);
            try {
                // Get the main city name without country for better search results
                const searchQuery = location.split(',')[0].trim();
                const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=1&prop=pageimages&piprop=original&format=json&origin=*`;

                const res = await fetch(url);
                const data = await res.json();

                const pages = data.query?.pages;
                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== "-1" && pages[pageId].original?.source) {
                        if (isMounted) {
                            setImageUrl(pages[pageId].original.source);
                            setLoading(false);
                        }
                        return;
                    }
                }

                // Fallback 1: Unsplash generic aesthetic tourism background
                if (isMounted) {
                    setImageUrl("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch location image:", error);
                if (isMounted) {
                    setImageUrl("/placeholder.jpg");
                    setLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [location]);

    return { imageUrl, loading };
};
