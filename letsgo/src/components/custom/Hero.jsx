import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-5 text-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
          Discover Your Next <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Adventure with AI
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
          Your personal travel concierge. We use cutting-edge AI to craft itineraries that match your style, budget, and dreams perfectly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to={'/create-trip'}>
            <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95">
              Get Started, It's Free
              <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
            </button>
          </Link>

          <button
            onClick={() => document.getElementById('vibe-check')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all"
          >
            Check Your Vibe
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
