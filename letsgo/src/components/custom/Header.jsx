import React from 'react';

function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
      <img src='/logo.svg' alt='Logo' className='h-10' />
      <div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
      </div>
    </div>
  );
}

export default Header;
