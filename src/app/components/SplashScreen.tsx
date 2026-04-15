import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Map } from 'lucide-react';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000); // 2 seconds splash
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-600 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6">
          <Map className="w-10 h-10 text-blue-600" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }} className="tracking-tight">Triplan</h1>
        <p className="text-blue-200 mt-2" style={{ fontSize: '1rem', fontWeight: 500 }}>AI가 그려주는 나의 완벽한 여행</p>
      </motion.div>
    </div>
  );
}
