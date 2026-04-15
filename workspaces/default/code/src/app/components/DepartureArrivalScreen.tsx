import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Search, MapPin, Navigation2, X } from 'lucide-react';

const mockResults = [
  { id: '1', name: '제주국제공항', address: '제주특별자치도 제주시 공항로 2', distance: '1.2km' },
  { id: '2', name: '그랜드 하얏트 제주', address: '제주특별자치도 제주시 노연로 12', distance: '3.4km' },
  { id: '3', name: '제주도청', address: '제주특별자치도 제주시 문연로 6', distance: '4.1km' },
];

export function DepartureArrivalScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const handleSelect = (place: typeof mockResults[0]) => {
    // In a real app, save to context
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-white relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">장소 검색</h1>
        <div className="w-10"></div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4 sticky top-0 bg-white z-10 shadow-sm border-b border-slate-100">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="출발지 또는 도착지 검색"
            className="w-full pl-11 pr-10 py-4 bg-slate-50 text-slate-900 text-base font-medium rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm border border-slate-200"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-slate-600 rounded-full hover:bg-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {!isSearching ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 mt-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <MapPin size={32} />
            </div>
            <p className="text-base font-medium text-slate-500 text-center leading-relaxed">
              정확한 장소명이나<br />주소를 검색해보세요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 mb-2 px-1">검색 결과</h3>
            {mockResults.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelect(place)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 active:scale-98 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-500 mt-1 shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-900 truncate mb-1">{place.name}</h4>
                  <p className="text-xs text-slate-500 truncate mb-2">{place.address}</p>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {place.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
