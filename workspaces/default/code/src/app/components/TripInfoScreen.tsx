import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { MapPin, Calendar as CalendarIcon, Users, ChevronRight, Search, Plus, Navigation } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';

export function TripInfoScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to?: Date }>();

  const handleStart = () => {
    // In a real app, dispatch to context here
    navigate('/editor');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          어디로 떠날까요?<br />일정을 만들어보세요
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-2">
          빠르고 직관적인 AI 여행 플래너
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Core Creation Form */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          
          {/* Destination */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">여행지</label>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-text group">
              <Search size={20} className="text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="도시, 지역, 국가 검색"
                className="w-full bg-transparent outline-none text-slate-900 text-base font-bold placeholder:text-slate-300 placeholder:font-medium"
                autoFocus
              />
            </div>
          </div>

          {/* Dates */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">여행 기간</label>
            <div 
              className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon size={20} className="text-slate-400" />
              <div className="flex-1 min-w-0">
                {selectedRange?.from ? (
                  <p className="text-base font-bold text-slate-900">
                    {format(selectedRange.from, 'MM.dd')} - {selectedRange.to ? format(selectedRange.to, 'MM.dd') : '선택 중'}
                  </p>
                ) : (
                  <p className="text-base text-slate-300 font-medium">날짜를 선택해주세요</p>
                )}
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          </div>

          {/* Title */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">여행 제목</label>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Navigation size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="예: 제주도 3박 4일 힐링 (선택)"
                className="w-full bg-transparent outline-none text-slate-900 text-base font-bold placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>
          </div>
          
          <button
            onClick={handleStart}
            className="w-full py-4 mt-2 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all text-lg shadow-md flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            일정 만들기
          </button>
        </div>
      </div>

      {/* Calendar Bottom Sheet */}
      <BottomSheet isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} title="기간 선택">
        <div className="p-4 flex flex-col items-center">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            locale={ko}
            className="mb-4 text-slate-800 font-medium"
            modifiersStyles={{
              selected: { backgroundColor: '#2563EB', color: '#fff' }
            }}
          />
          <button
            onClick={() => setIsCalendarOpen(false)}
            className="w-full py-4 mt-4 bg-slate-900 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-sm text-lg"
          >
            선택 완료
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
