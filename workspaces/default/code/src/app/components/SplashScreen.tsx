import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Compass } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col h-full w-full bg-blue-500 items-center justify-center text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 opacity-10">
        <MapPin size={120} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-10">
        <Compass size={160} />
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <MapPin size={40} className="text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">TripMaker</h1>
        <p className="text-blue-100 text-lg font-medium text-center px-8">
          가장 빠른 모바일 일정 계획의 시작
        </p>
      </div>
    </div>
  );
}
