import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Briefcase, CreditCard, Laptop, Shirt, ShieldCheck, HeartPulse } from 'lucide-react';

const initialCategories = [
    {
        name: "Essential Documents",
        icon: <CreditCard className="w-5 h-5 text-red-500" />,
        items: [
            { id: 1, text: "Passport / ID Card", checked: false },
            { id: 2, text: "Travel Insurance Docs", checked: false },
            { id: 3, text: "Student ID (ISIC)", checked: false },
            { id: 4, text: "Flight & Hotel Bookings", checked: false }
        ]
    },
    {
        name: "Technology & Gadgets",
        icon: <Laptop className="w-5 h-5 text-blue-500" />,
        items: [
            { id: 5, text: "Universal Power Adapter", checked: false },
            { id: 6, text: "Power Bank (10,000mAh+)", checked: false },
            { id: 7, text: "Noise Cancelling Headphones", checked: false },
            { id: 8, text: "Extra Charging Cables", checked: false }
        ]
    },
    {
        name: "Clothing & Gear",
        icon: <Shirt className="w-5 h-5 text-orange-500" />,
        items: [
            { id: 9, text: "Lightweight Rain Jacket", checked: false },
            { id: 10, text: "Comfortable Walking Shoes", checked: false },
            { id: 11, text: "Microfiber Travel Towel", checked: false },
            { id: 12, text: "Compact Umbrella", checked: false }
        ]
    },
    {
        name: "Health & Hygiene",
        icon: <HeartPulse className="w-5 h-5 text-pink-500" />,
        items: [
            { id: 13, text: "First Aid Kit (Band-aids, etc.)", checked: false },
            { id: 14, text: "Hand Sanitizer & Masks", checked: false },
            { id: 15, text: "Refillable Water Bottle", checked: false },
            { id: 16, text: "Travel-size Toiletries", checked: false }
        ]
    }
];

function PackingChecklist() {
    const [categories, setCategories] = useState(initialCategories);

    const toggleItem = (catIndex, itemId) => {
        const newCategories = [...categories];
        const item = newCategories[catIndex].items.find(i => i.id === itemId);
        item.checked = !item.checked;
        setCategories(newCategories);
    };

    const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
    const checkedItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0);
    const progress = Math.round((checkedItems / totalItems) * 100);

    return (
        <div className="py-12 px-6 max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Smart <span className="text-blue-600">Packer</span></h1>
                <p className="text-slate-500 max-w-md mx-auto">Don't leave your charger or student ID behind. Use our essential checklist.</p>

                <Card className="rounded-3xl border-slate-100 shadow-xl overflow-hidden mt-8 max-w-md mx-auto bg-slate-900 text-white p-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Packing Progress</span>
                        <span className="text-2xl font-black">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-slate-800" />
                    <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verified student essentials for 2024 trips</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((cat, catIndex) => (
                    <Card key={catIndex} className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 italic p-6">
                            <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                {cat.icon}
                                {cat.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex-grow">
                            <ul className="space-y-6">
                                {cat.items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => toggleItem(catIndex, item.id)}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                                            {item.checked && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                        <span className={`text-slate-700 font-medium transition-all ${item.checked ? 'line-through opacity-40' : 'opacity-100'}`}>
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50/50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-blue-100 italic">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Briefcase className="w-10 h-10" />
                </div>
                <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Student Travel Pro-Tip</h4>
                    <p className="text-slate-600 text-lg">Always keep a digital copy of your Passport and Student ID in a secure cloud folder. You never know when you'll need a backup!</p>
                </div>
            </div>
        </div>
    );
}

export default PackingChecklist;
