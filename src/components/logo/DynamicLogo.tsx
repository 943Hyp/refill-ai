"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DynamicLogo = () => {
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHue((prevHue) => (prevHue + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="refill-logo p-0.5 rounded-lg w-8 h-8 cursor-glow">
        <div
          className="flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg w-full h-full z-10 relative"
          style={{ overflow: 'hidden' }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
            style={{
              filter: `drop-shadow(0 0 2px rgba(255,255,255,0.6))`,
            }}
          >
            <path 
              d="M12 3V16M12 16L8 12M12 16L16 12M4 21H20" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-lg"></div>
        </div>
      </div>
      <span className="font-bold text-glow text-xl bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent">
        Refill AI
      </span>
    </Link>
  );
};

export default DynamicLogo;
