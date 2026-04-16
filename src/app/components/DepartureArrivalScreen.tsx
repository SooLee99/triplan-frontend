import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { type DayPoint } from '../store';
import {
  ChevronLeft, ChevronRight, CircleDot, Flag, MapPin, Check, Copy, Sparkles, Search, X
} from 'lucide-react';

function PointEditor({
  dayIndex,
  type,
  point,
}: {
  dayIndex: number;
  type: 'departure' | 'arrival';
  point: DayPoint;
}) {
  const navigate = useNavigate();
  const { updateDayDeparture, updateDayArrival } = useApp();

  const handleReset = () => {
    const emptyPoint = { name: '', lat: 0, lng: 0 };
    if (type === 'departure') {
      updateDayDeparture(dayIndex, emptyPoint);
      return;
    }
    updateDayArrival(dayIndex, emptyPoint);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        {type === 'departure' ? (
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
            <CircleDot className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
            <Flag className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
          {type === 'departure' ? '출발지' : '도착지'}
        </span>
        {point.name && (
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
            style={{ fontSize: '0.7rem', fontWeight: 600 }}
          >
            {point.name}
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/map-search?type=${type}&day=${dayIndex}`)}
        className="w-full flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-3 hover:border-blue-300 transition-colors text-left"
      >
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p
            className={point.name ? 'text-gray-900 truncate' : 'text-gray-400'}
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            {point.name || '지도 검색으로 장소를 선택하세요'}
          </p>
          <p className="text-gray-300 mt-0.5" style={{ fontSize: '0.7rem' }}>
            검색창 + 검색 버튼으로 장소를 찾을 수 있어요
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </button>
    </div>
  );
}

export function DepartureArrivalScreen() {
  const navigate = useNavigate();
  const { tripInfo, daySchedules, initDaySchedules, updateDayDeparture, updateDayArrival, dayCount } = useApp();
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    initDaySchedules();
  }, []);

  const currentDayData = daySchedules[activeDay];

  const allDaysHavePoints = daySchedules.length > 0 && daySchedules.every(
    d => d.departure.name && d.arrival.name
  );

  const handleCopyToAll = () => {
    if (!currentDayData) return;
    daySchedules.forEach((_, i) => {
      if (i !== activeDay) {
        updateDayDeparture(i, { ...currentDayData.departure });
        updateDayArrival(i, { ...currentDayData.arrival });
@@ -261,73 +175,73 @@ export function DepartureArrivalScreen() {
          {/* Day header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeDay + 1}</span>
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>Day {activeDay + 1}</p>
                <p className="text-gray-400" style={{ fontSize: '0.7rem' }}>{formatDate(currentDayData.date)}</p>
              </div>
            </div>
            {daySchedules.length > 1 && currentDayData.departure.name && currentDayData.arrival.name && (
              <button
                onClick={handleCopyToAll}
                className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                style={{ fontSize: '0.7rem', fontWeight: 600 }}
              >
                <Copy className="w-3 h-3" />
                전체 일정에 복사
              </button>
            )}
          </div>

          {/* Departure */}
          <PointEditor
            dayIndex={activeDay}
            type="departure"
            point={currentDayData.departure}
          />

          {/* Visual connector */}
          <div className="flex items-center gap-3 ml-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-px h-3 bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-px h-3 bg-gray-300" />
            </div>
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-blue-600" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                AI가 출발지→도착지 거리 기반으로 장소를 최적 배치합니다
              </span>
            </div>
          </div>

          {/* Arrival */}
          <PointEditor
            dayIndex={activeDay}
            type="arrival"
            point={currentDayData.arrival}
          />
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          disabled={!allDaysHavePoints}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            allDaysHavePoints ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          {allDaysHavePoints ? '장소 선택하기' : `모든 일정의 출발지·도착지를 설정하세요`}
          {allDaysHavePoints && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}