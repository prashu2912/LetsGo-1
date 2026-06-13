
import { User, Users, Heart, PiggyBank, Wallet, Crown, PartyPopper } from "lucide-react";

export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler",
    icon: <User className="w-6 h-6 text-blue-500" />,
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    desc: "Perfect for two",
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "Travel with your loved ones",
    icon: <Users className="w-6 h-6 text-green-500" />,
    people: "4+",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Fun with your group",
    icon: <PartyPopper className="w-6 h-6 text-purple-500" />,
    people: "3+",
  },
];
export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Budget-friendly travel",
    icon: <PiggyBank className="w-6 h-6 text-green-500" />,
    level: "₹",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Comfortable and affordable",
    icon: <Wallet className="w-6 h-6 text-blue-500" />,
    level: "₹₹",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium & exclusive",
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    level: "₹₹₹",
  },
];
export const AI_PROMPT = `Generate a comprehensive and highly personalized Travel Plan for a trip from Origin: {origin} to Location: {location} for {totalDays} Days for {traveler} with a {budget} budget. 

Your goal is to provide a trend-focused, budget-optimized, and exhaustive guide. Please follow these strict instructions:
1. **Nearby Famous & Hidden Places**: Identify and include both world-famous landmarks and "hidden gem" local spots nearby {location}. Ensure accuracy based on Google Maps data.
2. **Cheaper & Newly Started Services**: Specifically look for and include budget-friendly (cheap) options and suggest "newly started" or "trending" restaurants and services that offer great value.
3. **Transport Optimization**: Include detailed nearby transport options (local cabs, bike rentals, bike-taxis, or shuttle services) with estimated costs.
4. **Food & Restaurants**: Suggest 5+ highly-rated but affordable restaurants reflecting the local cuisine.
5. **Detailed Itinerary**: Provide a day-by-day plan.
6. **Actionable Contacts**: For hotels and restaurants, try to provide a contact phone number, website URL, and an OpenStreetMap or Google Maps search URL (mapUrl) based on the name and location.
7. **Flights/Long-distance Transport**: Since the user is traveling from {origin} to {location}, provide realistic flight or long-distance train/bus options between these two places.

IMPORTANT: Ensure the data is NOT limited to any specific region like Vizag unless asked. It MUST be accurate for the {location} provided.

Return the response strictly in raw JSON format with this structure:
{
  "tripName": "A catchy title for the {location} trip",
  "flights": [
    {
      "airlineName": "Airline or Transport Name",
      "departure": "Origin City/Airport",
      "arrival": "Destination City/Airport",
      "estimatedDuration": "e.g., 2h 30m",
      "priceRange": "Approximate cost",
      "bookingLink": "URL to search flights like Google Flights or Skyscanner"
    }
  ],
  "hotels": [
    {
      "hotelName": "",
      "hotelAddress": "",
      "price": "e.g., ₹1000 - ₹2500 per night",
      "hotelImageUrl": "",
      "geoCoordinates": { "lat": 0, "lng": 0 },
      "rating": 0,
      "description": "",
      "contactNumber": "Phone number or 'Nav'",
      "websiteUrl": "Website URL or 'Nav'",
      "mapUrl": "OpenStreetMap/Google Maps Link"
    }
  ],
  "restaurants": [
    {
      "restaurantName": "",
      "address": "",
      "cuisine": "",
      "rating": 0,
      "description": "Highlight if it's budget-friendly or a new service",
      "contactNumber": "Phone number or 'Nav'",
      "websiteUrl": "Website URL or 'Nav'",
      "mapUrl": "OpenStreetMap/Google Maps Link"
    }
  ],
  "itinerary": {
    "day1": [
      {
        "placeName": "",
        "placeDetails": "",
        "placeImageUrl": "",
        "geoCoordinates": { "lat": 0, "lng": 0 },
        "ticketPricing": "Free or amount",
        "rating": 0,
        "bestTimeToVisit": "",
        "timeRequired": ""
      }
    ]
  },
  "transport": [
    {
      "type": "e.g., Bike Taxi, Local Cab",
      "details": "How to book and why it's a good/cheap choice",
      "estimatedCost": "Approx cost in local currency",
      "bookingInfo": ""
    }
  ]
}
Do not include any text outside the JSON block. Do not use markdown code fences. 
CRITICAL: Ensure ALL string values inside the JSON are properly escaped. Do not use raw newlines (\\n) or unescaped double quotes (") inside strings.`;
