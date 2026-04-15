import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Search, Map as MapIcon, Sparkles, Navigation, X, Check, MapPin, Navigation2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockPlaces = [
  { id: '1', name: '아르떼뮤지엄 제주', category: '미디어아트', context: '현재 일정에 추가하기 좋은 장소', distance: '1.2km', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14ebd07?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '2', name: '애월해안도로', category: '해안도로 드라이브', context: '동선상 가까운 장소', distance: '3.5km', img: 'https://images.unsplash.com/photo-1524855474320-b054ab3f2832?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '3', name: '협재해수욕장', category: '해변 · 자연', context: '빈 시간대에 넣기 좋은 장소', distance: '5.1km', img: 'https://images.unsplash.com/photo-1622616218151-5121b660a92f?auto=format&fit=crop&q=80&w=400&h=300' },
];

export function PlacesScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('recommend');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [addedPlaces, setAddedPlaces] = useState<Record<number, string[]>>({
    1: ['1'], // 예시: Day 1에 기본적으로 하나 추가되어 있음
    2: [],
    3: [],
    4: [],
  });
  const tripDays = [1, 2, 3, 4];

  const getOtherDayAdded = (id: string) => {
    for (const [day, places] of Object.entries(addedPlaces)) {
      if (Number(day) !== activeDay && places.includes(id)) {
        return Number(day);
      }
    }
    return null;
  };
  
  const handleAddToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAddedPlaces((prev) => {
      const currentDayPlaces = prev[activeDay] || [];
      if (currentDayPlaces.includes(id)) {
        return { ...prev, [activeDay]: currentDayPlaces.filter(pId => pId !== id) };
      } else {
        return { ...prev, [activeDay]: [...currentDayPlaces, id] };
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-3 z-30 shadow-sm sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors shrink-0">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="장소 검색 또는 주소 입력"
              className="w-full pl-11 pr-4 py-3 bg-slate-100 text-slate-900 text-sm font-medium rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm border border-transparent focus:border-blue-200"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('recommend')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'recommend' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles size={16} />
            AI 추천
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapIcon size={16} />
            일반 검색
          </button>
        </div>
      </div>

      {/* Day Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 py-3 bg-white border-b border-slate-100 z-20 relative">
        {tripDays.map((day) => (
          <button
            key={day}
            onClick={() => {
              setActiveDay(day);
              setSelectedPlaceId(null);
            }}
            className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all shadow-sm border
              ${activeDay === day ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* Map Area */}
      <div className="h-[25vh] bg-blue-50 relative shrink-0 border-b border-slate-200 shadow-inner">
        {/* Map Placeholder Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
        
        {/* Mock Map UI */}
        <div className="absolute inset-0 z-10 p-4">
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md border border-slate-100">
            <Navigation2 size={20} className="text-blue-600" />
          </div>
          
          {/* Mock Markers */}
          {mockPlaces.map((place, idx) => (
            <div 
              key={place.id} 
              className={`absolute flex flex-col items-center justify-center cursor-pointer group transition-all duration-300
                ${idx === 0 ? 'top-[40%] left-[30%]' : idx === 1 ? 'top-[60%] left-[50%]' : 'top-[30%] left-[70%]'}
                ${selectedPlaceId === place.id ? 'scale-125 z-20' : 'scale-100 hover:scale-110 z-10'}`}
              onClick={() => setSelectedPlaceId(place.id)}
            >
              <div className={`px-2 py-1 bg-white text-xs font-bold rounded-lg shadow-lg border-2 mb-1 truncate max-w-[80px]
                ${selectedPlaceId === place.id ? 'border-blue-500 text-blue-600' : 'border-slate-200 text-slate-800'}`}>
                {place.name}
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2
                ${(addedPlaces[activeDay] || []).includes(place.id) ? 'bg-blue-600 border-white text-white' : 'bg-slate-800 border-white text-white'}`}>
                {(addedPlaces[activeDay] || []).includes(place.id) ? <Check size={12} strokeWidth={4} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {activeTab === 'recommend' && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sparkles size={18} className="text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800">동선에 딱 맞는 추천 장소</h3>
          </div>
        )}

        <div className="space-y-4 pb-8">
          {mockPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedPlaceId(place.id)}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all cursor-pointer group hover:shadow-md
                ${selectedPlaceId === place.id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-100'}`}
            >
              <div className="flex p-3 gap-4 h-32">
                <div className="w-28 h-full rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <ImageWithFallback src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                  {activeTab === 'recommend' && (
                    <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-1.5 self-start shrink-0 truncate max-w-full">
                      {place.context}
                    </span>
                  )}
                  <h4 className="text-base font-bold text-slate-900 truncate mb-1 leading-tight">{place.name}</h4>
                  <p className="text-xs text-slate-500 truncate mb-auto leading-relaxed">{place.category}</p>
                  
                  <div className="flex items-end justify-between mt-2 pt-2 border-t border-slate-50">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
                      {place.distance}
                    </span>
                    <button 
                      onClick={(e) => handleAddToggle(e, place.id)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1
                        ${(addedPlaces[activeDay] || []).includes(place.id) 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-600 ring-offset-1' 
                          : getOtherDayAdded(place.id)
                            ? 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {(addedPlaces[activeDay] || []).includes(place.id) ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          추가됨
                        </>
                      ) : getOtherDayAdded(place.id) ? (
                        `Day ${getOtherDayAdded(place.id)}에 추가됨`
                      ) : (
                        '일정에 추가'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="bg-white border-t border-slate-100 p-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-30">
        <button
          onClick={() => navigate('/editor')}
          className="w-full bg-blue-600 text-white rounded-2xl py-3.5 flex items-center justify-center font-bold text-[15px] transition-colors hover:bg-blue-700 active:scale-[0.98]"
        >
          {Object.values(addedPlaces).flat().length}개 장소 확정하기
        </button>
      </div>
    </div>
  );
}
