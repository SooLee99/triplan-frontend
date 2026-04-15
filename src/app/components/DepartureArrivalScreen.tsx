import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { POINT_PRESETS, getDayCount, getDayDate, type DayPoint } from '../store';
import {
  ChevronLeft, ChevronRight, CircleDot, Flag, MapPin, Check, Copy, Sparkles, Search, X
} from 'lucide-react';

// Search database - popular locations
const SEARCH_LOCATIONS: { name: string; emoji: string; lat: number; lng: number; category: string }[] = [
  { name: '호텔/숙소 (신주쿠)', emoji: '🏨', lat: 35.6938, lng: 139.7034, category: '숙소' },
  { name: '나리타 공항', emoji: '✈️', lat: 35.7720, lng: 140.3929, category: '공항' },
  { name: '하네다 공항', emoji: '✈️', lat: 35.5494, lng: 139.7798, category: '공항' },
  { name: '도쿄역', emoji: '🚉', lat: 35.6812, lng: 139.7671, category: '역' },
  { name: '시부야역', emoji: '🚉', lat: 35.6580, lng: 139.7016, category: '역' },
  { name: '신주쿠역', emoji: '🚉', lat: 35.6896, lng: 139.7006, category: '역' },
  { name: '이케부쿠로역', emoji: '🚉', lat: 35.7295, lng: 139.7109, category: '역' },
  { name: '우에노역', emoji: '🚉', lat: 35.7141, lng: 139.7774, category: '역' },
  { name: '아사쿠사', emoji: '⛩️', lat: 35.7148, lng: 139.7967, category: '관광' },
  { name: '긴자', emoji: '🛍️', lat: 35.6717, lng: 139.7649, category: '관광' },
  { name: '롯폰기', emoji: '🌃', lat: 35.6627, lng: 139.7311, category: '관광' },
  { name: '아키하바라', emoji: '🎮', lat: 35.7023, lng: 139.7745, category: '관광' },
  { name: '오다이바', emoji: '🌉', lat: 35.6270, lng: 139.7753, category: '관광' },
  { name: '하라주쿠', emoji: '👗', lat: 35.6702, lng: 139.7027, category: '관광' },
  { name: '에비스', emoji: '🍺', lat: 35.6467, lng: 139.7100, category: '관광' },
  { name: '도쿄 디즈니랜드', emoji: '🏰', lat: 35.6329, lng: 139.8804, category: '테마파크' },
  { name: '도쿄타워', emoji: '🗼', lat: 35.6586, lng: 139.7454, category: '관광' },
  { name: '스카이트리', emoji: '🗼', lat: 35.7101, lng: 139.8107, category: '관광' },
];

