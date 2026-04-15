import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { MapPin, Search, Navigation2, Clock, Map, ChevronLeft, Calendar as CalendarIcon, Check, Settings, Compass, Share2, Sun, CloudRain, Umbrella, Sparkles } from 'lucide-react';
import { BottomSheet } from './BottomSheet';

const mockTimeline = [
  { id: 'start', type: 'departure', name: '제주공항', time: '10:00 AM' },
  {
    id: 'transit-1',
    type: 'transit',
    modes: ['자동차', '대중교통', '도보'],
    selectedMode: '자동차',
    duration: '45분',
  },
  {
    id: 'place-1',
    type: 'place',
    name: '함덕해수욕장',
    category: '해변 · 자연',
    duration: '1시간 30분',
    arrival: '10:45 AM',
    departure: '12:15 PM',
  },
  {
    id: 'transit-2',
    type: 'transit',
    modes: ['자동차', '대중교통', '도보'],
    selectedMode: '도보',
    duration: '10분',
  },
  {
    id: 'place-2',
    type: 'place',
    name: '카페 델문도',
    category: '오션뷰 카페',
    duration: '1시간',
    arrival: '12:25 PM',
    departure: '01:25 PM',
  },
  {
    id: 'transit-3',
    type: 'transit',
    modes: ['자동차', '대중교통', '도보'],
    selectedMode: '자동차',
    duration: '30분',
  },
  { id: 'end', type: 'arrival', name: '숙소 (그랜드 하얏트 제주)', time: '01:55 PM' },
];

export function TimelineEditor() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(1);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const weatherMock: Record<number, any> = {
    1: { condition: 'sunny', temp: '24°', label: '맑음' },
    2: { condition: 'rainy', temp: '20°', label: '비 옴', alert: '야외 일정 대신 실내 공간을 추천해요', alternatives: true },
    3: { condition: 'cloudy', temp: '22°', label: '흐림' },
    4: { condition: 'sunny', temp: '25°', label: '맑음' }
  };
  const currentWeather = weatherMock[activeDay];

  const aiFeedbackMock: Record<number, { message: string; type: 'warning' | 'info' | 'success' }> = {
    1: { message: '첫째 날은 공항 주변에서 가볍게 시작하는 동선이 좋습니다. 렌터카 수령 시간을 고려해 여유롭게 일정을 잡았어요.', type: 'success' },
    2: { message: '오늘 오후에는 비 소식이 있어요. 실내 대안 장소로 일정을 변경해보는 건 어떨까요?', type: 'warning' },
    3: { message: '동선이 조금 길어요. 이동 중간에 쉴 수 있는 카페나 휴식 장소를 추가해보세요.', type: 'info' },
    4: { message: '마지막 날입니다. 비행기 탑승 2시간 전에는 공항에 도착할 수 있도록 일정을 마무리했습니다.', type: 'success' }
  };
  const currentFeedback = aiFeedbackMock[activeDay];

  const handleModeChange = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 800);
  };

  const handleConfirm = () => {
    navigate('/share');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-slate-900">제주도 3박 4일 힐링</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
              <CalendarIcon size={12} />
              24.10.15 - 10.18
            </p>
          </div>
          <button className="p-2 -mr-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[1, 2, 3, 4].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all shadow-sm
                ${activeDay === day ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Day {day}
            </button>
          ))}
        </div>

        {/* AI Feedback & Weather Banner */}
        <div className="mt-4 flex flex-col gap-3">
          <div className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border ${
            currentWeather.condition === 'rainy' ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                currentWeather.condition === 'rainy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-50 text-orange-500'
              }`}>
                {currentWeather.condition === 'rainy' ? <CloudRain size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  {currentWeather.label} {currentWeather.temp}
                  {currentWeather.condition === 'rainy' && <Umbrella size={14} className="text-blue-500" />}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Day {activeDay} 예상 날씨</p>
              </div>
            </div>
            {currentWeather.alternatives && (
              <button onClick={() => navigate('/places')} className="px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-sm border border-blue-100 shrink-0 hover:bg-blue-50 active:scale-95 transition-all">
                실내 대안 보기
              </button>
            )}
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 shadow-md flex gap-3 items-start relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 border border-blue-400/30">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 z-10 pt-1">
              <h4 className="text-[11px] font-bold text-blue-400 mb-1">AI 일정 피드백</h4>
              <p className="text-[13px] leading-relaxed text-slate-200 font-medium">
                {currentFeedback.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recalculating Toast (Mock) */}
      <div className={`fixed top-40 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isRecalculating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
          <Clock size={16} className="animate-spin" />
          타임라인 재계산 완료
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {mockTimeline.map((item, idx) => {
          if (item.type === 'departure' || item.type === 'arrival') {
            return (
              <div key={item.id} className="relative group cursor-pointer active:scale-[0.98] transition-all" onClick={() => navigate('/departure')}>
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-slate-200 z-0" style={{ display: item.type === 'arrival' ? 'none' : 'block' }}></div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 relative z-10 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'departure' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {item.type === 'departure' ? <MapPin size={20} /> : <Navigation2 size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium mb-1">{item.type === 'departure' ? '출발지' : '도착지'}</p>
                    <p className="text-base font-bold text-slate-900 truncate">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg">{item.time}</p>
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === 'transit') {
            return (
              <div key={item.id} className="relative py-2 pl-[38px]">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex items-center">
                    {item.modes.map((mode) => (
                      <button
                        key={mode}
                        onClick={handleModeChange}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          item.selectedMode === mode ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{item.duration} 소요</span>
                </div>
              </div>
            );
          }

          if (item.type === 'place') {
            return (
              <div key={item.id} className="relative group cursor-pointer active:scale-[0.98] transition-all">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ml-[38px] relative z-10 hover:shadow-md transition-shadow">
                  <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-400 rounded-full z-10"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{item.category}</p>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-slate-800 p-1 bg-slate-50 rounded-md font-semibold px-2">
                      {item.duration} 체류
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100/60">
                    <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-slate-400 font-semibold mb-0.5">도착</p>
                      <p className="text-sm font-bold text-slate-800">{item.arrival}</p>
                    </div>
                    <div className="w-4 h-[1px] bg-slate-300"></div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-slate-400 font-semibold mb-0.5">출발</p>
                      <p className="text-sm font-bold text-slate-800">{item.departure}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
        
        {/* Add Place CTA */}
        <div className="relative pt-4 pb-6 pl-[38px]">
          <div className="absolute left-6 top-0 bottom-1/2 w-0.5 bg-slate-200 z-0"></div>
          <button 
            onClick={() => navigate('/places')}
            className="w-full relative z-10 flex items-center justify-center gap-2 py-4 bg-blue-50 text-blue-600 border border-blue-100 border-dashed rounded-2xl font-bold active:scale-95 transition-all shadow-sm"
          >
            <Search size={18} strokeWidth={2.5} />
            장소 추가하기
          </button>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-2xl active:scale-95 transition-all text-lg shadow-md cursor-pointer" onClick={handleConfirm}>
            <Check size={20} strokeWidth={2.5} />
            일정 확정하기
          </div>
        </div>
      </div>
    </div>
  );
}
