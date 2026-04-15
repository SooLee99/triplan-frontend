import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Map, Clock, Share2, ChevronRight, Check } from 'lucide-react';

const onboardingData = [
  {
    title: '장소만 담으세요\n일정은 알아서 정리됩니다',
    description: '가고 싶은 장소를 선택하면 최적의 동선으로 여행 일정을 자동 생성합니다.',
    icon: Map,
    color: 'bg-blue-100 text-blue-500',
  },
  {
    title: '언제든 수정하세요\n타임라인이 바로 계산됩니다',
    description: '체류 시간이나 이동 수단을 변경하면 전체 소요 시간이 실시간으로 다시 계산됩니다.',
    icon: Clock,
    color: 'bg-green-100 text-green-500',
  },
  {
    title: '친구와 함께 보세요\n일정을 간편하게 공유합니다',
    description: '확정된 여행 일정을 한눈에 보기 쉬운 카드로 만들어 친구들과 쉽게 공유하세요.',
    icon: Share2,
    color: 'bg-orange-100 text-orange-500',
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const isLastSlide = currentSlide === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate('/login');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const current = onboardingData[currentSlide];
  const Icon = current.icon;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-8">
      {/* Top Progress */}
      <div className="flex gap-2 pt-16 px-6 justify-center">
        {onboardingData.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              i === currentSlide ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-sm ${current.color}`}
        >
          <Icon size={56} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 text-center leading-snug whitespace-pre-line mb-4">
          {current.title}
        </h2>
        <p className="text-slate-500 text-center leading-relaxed text-base">
          {current.description}
        </p>
      </div>

      <div className="px-6 w-full pt-4">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all text-lg"
        >
          {isLastSlide ? '시작하기' : '다음'}
          {isLastSlide ? <Check size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