function PointEditor({
  type,
  point,
  onSave,
}: {
  type: 'departure' | 'arrival';
  point: DayPoint;
  onSave: (p: DayPoint) => void;
}) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = query.trim()
    ? SEARCH_LOCATIONS.filter(
        loc => loc.name.toLowerCase().includes(query.trim().toLowerCase()) ||
               loc.category.toLowerCase().includes(query.trim().toLowerCase())
      )
    : SEARCH_LOCATIONS.slice(0, 6); // show popular when empty

  const handleSelect = (loc: typeof SEARCH_LOCATIONS[0]) => {
    onSave({ name: loc.name, lat: loc.lat, lng: loc.lng });
    setQuery('');
    setFocused(false);
  };

  const handleCustomSubmit = () => {
    if (query.trim()) {
      onSave({ name: query.trim(), lat: 35.6938, lng: 139.7034 });
      setQuery('');
      setFocused(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        {type === 'departure' ? (
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
            <CircleDot className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
            <Flag className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
          {type === 'departure' ? '출발지' : '도착지'}
        </span>
        {point.name && (
          <button
            onClick={() => onSave({ name: '', lat: 0, lng: 0 })}
            className="ml-auto flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
            style={{ fontSize: '0.7rem', fontWeight: 600 }}
          >
            {point.name}
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Search input */}
      {!point.name && (
        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 focus-within:border-blue-400 transition-colors">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              onKeyDown={e => { if (e.key === 'Enter') handleCustomSubmit(); }}
              placeholder="장소명을 검색하세요 (예: 나리타 공항, 신주쿠역)"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
              style={{ fontSize: '0.8rem' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-300 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {focused && (
            <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto z-10 relative">
              {!query.trim() && (
                <p className="px-3 py-2 text-gray-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>인기 장소</p>
              )}
              {results.length > 0 ? (
                results.map((loc) => (
                  <button
                    key={loc.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(loc)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span style={{ fontSize: '1rem' }}>{loc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-gray-800" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{loc.name}</p>
                      <p className="text-gray-400" style={{ fontSize: '0.65rem' }}>{loc.category}</p>
                    </div>
                    <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-3">
                  <p className="text-gray-400 mb-2" style={{ fontSize: '0.75rem' }}>검색 결과가 없습니다</p>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleCustomSubmit}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>"{query}" 직접 입력하기</span>
                  </button>
                </div>
              )}
              {query.trim() && results.length > 0 && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCustomSubmit}
                  className="w-full flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>"{query}" 직접 입력하기</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DepartureArrivalScreen() {
  const navigate = useNavigate();
  const { tripInfo, daySchedules, initDaySchedules, updateDayDeparture, updateDayArrival, dayCount } = useApp();
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    initDaySchedules();
  }, []);

  const currentDayData = daySchedules[activeDay];

  const allDaysHavePoints = daySchedules.length > 0 && daySchedules.every(
    d => d.departure.name && d.arrival.name
  );

  const handleCopyToAll = () => {
    if (!currentDayData) return;
    daySchedules.forEach((_, i) => {
      if (i !== activeDay) {
        updateDayDeparture(i, { ...currentDayData.departure });
        updateDayArrival(i, { ...currentDayData.arrival });
      }
    });
  };

  const handleNext = () => {
    navigate('/places');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
    } catch { return dateStr; }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <p className="text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>STEP 4</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>출발지·도착지 설정</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-600 px-3 py-1 rounded-full" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <MapPin className="w-3.5 h-3.5" />
          {dayCount}일 여행
        </div>
      </div>

      <p className="px-6 text-gray-400 mt-1 mb-4" style={{ fontSize: '0.8rem' }}>
        각 일정별 출발지와 도착지를 설정하면, AI가 거리 기반으로 최적 경로를 추천합니다
      </p>

      {/* Day tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {daySchedules.map((day, i) => {
            const hasPoints = day.departure.name && day.arrival.name;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 transition-all ${
                  activeDay === i
                    ? 'border-blue-600 bg-blue-50'
                    : hasPoints
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-100 bg-gray-50'
                }`}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: activeDay === i ? 700 : 500 }}
                  className={activeDay === i ? 'text-blue-700' : hasPoints ? 'text-green-700' : 'text-gray-600'}
                >
                  Day {i + 1}
                </span>
                <span className="text-gray-400" style={{ fontSize: '0.65rem' }}>
                  {formatDate(day.date)}
                </span>
                {hasPoints && activeDay !== i && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current day editor */}
      {currentDayData && (
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-5">
          {/* Day header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeDay + 1}</span>
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>Day {activeDay + 1}</p>
                <p className="text-gray-400" style={{ fontSize: '0.7rem' }}>{formatDate(currentDayData.date)}</p>
              </div>
            </div>
            {daySchedules.length > 1 && currentDayData.departure.name && currentDayData.arrival.name && (
              <button
                onClick={handleCopyToAll}
                className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                style={{ fontSize: '0.7rem', fontWeight: 600 }}
              >
                <Copy className="w-3 h-3" />
                전체 일정에 복사
              </button>
            )}
          </div>

          {/* Departure */}
          <PointEditor
            type="departure"
            point={currentDayData.departure}
            onSave={(p) => updateDayDeparture(activeDay, p)}
          />

          {/* Visual connector */}
          <div className="flex items-center gap-3 ml-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-px h-3 bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-px h-3 bg-gray-300" />
            </div>
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-blue-600" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                AI가 출발지→도착지 거리 기반으로 장소를 최적 배치합니다
              </span>
            </div>
          </div>

          {/* Arrival */}
          <PointEditor
            type="arrival"
            point={currentDayData.arrival}
            onSave={(p) => updateDayArrival(activeDay, p)}
          />
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          disabled={!allDaysHavePoints}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            allDaysHavePoints ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          {allDaysHavePoints ? '장소 선택하기' : `모든 일정의 출발지·도착지를 설정하세요`}
          {allDaysHavePoints && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}