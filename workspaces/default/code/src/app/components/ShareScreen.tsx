import React from 'react';
import { useNavigate } from 'react-router';
import { Share2, Download, Link, ChevronLeft, MapPin, Calendar, Navigation2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockSharedData = {
  title: '제주도 3박 4일 힐링 코스',
  date: '2024.10.15 - 2024.10.18',
  coverImg: 'https://images.unsplash.com/photo-1542314831-c6a4d14ebd07?auto=format&fit=crop&q=80&w=800&h=400',
  days: [
    {
      day: 1,
      date: '10.15 (화)',
      places: [
        { id: '1', name: '제주공항', time: '10:00 AM', type: 'departure' },
        { id: '2', name: '함덕해수욕장', time: '10:45 AM - 12:15 PM', type: 'place', duration: '1시간 30분' },
        { id: '3', name: '카페 델문도', time: '12:25 PM - 01:25 PM', type: 'place', duration: '1시간' },
        { id: '4', name: '숙소 (그랜드 하얏트)', time: '01:55 PM', type: 'arrival' },
      ],
    },
    // ... add more days if needed
  ],
};

export function ShareScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-100 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 sticky top-0 bg-slate-100/90 backdrop-blur-md z-30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">일정 공유</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Document Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100/50 relative">
          {/* Cover Image */}
          <div className="h-48 relative">
            <ImageWithFallback src={mockSharedData.coverImg} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 shadow-sm border border-white/10">
                완성된 일정
              </span>
              <h2 className="text-2xl font-bold mb-1 tracking-tight">{mockSharedData.title}</h2>
              <div className="flex items-center gap-2 text-sm text-white/90 font-medium opacity-90">
                <Calendar size={14} />
                {mockSharedData.date}
              </div>
            </div>
          </div>

          {/* Map Preview (Mock) */}
          <div className="h-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2 border border-slate-200/50">
                 <MapPin size={14} className="text-blue-500" />
                 경로 요약 지도
               </div>
             </div>
          </div>

          {/* Timeline Data */}
          <div className="p-6 space-y-8">
            {mockSharedData.days.map((day) => (
              <div key={day.day}>
                <div className="flex items-end gap-2 mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Day {day.day}</h3>
                  <span className="text-sm font-medium text-slate-500 mb-0.5">{day.date}</span>
                </div>

                <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 ml-2">
                  {day.places.map((place, idx) => (
                    <div key={place.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10
                        ${place.type === 'departure' ? 'bg-blue-500 w-3.5 h-3.5 -left-[22px]' : 
                          place.type === 'arrival' ? 'bg-orange-500 w-3.5 h-3.5 -left-[22px]' : 'bg-slate-300'}`} 
                      />
                      
                      <div className="bg-slate-50/50 rounded-2xl p-4 ml-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-600 mb-1 tracking-wider uppercase">
                              {place.type === 'departure' ? 'Start' : place.type === 'arrival' ? 'End' : 'Place'}
                            </p>
                            <h4 className="text-base font-bold text-slate-900 truncate">{place.name}</h4>
                            {place.duration && (
                              <p className="text-xs text-slate-500 font-medium mt-1 inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm">
                                {place.duration}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100/50">
                              {place.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Actions - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center justify-center py-3 bg-slate-50 text-slate-700 font-semibold rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-xs border border-slate-200">
            <Link size={20} className="mb-1.5" />
            링크 복사
          </button>
          <button className="flex flex-col items-center justify-center py-3 bg-slate-50 text-slate-700 font-semibold rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-xs border border-slate-200">
            <Download size={20} className="mb-1.5" />
            이미지 저장
          </button>
          <button className="flex flex-col items-center justify-center py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all text-xs shadow-md">
            <Share2 size={20} className="mb-1.5" />
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
