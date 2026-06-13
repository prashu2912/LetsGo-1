import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Users, Receipt, CreditCard, Trash2, PlusCircle, X, QrCode, Smartphone, Zap } from 'lucide-react';
import { toast } from 'sonner';

/* ─── UPI Payment Modal ────────────────────────────────── */
function UpiModal({ expense, perPerson, onClose }) {
    const [upiId, setUpiId] = useState('');
    const [showQR, setShowQR] = useState(false);

    const amountToPay = perPerson;
    const note = encodeURIComponent(`Split for: ${expense.description}`);
    const name = encodeURIComponent('LetsGo Split');

    // UPI deep-link format
    const buildUpiUrl = (upiHandle) => {
        const base = `upi://pay?pa=${encodeURIComponent(upiHandle)}&pn=${name}&am=${amountToPay}&cu=INR&tn=${note}`;
        return base;
    };

    const qrCodeUrl = upiId
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(buildUpiUrl(upiId))}`
        : null;

    const openApp = (scheme) => {
        if (!upiId) {
            toast.error('Please enter a UPI ID first!');
            return;
        }
        window.location.href = scheme + buildUpiUrl(upiId).replace('upi://', '');
    };

    // Direct deep links for each app
    const apps = [
        {
            name: 'GPay',
            emoji: '🟢',
            color: 'bg-[#1a73e8]',
            hover: 'hover:bg-[#1558b0]',
            action: () => openApp('tez://upi/'),
        },
        {
            name: 'PhonePe',
            emoji: '🟣',
            color: 'bg-[#5f259f]',
            hover: 'hover:bg-[#4b1b80]',
            action: () => openApp('phonepe://pay?'),
        },
        {
            name: 'Paytm',
            emoji: '🔵',
            color: 'bg-[#002970]',
            hover: 'hover:bg-[#001c50]',
            action: () => openApp('paytmmp://pay?'),
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative animate-in fade-in slide-in-from-bottom-6 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Pay via UPI</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Split for: <span className="font-bold text-slate-700">{expense.description}</span>
                    </p>
                    <div className="mt-3 inline-block bg-indigo-50 text-indigo-700 font-black text-3xl px-6 py-2 rounded-2xl">
                        ₹{amountToPay}
                    </div>
                </div>

                {/* UPI ID Input */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Enter Recipient's UPI ID
                    </label>
                    <Input
                        placeholder="e.g. name@okicici or 9876543210@ybl"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setShowQR(false); }}
                        className="rounded-2xl border-slate-200 text-sm py-5"
                    />
                </div>

                {/* Quick Pay Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {apps.map((app) => (
                        <button
                            key={app.name}
                            onClick={app.action}
                            className={`${app.color} ${app.hover} text-white font-bold py-3 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-sm flex flex-col items-center gap-1`}
                        >
                            <span className="text-xl">{app.emoji}</span>
                            {app.name}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-xs text-slate-400 font-medium">OR SCAN QR</span>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* QR Code Button & Display */}
                {!showQR ? (
                    <button
                        onClick={() => {
                            if (!upiId) { toast.error('Please enter a UPI ID to generate QR.'); return; }
                            setShowQR(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm"
                    >
                        <Smartphone className="w-5 h-5" />
                        Generate QR Code
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-4 animate-in fade-in duration-300">
                        <img
                            src={qrCodeUrl}
                            alt="UPI QR Code"
                            className="w-44 h-44 rounded-2xl border-4 border-indigo-100 shadow-md"
                        />
                        <p className="text-xs text-slate-400 font-medium">
                            Scan this QR with any UPI app
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Budget Splitter ────────────────────────────── */
function BudgetSplitter() {
    const [members, setMembers] = useState(['You']);
    const [newMember, setNewMember] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState('You');
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [masterUpiId, setMasterUpiId] = useState('');
    const [showMasterQR, setShowMasterQR] = useState(false);

    const addMember = () => {
        if (newMember && !members.includes(newMember)) {
            setMembers([...members, newMember]);
            setNewMember('');
            toast.success(`${newMember} added to the group!`);
        }
    };

    const addExpense = () => {
        if (description && amount) {
            const newExpense = {
                id: Date.now(),
                description,
                amount: parseFloat(amount),
                paidBy
            };
            setExpenses([...expenses, newExpense]);
            setDescription('');
            setAmount('');
            toast.success('Expense added!');
        }
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const perPerson = members.length > 0 ? (totalExpense / members.length).toFixed(2) : 0;

    return (
        <>
            {/* UPI Modal */}
            {selectedExpense && (
                <UpiModal
                    expense={selectedExpense}
                    perPerson={perPerson}
                    onClose={() => setSelectedExpense(null)}
                />
            )}

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Group <span className="text-blue-600">Splitter</span></h1>
                    <p className="text-slate-500">Perfect for student trips. Split costs fairly with your squad.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Members Management */}
                    <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 italic">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Users className="w-5 h-5 text-blue-600" />
                                Trip Squad
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add friend name..."
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addMember()}
                                    className="rounded-xl border-slate-200"
                                />
                                <Button onClick={addMember} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                                    <PlusCircle className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {members.map((m, i) => (
                                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-full text-sm font-semibold border border-slate-200">
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Card — with Pay All QR */}
                    <Card className="rounded-3xl border-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200/50 p-7 flex flex-col gap-4">
                        {/* Totals */}
                        <div className="text-center">
                            <p className="text-blue-100 font-medium mb-1 uppercase tracking-widest text-xs">Total Expenses</p>
                            <h2 className="text-5xl font-black">₹{totalExpense.toFixed(2)}</h2>
                        </div>
                        <div className="h-px bg-white/20 w-full" />
                        <div className="flex justify-between items-center px-2">
                            <div className="text-left">
                                <p className="text-blue-100 text-xs uppercase font-bold tracking-wider">Per Person</p>
                                <p className="text-2xl font-black">₹{perPerson}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-blue-200 opacity-50" />
                        </div>

                        {/* Pay All Section */}
                        <div className="h-px bg-white/20 w-full" />
                        <div className="space-y-3">
                            <p className="text-blue-100 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> Pay All — Scan & Split
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID (e.g. name@ybl)"
                                    value={masterUpiId}
                                    onChange={(e) => { setMasterUpiId(e.target.value); setShowMasterQR(false); }}
                                    className="flex-1 text-sm px-3 py-2 rounded-xl bg-white/15 placeholder:text-blue-200 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/50"
                                />
                                <button
                                    onClick={() => {
                                        if (!masterUpiId) { toast.error('Enter a UPI ID first!'); return; }
                                        if (perPerson <= 0) { toast.error('Add some expenses first!'); return; }
                                        setShowMasterQR(true);
                                    }}
                                    className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-bold text-sm flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <QrCode className="w-4 h-4" /> Generate QR
                                </button>
                            </div>

                            {showMasterQR && masterUpiId && (
                                <div className="flex flex-col items-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${encodeURIComponent(masterUpiId)}&pn=${encodeURIComponent('LetsGo Split')}&am=${perPerson}&cu=INR&tn=${encodeURIComponent('Group trip split')}`)}`}
                                            alt="Master UPI QR"
                                            className="w-44 h-44 rounded-lg"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-black text-lg">₹{perPerson} / person</p>
                                        <p className="text-blue-200 text-xs">Everyone scans this to pay their share</p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <a href={`tez://upi/pay?pa=${encodeURIComponent(masterUpiId)}&pn=${encodeURIComponent('LetsGo Split')}&am=${perPerson}&cu=INR`} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-bold transition-colors">🟢 GPay</a>
                                        <a href={`phonepe://pay?pa=${encodeURIComponent(masterUpiId)}&pn=${encodeURIComponent('LetsGo Split')}&am=${perPerson}&cu=INR`} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-bold transition-colors">🟣 PhonePe</a>
                                        <a href={`paytmmp://pay?pa=${encodeURIComponent(masterUpiId)}&pn=${encodeURIComponent('LetsGo Split')}&am=${perPerson}&cu=INR`} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-bold transition-colors">🔵 Paytm</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Add Expense Form */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-indigo-600" />
                        New Expense
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="What did you pay for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="rounded-2xl border-slate-200 py-6"
                        />
                        <Input
                            type="number"
                            placeholder="Amount (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="rounded-2xl border-slate-200 py-6"
                        />
                        <select
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {members.map((m, i) => (
                                <option key={i} value={m}>Paid by {m}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={addExpense} className="w-full mt-6 py-6 rounded-2xl bg-slate-900 hover:bg-black font-bold">
                        Add Expense Breakdown
                    </Button>
                </Card>

                {/* Expense List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-2">Recent Transactions</h3>
                    {expenses.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 italic">No expenses yet. Time to go shopping!</p>
                        </div>
                    ) : (
                        expenses.map((exp) => (
                            <div key={exp.id} className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    {/* CLICKABLE ICON — opens UPI modal */}
                                    <button
                                        onClick={() => setSelectedExpense(exp)}
                                        className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200 hover:scale-110 cursor-pointer group relative"
                                        title="Pay via GPay / PhonePe / Paytm"
                                    >
                                        <Receipt className="w-6 h-6" />
                                        {/* Tooltip */}
                                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            Pay Now
                                        </span>
                                    </button>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{exp.description}</h4>
                                        <p className="text-sm text-slate-500 font-medium">Paid by <span className="text-indigo-600">{exp.paidBy}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className="text-xl font-black text-slate-900">₹{exp.amount.toFixed(2)}</p>
                                    <button onClick={() => deleteExpense(exp.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default BudgetSplitter;
