import React from 'react';

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f0f0f5] py-4 sm:py-8">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-0 sm:h-[932px] bg-white sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border sm:border-gray-200">
        {children}
      </div>
    </div>
  );
}
