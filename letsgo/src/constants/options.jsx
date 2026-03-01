
import { User, Users, Heart, PiggyBank, Wallet, Crown,PartyPopper } from "lucide-react";

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
export const AI_PROMPT='Generate Travel Plan Location:{location}'