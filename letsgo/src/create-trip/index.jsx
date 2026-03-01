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
  DialogTrigger,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
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
                onSelect(s.description);
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

const CreateTrip = () => {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

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
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your Travel Preferences 🏕️🏖️</h2>
      <p className="mt-3 text-shadow-white text-xl">
        just provide some basic info about ur trip planning
      </p>

      <div className="mt-20">
        {/* ── Destination ───────────────────── */}
        <div>
          <h2 className="text-xl my-3 font-medium">What's the destination?</h2>

          <PlaceAutoComplete
            onSelect={(val) => {
              handleInputChange('location', val);
            }}
          />
        </div>

        {/* ── Days ──────────────────────────── */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days</h2>
          <Input
            placeholder="Ex‑2"
            type="number"
            min={1}
            max={10}
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* ── Budget Cards ──────────────────── */}
        <div>
          <h2 className="text-xl my-3 font-medium">What's your Budget</h2>
          <div className="grid grid-cols-5 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.budget === item.title ? 'shadow-lg border-black' : ''
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>

          {/* ── Traveller Cards ──────────────── */}
          <div className="mt-8">
            <h2 className="text-xl my-3 font-medium">
              Who do you plan on travelling on your next Adventure
            </h2>
            <div className="grid grid-cols-5 gap-5 mt-5">
              {SelectTravelList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                    formData?.traveler === item.people ? 'shadow-lg border-black' : ''
                  }`}
                >
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-500">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="my-20 flex justify-center">
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
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
