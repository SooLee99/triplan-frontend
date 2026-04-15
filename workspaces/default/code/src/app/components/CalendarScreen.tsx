import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Map, ChevronLeft, MapPin, Calendar as CalendarIcon, Clock, MoveRight, Compass, LogIn } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const mockTrips = [
  { id: '1', title: '제주도 3박 4일 힐링', start: new Date(2026, 3, 15), end: new Date(2026, 3, 18), location: '제주특별자치도', status: 'upcoming' },
];

export function CalendarScreen() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 3, 15));

  // Determine if a selected date has a trip
  const selectedTrip = mockTrips.find(t => 
    selectedDate && selectedDate >= t.start && selectedDate <= t.end
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 z-10 sticky top-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">여행 달력</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Calendar Card */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ko}
            modifiers={{
              trip: (date) => mockTrips.some(t => date >= t.start && date <= t.end),
            }}
            modifiersStyles={{
              trip: { backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 'bold', borderRadius: '50%' },
              selected: { backgroundColor: '#2563EB', color: '#fff' }
            }}
            className="font-medium text-slate-800 p-2"
          />
        </div>

        {/* Selected Date Context */}
        <h2 className="text-sm font-bold text-slate-500 px-2 mt-6 mb-2">선택한 날짜</h2>
        
        {selectedTrip ? (
          <div 
            onClick={() => navigate('/editor')}
            className="bg-white rounded-3xl p-5 shadow-md border border-slate-100/50 cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-xl shadow-sm uppercase tracking-wider">
                <Compass size={12} strokeWidth={2.5} />
                다가오는 여행
              </span>
              <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">D-3</p>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{selectedTrip.title}</h3>
            
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-2">
              <CalendarIcon size={14} className="text-slate-400" />
              {format(selectedTrip.start, 'MM.dd')} 
              <MoveRight size={12} className="text-slate-300" /> 
              {format(selectedTrip.end, 'MM.dd')}
            </div>
            
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1.5">
               <MapPin size={14} className="text-slate-400" />
               {selectedTrip.location}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center group-hover:border-blue-100 transition-colors">
               <span className="text-xs font-bold text-blue-600">일정 확인하기</span>
               <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                  <MoveRight size={16} />
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/50 rounded-3xl p-8 border border-slate-200/50 border-dashed flex flex-col items-center justify-center text-slate-400 shadow-sm">
             <CalendarIcon size={32} className="mb-4 text-slate-300" strokeWidth={1.5} />
             <p className="text-sm font-bold text-slate-600 mb-1">일정이 없습니다</p>
             <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
               선택하신 날짜에 계획된<br />여행 일정이 존재하지 않습니다
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
