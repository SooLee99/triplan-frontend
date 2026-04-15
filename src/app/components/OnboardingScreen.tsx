import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Calendar, Sparkles, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    icon: Sparkles,
    title: 'AI가 추천해주는 장소',
    desc: '내 취향에 딱 맞는 여행지를\nAI가 찾아주고 동선을 최적화합니다.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Map,
    title: '지도에서 한눈에 확인',
    desc: '복잡한 이동 경로를\n지도 앱처럼 직관적으로 볼 수 있습니다.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Calendar,
    title: '여행 달력으로 캘린더 관리',
    desc: '예정된 여행부터 지난 기록까지\n여행 달력 하나로 관리하세요.',
    color: 'bg-amber-100 text-amber-600',
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      navigate('/login');
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center px-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mb-10 ${SLIDES[currentSlide].color}`}
            >
              {React.createElement(SLIDES[currentSlide].icon, { className: 'w-16 h-16' })}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gray-900 mb-4 whitespace-pre-wrap">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-gray-500 whitespace-pre-wrap" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
              {SLIDES[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination & Next Button */}
      <div className="px-6 pb-12 pt-6 shrink-0 flex items-center justify-between border-t border-gray-50">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-full flex items-center justify-center shadow-lg active:scale-95"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
