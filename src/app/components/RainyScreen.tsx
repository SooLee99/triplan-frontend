import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { INDOOR_ALTERNATIVES } from '../store';
import { ChevronLeft, CloudRain, RefreshCw, Clock, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function RainyScreen() {
  const navigate = useNavigate();
  const { schedule, replacePlace } = useApp();

  const outdoorPlaces = schedule.filter(item => !item.place.isIndoor);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>비 예보 대비</h2>
          <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>야외 장소를 실내로 대체할 수 있어요</p>
        </div>
      </div>

      {/* Weather alert */}
      <div className="mx-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-4">
        <CloudRain className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-blue-700" style={{ fontSize: '0.85rem', fontWeight: 600 }}>오후 2시~5시 비 예보</div>
          <div className="text-blue-500 mt-0.5" style={{ fontSize: '0.75rem' }}>해당 시간대 야외 일정 {outdoorPlaces.length}개를 실내 장소로 대체할 수 있습니다</div>
        </div>
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-6">
        {outdoorPlaces.length === 0 ? (
          <div className="text-center py-12 text-gray-400" style={{ fontSize: '0.9rem' }}>
            모든 장소가 실내입니다 👍
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500" style={{ fontSize: '0.8rem', fontWeight: 500 }}>야외 일정 ({outdoorPlaces.length}개)</p>
            {outdoorPlaces.map(item => (
              <div key={item.place.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback src={item.place.image} alt={item.place.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.place.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400" style={{ fontSize: '0.7rem' }}>{item.place.category}</span>
                      <span className="text-red-400 flex items-center gap-0.5" style={{ fontSize: '0.7rem' }}>
                        <CloudRain className="w-3 h-3" /> 비 영향
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-400" style={{ fontSize: '0.7rem', fontWeight: 500 }}>대체 추천</p>
                  {INDOOR_ALTERNATIVES.slice(0, 2).map(alt => (
                    <button
                      key={alt.id}
                      onClick={() => {
                        replacePlace(item.place.id, alt);
                        navigate(-1);
                      }}
                      className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-blue-300 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={alt.image} alt={alt.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{alt.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400" style={{ fontSize: '0.65rem' }}>{alt.category}</span>
                          <span className="flex items-center gap-0.5 text-gray-400" style={{ fontSize: '0.65rem' }}>
                            <Clock className="w-3 h-3" />{alt.duration}분
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-500" style={{ fontSize: '0.65rem' }}>
                            <Star className="w-3 h-3 fill-amber-500" />{alt.rating}
                          </span>
                        </div>
                      </div>
                      <RefreshCw className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
