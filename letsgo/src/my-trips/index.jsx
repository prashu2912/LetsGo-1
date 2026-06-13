import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/service/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import UserTripCardItem from './components/UserTripCardItem';
import { toast } from 'sonner';
import { Compass, Sparkles, Plane, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function MyTrips() {
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                GetUserTrips(user.email);
            } else {
                setLoading(false);
                // Maybe redirect or show empty state
            }
        });

        return () => unsubscribe();
    }, []);

    const GetUserTrips = async (email) => {
        setLoading(true);
        setUserTrips([]);
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', email));
        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ ...doc.data(), id: doc.id });
        });
        // Sort by latest first
        trips.sort((a, b) => b.id - a.id);
        setUserTrips(trips);
        setLoading(false);
    };

    const deleteTrip = async (tripId) => {
        try {
            await deleteDoc(doc(db, "AITrips", tripId));
            setUserTrips(userTrips.filter(trip => trip.id !== tripId));
            toast.success("Trip deleted successfully!");
        } catch (error) {
            console.error("Error deleting trip:", error);
            toast.error("Failed to delete trip.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-100 pt-32 pb-16 px-6 md:px-16 lg:px-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Your Adventures</span>
                        </div>
                        <h2 className="font-black text-4xl md:text-5xl text-slate-900 tracking-tight">
                            My <span className="text-blue-600">Trips</span> 🗺️
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl font-medium">
                            Explore your past itineraries and future dreams, all in one place.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/create-trip')}
                        className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl px-8 py-7 font-bold text-lg transition-all hover:scale-105"
                    >
                        + Create New Trip
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <div key={index} className="h-[400px] w-full bg-slate-200 animate-pulse rounded-3xl"></div>
                        ))}
                    </div>
                ) : userTrips?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                        {userTrips.map((trip, index) => (
                            <UserTripCardItem key={index} trip={trip} onDelete={deleteTrip} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm px-6">
                        <div className="bg-slate-50 p-8 rounded-full mb-8">
                            <Plane className="w-20 h-20 text-slate-300 stroke-[1.5]" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-4">No Trips Found Yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                            Your travel history is looking a bit empty! Let's change that and start planning your next great escape.
                        </p>
                        <Button
                            onClick={() => navigate('/create-trip')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all hover:scale-105"
                        >
                            Generate My First Trip
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTrips;
