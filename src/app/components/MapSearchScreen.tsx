import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '../context';
import { MAP_LOCATION_ITEMS } from '../data/mapLocations';
import { ChevronLeft, Search, MapPin, Navigation, LocateFixed } from 'lucide-react';

function formatDistance(lat: number, lng: number) {
  const centerLat = 35.6812;
  const centerLng = 139.7671;
  const latDiff = lat - centerLat;
  const lngDiff = lng - centerLng;
  const roughKm = Math.sqrt((latDiff * 111) ** 2 + (lngDiff * 88) ** 2);
  return `${roughKm.toFixed(1)}km`;
}

export function MapSearchScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { updateDayArrival, updateDayDeparture } = useApp();
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');

  const type = params.get('type') === 'arrival' ? 'arrival' : 'departure';
  const day = Number(params.get('day') ?? 0);
  const safeDay = Number.isNaN(day) ? 0 : day;

  const resultItems = useMemo(() => {
    const keyword = searchedQuery.trim().toLowerCase();
    if (!keyword) return MAP_LOCATION_ITEMS;
    return MAP_LOCATION_ITEMS.filter((item) =>
      [item.name, item.address, item.category].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [searchedQuery]);

  const handleSearch = () => {
    setSearchedQuery(query.trim());
  };

  const handleSelect = (name: string, lat: number, lng: number) => {
    const point = { name, lat, lng };
    if (type === 'arrival') {
      updateDayArrival(safeDay, point);
    } else {
      updateDayDeparture(safeDay, point);
    }
    navigate('/departure');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>지도 검색</p>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {type === 'arrival' ? '도착지 선택' : '출발지 선택'}
          </h2>
        </div>
      </div>

      <p className="px-6 text-gray-500 mb-4" style={{ fontSize: '0.8rem' }}>
        현재는 프론트 데이터로 검색하며, 추후 지도 API로 대체될 예정입니다.
      </p>

      <div className="px-6 mb-4">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="장소명, 주소, 카테고리로 검색"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            style={{ fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-3 py-2 rounded-xl bg-blue-600 text-white"
            style={{ fontSize: '0.78rem', fontWeight: 600 }}
          >
            검색
          </button>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <LocateFixed className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              지도 미리보기 영역 (API 연동 예정)
            </span>
          </div>
          <div className="h-28 rounded-xl bg-white/70 border border-dashed border-blue-200 flex items-center justify-center">
            <span className="text-blue-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              검색 결과를 기반으로 지도 핀/영역 표시 예정
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-2">
        {resultItems.length > 0 ? (
          resultItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.name, item.lat, item.lng)}
              className="w-full text-left rounded-2xl border border-gray-100 bg-white px-4 py-3 hover:border-blue-300 hover:bg-blue-50/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-gray-900" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</p>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-0.5 truncate" style={{ fontSize: '0.76rem' }}>{item.address}</p>
                  <div className="flex items-center gap-1 text-gray-400 mt-1" style={{ fontSize: '0.7rem' }}>
                    <Navigation className="w-3 h-3" />
                    도쿄역 기준 약 {formatDistance(item.lat, item.lng)}
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
            <p className="text-gray-500" style={{ fontSize: '0.86rem', fontWeight: 600 }}>검색 결과가 없습니다</p>
            <p className="text-gray-400 mt-1" style={{ fontSize: '0.75rem' }}>
              다른 키워드로 다시 검색해 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
