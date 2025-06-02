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
      <div className="refill-logo p-0.5 rounded-full w-8 h-8 cursor-glow">
        <div
          className="flex items-center justify-center bg-background rounded-full w-full h-full z-10 relative"
          style={{ overflow: 'hidden' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            style={{
              filter: `drop-shadow(0 0 2px rgba(255,255,255,0.6)) hue-rotate(${hue}deg)`,
              transform: 'rotate(-15deg)'
            }}
          >
            <path d="M12 2.99c2.67 0 5.33.34 8 1.01l-.4 8c-.44 3.8-4.08 5.97-7.6 5-1.46-.5-3-1.56-4-3-.57-.81-1-1.76-1-3 0-1.24.43-2.2 1-3 .6-.86 1.36-1.44 2-2 1.18-1.04 2-1.01 2-1.01z" />
            <path d="M12.5 6a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3z" />
          </svg>
        </div>
      </div>
      <span className="font-bold text-glow text-xl bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent">
        Refill AI
      </span>
    </Link>
  );
};

export default DynamicLogo;
