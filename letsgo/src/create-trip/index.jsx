/* global google */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
/* ──────────────────────────────────────────────────────────
   NEW lightweight wrapper around google.maps.places.AutocompleteService
   ────────────────────────────────────────────────────────── */
const PlaceAutoComplete = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input,
        types: ['(cities)'],
        componentRestrictions: { country: 'IN' },
      },
      (res) => {
        // Google returns null instead of [] sometimes
        setSuggestions(res ?? []);
      }
    );
  }, [input]);

  return (
    <div className="relative">
      <Input
        value={input}
        placeholder="Enter a city..."
        onChange={(e) => setInput(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setInput(s.description);
                onSelect(s.description, s.place_id);
                setSuggestions([]);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */

import MapWithPlaces from '@/components/MapWithPlaces';

const CreateTrip = () => {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const handleInputChange = (name, value) => {
    if (name === 'noOfDays') {
      const days = Number(value);
      if (days > 10) return toast('Please enter less than 10 days');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };




  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const days = +formData?.noOfDays || 0;
    if (days > 10) return toast('Please enter less than 10 days');
    if (!formData?.location || !formData?.budget || !formData?.traveler)
      return toast('Please fill all the fields');

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const chatSession = await model.startChat();
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(await result.response.text());
    } catch (err) {
      console.error(err);
      toast('Something went wrong while generating your trip');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Hero Section ──────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white pt-24 pb-32 px-5 md:px-20 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

        <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 tracking-tight drop-shadow-md">
          Design Your Dream Trip 🏕️🏖️
        </h2>
        <p className="mt-4 text-blue-100 text-lg md:text-2xl font-light drop-shadow">
          Provide some basic info to get a personalized itinerary beautifully crafted for you.
        </p>
      </div>

      {/* ── Main Form Card ────────────────────── */}
      <div className="sm:px-10 md:px-24 lg:px-44 xl:px-64 px-5 -mt-20 relative z-10 w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full transition-all">

          <div className="flex flex-col gap-10">
            {/* ── Destination ───────────────────── */}
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-blue-600">📍</span> What's the destination?
              </h2>
              <div className="bg-gray-50 p-1 rounded-xl shadow-inner border border-gray-200">
                <PlaceAutoComplete
                  onSelect={(val, placeId) => {
                    handleInputChange('location', val);
                    setSelectedPlaceId(placeId);
                  }}
                />
              </div>

              {/* ── Map ───────────────────────────── */}
              {selectedPlaceId && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-lg mb-2 font-semibold text-gray-700">Map & Popular Attractions</h2>
                  <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <MapWithPlaces placeId={selectedPlaceId} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Days ──────────────────────────── */}
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-indigo-600">⏱️</span> How many days?
              </h2>
              <Input
                placeholder="Ex. 2"
                type="number"
                min={1}
                max={10}
                className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                onChange={(e) => handleInputChange('noOfDays', e.target.value)}
              />
            </div>

            {/* ── Budget Cards ──────────────────── */}
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-emerald-500">💰</span> What is Your Budget?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('budget', item.title)}
                    className={`p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center text-center ${formData?.budget === item.title
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 outline-none'
                      : 'border-gray-100 bg-white hover:border-blue-300'
                      }`}
                  >
                    <div className="text-5xl mb-3 mb-2 transform transition-transform group-hover:scale-110">{item.icon}</div>
                    <h2 className="font-bold text-xl text-gray-800">{item.title}</h2>
                    <h2 className="text-sm text-gray-500 mt-1">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Traveller Cards ──────────────── */}
            <div className="w-full mt-2">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-rose-500">🧑‍🤝‍🧑</span> Who are you travelling with?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {SelectTravelList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('traveler', item.people)}
                    className={`p-6 border-2 cursor-pointer rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center text-center ${formData?.traveler === item.people
                      ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                      : 'border-gray-100 bg-white hover:border-indigo-300'
                      }`}
                  >
                    <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110">{item.icon}</div>
                    <h2 className="font-bold text-xl text-gray-800">{item.title}</h2>
                    <h2 className="text-sm text-gray-500 mt-1">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              className="py-7 px-14 text-xl font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={onGenerateTrip}
            >
              🚀 Generate My Trip Now
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
              <p>Sign In to the App with the Authentication</p>

              <Button

                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-10 w-7" />
                Sign In{' '}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
