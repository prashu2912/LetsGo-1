import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="text-center py-16 ">
      <h1 className="text-4xl md:text-5xl font-bold 
      ">
        Discover Your Next Adventure with <span className="text-blue-600">AI</span>
      </h1>
      <p className="mt-4 text-white-600 text-lg">
        Explore smart, AI-powered journeys designed just for you.
      </p>
      <Link to={'/create-trip'}>
      <button>Get Sterted,It's Free</button>
      </Link>
    </div>
  );
}

export default Hero;
