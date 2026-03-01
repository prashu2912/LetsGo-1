import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key
const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 *  startChat expects:
 *    {
 *      generationConfig,
 *      history: [ { role, parts }, ... ]
 *    }
 *  So we wrap both message objects (user + model) in a single `history` array.
 */
export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate travel plan for location: Las Vegas for 3 days for couple with a cheap budget. 
Give me a hotels option list with Hotel name, hotel address, price, hotel image URL, geo coordinates, rating, and description. 
Also suggest an itinerary with place name, place details, place image URL, geo coordinates, ticket pricing, rating, time travel of each location, 
for 3 days with each day plan with best time to visit in JSON format.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
 "hotels": [
    {
      "hotelName": "The LINQ Hotel + Experience",
      "hotelAddress": "3535 S Las Vegas Blvd, Las Vegas, NV 89109, USA",
      "price": "Approx. $50 - $150 per night",
      "hotelImageUrl": "https://www.caesars.com/content/dam/clv/linq/hotel/hotel-room.jpg",
      "geoCoordinates": { "lat": 36.1170, "lng": -115.1697 },
      "rating": 4.1,
      "description": "Trendy hotel with a lively casino, dining, and High Roller views in the heart of the Strip."
    },
    {
      "hotelName": "Circus Circus Hotel",
      "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109, USA",
      "price": "Approx. $35 - $100 per night",
      "hotelImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/bc/46/aa/circus-circus-hotel.jpg",
      "geoCoordinates": { "lat": 36.1372, "lng": -115.1612 },
      "rating": 3.7,
      "description": "Family-friendly hotel offering a casino, indoor theme park, and affordable rooms."
    }
  ],
  "itinerary": {
    "day1": [
      {
        "placeName": "Bellagio Fountain Show",
        "placeDetails": "Free iconic water fountain show set to music in front of Bellagio Hotel.",
        "placeImageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/57/Bellagio_Fountains.jpg",
        "geoCoordinates": { "lat": 36.1126, "lng": -115.1767 },
        "ticketPricing": "Free",
        "rating": 4.8,
        "bestTimeToVisit": "8 PM - 10 PM",
        "timeRequired": "30 minutes"
      },
      {
        "placeName": "The Mirage Volcano",
        "placeDetails": "Free outdoor fire and music show in front of The Mirage Hotel.",
        "placeImageUrl": "https://media.timeout.com/images/105240231/image.jpg",
        "geoCoordinates": { "lat": 36.1216, "lng": -115.1745 },
        "ticketPricing": "Free",
        "rating": 4.5,
        "bestTimeToVisit": "7 PM - 9 PM",
        "timeRequired": "20 minutes"
      }
    ],
    "day2": [
      {
        "placeName": "Fremont Street Experience",
        "placeDetails": "Downtown light and music show with street performances and zip line rides.",
        "placeImageUrl": "https://www.lasvegas-how-to.com/images/fremont-street-experience.jpg",
        "geoCoordinates": { "lat": 36.1709, "lng": -115.1446 },
        "ticketPricing": "Free",
        "rating": 4.7,
        "bestTimeToVisit": "Evening",
        "timeRequired": "2-3 hours"
      },
      {
        "placeName": "Container Park",
        "placeDetails": "Outdoor shopping area made from shipping containers, with art, food, and events.",
        "placeImageUrl": "https://www.lasvegasnevada.gov/Portals/0/Images/LV%20City%20Images/Container-Park.jpg",
        "geoCoordinates": { "lat": 36.1695, "lng": -115.1403 },
        "ticketPricing": "Free",
        "rating": 4.3,
        "bestTimeToVisit": "Afternoon to evening",
        "timeRequired": "1-2 hours"
      }
    ],
    "day3": [
      {
        "placeName": "Welcome to Fabulous Las Vegas Sign",
        "placeDetails": "Iconic Vegas photo-op at the southern end of the Strip.",
        "placeImageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Welcome_to_Las_Vegas_sign.jpg",
        "geoCoordinates": { "lat": 36.0820, "lng": -115.1722 },
        "ticketPricing": "Free",
        "rating": 4.6,
        "bestTimeToVisit": "Morning",
        "timeRequired": "30 minutes"
      },
      {
        "placeName": "The Venetian Grand Canal",
        "placeDetails": "Beautiful indoor canal with gondola rides and shops.",
        "placeImageUrl": "https://www.venetianlasvegas.com/content/dam/venetian/hotel/canal/gondola.jpg",
        "geoCoordinates": { "lat": 36.1216, "lng": -115.1719 },
        "ticketPricing": "Gondola ride approx. $34 per person",
        "rating": 4.5,
        "bestTimeToVisit": "Afternoon",
        "timeRequired": "1-2 hours"
      }
    ]
  }
}`,
        },
      ],
    },
  ],
});

