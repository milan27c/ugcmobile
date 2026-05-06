'use client';

import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen bg-gray-900 px-8">
      {/* Centered Content Container with Rounded Corners */}
      <div
        className="w-full rounded-3xl overflow-hidden shadow-2xl bg-black relative"
        style={{
          width: '370px',
          height: '802px',
          aspectRatio: '370/802',
          margin: '20px auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
