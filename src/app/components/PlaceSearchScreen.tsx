import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MAP_LOCATION_ITEMS } from '../data/mapLocations';
import {
  ChevronLeft,
  Search,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';

function formatDistance(lat: number, lng: number) {
  const centerLat = 35.6812;
  const centerLng = 139.7671;
  const latDiff = lat - centerLat;
  const lngDiff = lng - centerLng;
  const roughKm = Math.sqrt((latDiff * 111) ** 2 + (lngDiff * 88) ** 2);
  return `${roughKm.toFixed(1)}km`;
}

export function PlaceSearchScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [query, setQuery] = useState('');

  const type = params.get('type') || 'departure';
  const day = params.get('day') || '0';
  const placeId = params.get('placeId');
  const returnTo = params.get('returnTo') || '/departure';
  const selectedId = params.get('selectedId');

  const resultItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return MAP_LOCATION_ITEMS;

    return MAP_LOCATION_ITEMS.filter((item) =>
      [item.name, item.address, item.category].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [query]);

  const handleSelect = (id: string) => {
    const nextParams = new URLSearchParams();

    nextParams.set('type', type);
    nextParams.set('day', day);
    nextParams.set('returnTo', returnTo);
    nextParams.set('selectedId', id);

    if (placeId) {
      nextParams.set('placeId', placeId);
    }

    navigate(`/map-search?${nextParams.toString()}`);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      <div className="shrink-0 border-b border-gray-100 bg-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div>
            <p
              className="text-gray-500"
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              장소 검색
            </p>
            <h2 style={{ fontSize: '1.06rem', fontWeight: 700 }}>
              장소 리스트
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소명 또는 주소를 검색하세요"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            style={{ fontSize: '0.86rem' }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-2">
        {resultItems.length > 0 ? (
          resultItems.map((item) => {
            const isSelected = selectedId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate text-gray-900"
                      style={{ fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-gray-500 mt-1"
                      style={{ fontSize: '0.76rem', lineHeight: 1.5 }}
                    >
                      {item.address}
                    </p>
                    <div
                      className="flex items-center gap-1 text-gray-400 mt-2"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <Navigation className="w-3 h-3" />
                      도쿄역 기준 약 {formatDistance(item.lat, item.lng)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
            <p
              className="text-gray-500"
              style={{ fontSize: '0.86rem', fontWeight: 600 }}
            >
              검색 결과가 없습니다
            </p>
            <p
              className="text-gray-400 mt-1"
              style={{ fontSize: '0.75rem' }}
            >
              다른 장소명 또는 주소로 다시 검색해 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}