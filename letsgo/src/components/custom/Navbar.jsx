import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from '@/service/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('user');
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <div className="w-full h-20 bg-white/70 backdrop-blur-xl shadow-sm border-b border-slate-100 sticky top-0 z-50 px-6 md:px-16 flex justify-between items-center transition-all">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <img src="/logo.svg" alt="LetsGo Logo" className="h-10 w-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                <span className="font-black text-3xl text-slate-900 tracking-tighter uppercase">Lets<span className="text-blue-600">Go</span></span>
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 p-1 pr-4 rounded-full border border-slate-100 shadow-sm">
                            <img
                                src={user.photoURL}
                                alt="profile"
                                className="h-8 w-8 rounded-full border border-white shadow-sm"
                            />
                            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
                        </div>
                        <Button
                            variant="ghost"
                            className="rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 font-medium px-4"
                            onClick={logout}
                        >
                            Sign Out
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-slate-600 font-bold hover:text-blue-600 hover:bg-transparent hidden lg:flex"
                            onClick={() => window.location.href = '/budget-splitter'}
                        >
                            Splitter
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-slate-600 font-bold hover:text-blue-600 hover:bg-transparent hidden lg:flex"
                            onClick={() => window.location.href = '/packing-checklist'}
                        >
                            Packer
                        </Button>
                        <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg px-6 font-semibold hidden md:flex" onClick={() => navigate('/my-trips')}>
                            My Trips
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm flex gap-3 items-center px-6 py-6 text-base font-semibold transition-all hover:shadow-md"
                        onClick={login}
                    >
                        <FcGoogle className="w-5 h-5" />
                        Sign In
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
