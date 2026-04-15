import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Plus } from 'lucide-react';

export function TravelHistoryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white sticky top-0 shadow-sm z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">여행 기록</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-slate-50">
          <MapPin size={48} className="text-slate-400" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight text-center">
          아직 완료한 여행이 없어요
        </h2>
        <p className="text-slate-500 text-center text-sm font-medium leading-relaxed mb-8">
          TripMaker와 함께 새로운 여행을<br />계획하고 기록을 남겨보세요
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-md text-lg hover:bg-blue-700"
        >
          <Plus size={20} strokeWidth={2.5} />
          새로운 여행 계획하기
        </button>
      </div>
    </div>
  );
}
