import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Calendar as CalendarIcon, MapPin, Compass, MoreVertical } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockSavedTrips = [
  { id: '1', title: '제주도 3박 4일 힐링 코스', date: '2026.04.15 - 04.18', location: '제주특별자치도', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14ebd07?auto=format&fit=crop&q=80&w=400&h=300', status: 'upcoming' },
  { id: '2', title: '부산 2박 3일 먹방투어', date: '2026.05.01 - 05.03', location: '부산광역시', img: 'https://images.unsplash.com/photo-1590518712390-33bfdf0688fc?auto=format&fit=crop&q=80&w=400&h=300', status: 'planned' },
  { id: '3', title: '강릉 당일치기 카페투어', date: '2026.06.12', location: '강원특별자치도', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=400&h=300', status: 'planned' },
];

export function SavedTripsScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4 bg-white sticky top-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">내 여행</h1>
        <button 
           onClick={() => navigate('/')}
           className="p-1 -mr-1 text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-full"
        >
          새 일정
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockSavedTrips.map((trip) => (
          <div 
            key={trip.id}
            onClick={() => navigate('/editor')}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-all group hover:shadow-md"
          >
            <div className="h-32 relative">
               <ImageWithFallback src={trip.img} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
               
               <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-1.5 text-white shadow-sm border border-white/20 hover:bg-white hover:text-slate-900 transition-colors z-10">
                  <MoreVertical size={16} />
               </div>

               <div className="absolute bottom-4 left-4 text-white z-10">
                  {trip.status === 'upcoming' && (
                     <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white font-bold text-[10px] rounded-lg shadow-sm uppercase tracking-wider mb-2">
                        다가오는 일정
                     </span>
                  )}
                  <h3 className="text-lg font-bold truncate pr-4 text-shadow-sm">{trip.title}</h3>
               </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between">
               <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                     <CalendarIcon size={14} className="text-blue-500" />
                     {trip.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                     <MapPin size={14} className="text-slate-400" />
                     {trip.location}
                  </div>
               </div>
               
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
                  <ChevronRight size={20} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
