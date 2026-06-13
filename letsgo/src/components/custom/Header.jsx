import React from 'react';

function Header() {
  return (
    <div className='p-4 shadow-sm flex justify-between items-center bg-white/80 backdrop-blur-md'>
      <div className="flex items-center gap-3 cursor-pointer group">
        <img src="/logo.svg" alt="LetsGo Logo" className="h-10 w-10 group-hover:scale-110 transition-transform drop-shadow-md" />
        <span className="font-black text-3xl text-slate-900 tracking-tighter uppercase">Lets<span className="text-blue-600">Go</span></span>
      </div>
      <div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
      </div>
    </div>
  );
}

export default Header;
