/* global google */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getAiResponse } from '../service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider, db } from '@/service/firebaseConfig';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import MapWithPlaces from '@/components/MapWithPlaces';
import { VIZAG_FALLBACK_DATA } from '@/constants/fallbacks';

/* ──────────────────────────────────────────────────────────
   NEW OpenStreetMap Nominatim Autocomplete Service
   ────────────────────────────────────────────────────────── */
const PlaceAutoComplete = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchPlaces = debounce(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&featuretype=city&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching places", error);
    }
  }, 500);

  useEffect(() => {
    fetchPlaces(input);
    return () => fetchPlaces.cancel();
  }, [input]);

  return (
    <div className="relative w-full">
      <Input
        value={input}
        placeholder="Enter a city (e.g. London)..."
        onChange={(e) => setInput(e.target.value)}
        className="w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto shadow-xl">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setInput(s.display_name);
                onSelect(s.display_name, { lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                setSuggestions([]);
              }}
              className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */

const CreateTrip = () => {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (name, value) => {
    if (name === 'noOfDays') {
      const days = Number(value);
      if (days > 10) return toast('Please enter less than 10 days');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setOpenDialog(false);
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error("Login Error:", error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const onGenerateTrip = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const days = +formData?.noOfDays || 0;
    if (days > 10) return toast('Please enter less than 10 days');
    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.origin)
      return toast('Please fill all the fields');

    setLoading(true);

    // Prompt Enhancement
    const FINAL_PROMPT = AI_PROMPT
      .replace('{origin}', formData.origin)
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    try {
      toast.info('🚀 Generating your ultimate trip... this might take 15-20 seconds!');

      let parsedData = null;
      let attempt = 0;
      let maxAttempts = 3;

      while (attempt < maxAttempts) {
        try {
          const responseText = await getAiResponse(FINAL_PROMPT);

          // Enhanced JSON Cleaning logic focusing on just fixing common structural breaks
          // instead of aggressive regexes which might break valid keys/values.
          let cleanedJsonText = responseText.trim();
          
          if (cleanedJsonText.startsWith("```json")) {
            cleanedJsonText = cleanedJsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          }

          // A more robust way to fix unescaped quotes inside string values without breaking structure
          // This is a naive cleanup, but usually just JSON.parse(responseText) is enough when responseMimeType is json.
          try {
            parsedData = JSON.parse(cleanedJsonText);
          } catch (initialParseError) {
             console.warn("Initial parse failed, attempting strict structural extraction", initialParseError);
             const jsonMatch = cleanedJsonText.match(/\{[\s\S]*\}/);
             if (jsonMatch) {
               cleanedJsonText = jsonMatch[0];
               // Strip trailing commas from objects or arrays which often break JSON.parse
               cleanedJsonText = cleanedJsonText.replace(/,\s*([\]}])/g, '$1');
               parsedData = JSON.parse(cleanedJsonText);
             } else {
               throw new Error("No JSON object found in response");
             }
          }
          
          console.log('✅ AI Plan Generated:', parsedData);
          break; // Success, exit the retry loop
        } catch (parseErr) {
          attempt++;
          console.error(`JSON Parse Error (Attempt ${attempt}/${maxAttempts}):`, parseErr.message);
          if (attempt >= maxAttempts) {
            throw new Error("Format Error: AI returned invalid data structurally. Please try again.");
          }
          // Optional short wait before retrying to give the API a breather
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      await saveTripToFirestore(parsedData);
    } catch (err) {
      console.error("AI Generation Error:", err);

      if (err.message === "API_KEY_MISSING") {
        toast.error("Configuration Error: Gemini API Key is missing!");
      } else {
        toast.error("AI Service error: " + (err.message || "Please check your network or quota."));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveTripToFirestore = async (tripData) => {
    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: tripData,
        userEmail: user?.email,
        id: docId
      });
      setLoading(false);
      toast.success('🎉 Your personalized trip is ready!');
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Firestore Save Error:", error);
      if (error.message.includes("Database '(default)' not found")) {
        toast.error("Firebase Error: Firestore Database not found! Please create a 'Cloud Firestore' database in your Firebase Console.", {
          duration: 5000,
        });
      } else {
        toast.error('Failed to save trip to database.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Trendy MakeMyTrip style Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent h-full"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 -mt-20">
          <h2 className="font-black text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl tracking-tighter">
            Where to <span className="text-blue-400">Next?</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-100 font-medium drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
            Let AI craft your perfect tailored itinerary in seconds matching your vibe.
          </p>
        </div>
      </div>

      <div className="sm:px-10 md:px-24 lg:px-44 xl:px-64 px-5 -mt-32 relative z-20 w-full mb-10">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 md:p-12 w-full border border-slate-100/50">
          <div className="flex flex-col gap-12">
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                <span className="bg-orange-50 p-2 rounded-xl text-orange-600">🛫</span> Starting Location
              </h2>
              <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <PlaceAutoComplete
                  onSelect={(val) => {
                    handleInputChange('origin', val);
                  }}
                  className="bg-transparent border-none focus-visible:ring-0 shadow-none text-lg h-12"
                />
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                <span className="bg-blue-50 p-2 rounded-xl text-blue-600">📍</span> Destination Location
              </h2>
              <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <PlaceAutoComplete
                  onSelect={(val, placeId) => {
                    handleInputChange('location', val);
                    setSelectedPlaceId(placeId);
                  }}
                  className="bg-transparent border-none focus-visible:ring-0 shadow-none text-lg h-12"
                />
              </div>

              {selectedPlaceId && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-lg mb-3 font-bold text-slate-700 flex items-center gap-2">
                    🗺️ Area Preview
                  </h2>
                  <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <MapWithPlaces placeId={selectedPlaceId} />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                <span className="bg-indigo-50 p-2 rounded-xl text-indigo-600">⏱️</span> How many days?
              </h2>
              <Input
                placeholder="Ex. 3"
                type="number"
                min={1}
                max={10}
                className="h-16 text-lg border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold px-6"
                onChange={(e) => handleInputChange('noOfDays', e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-2 ml-2">Maximum duration is 10 days for optimal AI planning.</p>
            </div>

            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                <span className="bg-emerald-50 p-2 rounded-xl text-emerald-600">💰</span> What is Your Budget?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('budget', item.title)}
                    className={`group p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 ${formData?.budget === item.title
                      ? 'border-blue-500 bg-blue-50/40 shadow-[0_10px_30px_rgba(59,130,246,0.15)] ring-4 ring-blue-500/10'
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'
                      }`}
                  >
                    <div className="text-4xl mb-4 text-slate-700 bg-slate-50 inline-block p-3 rounded-full group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">{item.icon}</div>
                    <h2 className="font-bold text-xl text-slate-900">{item.title}</h2>
                    <h2 className="text-sm text-slate-500 mt-2 font-medium">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                <span className="bg-rose-50 p-2 rounded-xl text-rose-600">🧑‍🤝‍🧑</span> Who do you plan on traveling with?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SelectTravelList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('traveler', item.people)}
                    className={`group p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 ${formData?.traveler === item.people
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-[0_10px_30px_rgba(99,102,241,0.15)] ring-4 ring-indigo-500/10'
                      : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg'
                      }`}
                  >
                    <div className="text-4xl mb-4 text-slate-700 bg-slate-50 inline-block p-3 rounded-full group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">{item.icon}</div>
                    <h2 className="font-bold text-xl text-slate-900">{item.title}</h2>
                    <h2 className="text-sm text-slate-500 mt-2 font-medium">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <Button
              className="py-7 px-14 text-xl font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 w-full md:w-auto"
              onClick={onGenerateTrip}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Custom Itinerary...
                </span>
              ) : 'Search Flights & Hotels'}
            </Button>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Powered by Google Gemini AI</p>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="sr-only">Sign In Required</DialogTitle>
            <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
              <img src="/logo.svg" alt="LetsGo Logo" className="h-24 w-24 mx-auto drop-shadow-2xl" />
            </div>
            <h2 className="font-black text-3xl text-slate-900 tracking-tight mb-3">Sign In Required</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Join <span className="text-blue-600 font-bold">LetsGo</span> to save your itineraries and explore with AI.</p>

            <Button
              onClick={login}
              className="w-full mt-10 flex gap-4 items-center justify-center py-8 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 hover:border-blue-200 shadow-sm transition-all font-bold text-xl group"
            >
              <FcGoogle className="h-7 w-7 group-hover:scale-110 transition-transform" />
              Sign In with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
