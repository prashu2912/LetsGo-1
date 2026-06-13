
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import Itinerary from '../components/Itinerary';
import Transport from '../components/Transport';
import Restaurants from '../components/Restaurants';
import Flights from '../components/Flights';

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId]);

    const GetTripData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setTrip(docSnap.data());
            } else {
                console.log("No such document!");
                toast.error('No trip found!');
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
            if (error.message.includes("Database '(default)' not found")) {
                toast.error("Firebase Error: Firestore Database not found! Please create it in your Firebase Console.");
            } else {
                toast.error("Something went wrong while loading the trip.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading your custom adventure...</p>
            </div>
        );
    }

    return (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56">
            {/* Information Section */}
            <InfoSection trip={trip} />

            {/* Flights Options (New) */}
            <Flights trip={trip} />

            {/* Recommended Hotels */}
            <Hotels trip={trip} />

            {/* Recommended Restaurants (New) */}
            <Restaurants trip={trip} />

            {/* Daily Itinerary */}
            <Itinerary trip={trip} />

            {/* Transport Options (New) */}
            <Transport trip={trip} />

            {/* Footer */}
            <div className="mt-20 py-10 border-t border-slate-100 text-center">
                <h2 className="text-slate-400 text-sm">Created with ❤️ by LetsGo AI Trip Planner</h2>
            </div>
        </div>
    );
}

export default ViewTrip;
