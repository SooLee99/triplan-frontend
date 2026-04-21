import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { MapPin, Calendar, Users, ChevronRight, Plane } from 'lucide-react';

export function TripInfoScreen() {
  const navigate = useNavigate();
  const { tripInfo, setTripInfo } = useApp();
  const [dest, setDest] = useState(tripInfo.destination);
  const [start, setStart] = useState(tripInfo.startDate);
  const [end, setEnd] = useState(tripInfo.endDate);
  const [travelers, setTravelers] = useState(tripInfo.travelers);

  useEffect(() => {
    setDest(tripInfo.destination);
  }, [tripInfo.destination]);


  const handleNext = () => {
    setTripInfo({ ...tripInfo, destination: dest, startDate: start, endDate: end, travelers });
    navigate('/style');
  };

  const isValid = dest.trim() && start && end;

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="text-blue-600" style={{ fontSize: '0.8rem', fontWeight: 600 }}>TRIPLAN AI</span>
        </div>
        <h1 className="mt-4" style={{ fontSize: '1.625rem', fontWeight: 700, lineHeight: 1.3 }}>어디로 떠나볼까요?</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: '0.9rem' }}>여행 정보를 입력하면 AI가 최적의 일정을 만들어 드려요</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-4">
        {/* Destination */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-gray-500" style={{ fontSize: '0.8rem', fontWeight: 500 }}>여행지</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/destination')}
            className="w-full"
          >
          <div className="w-full text-left flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 focus-within:border-blue-500">
            <span
              className={dest ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontSize: '1.05rem', fontWeight: 500 }}
            >
              {dest || '도시 또는 지역을 선택하세요'}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        </div>

        {/* Dates */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-500" style={{ fontSize: '0.8rem', fontWeight: 500 }}>출발일</span>
            </div>
            <input
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            />
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-500" style={{ fontSize: '0.8rem', fontWeight: 500 }}>도착일</span>
            </div>
            <input
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-500" style={{ fontSize: '0.8rem', fontWeight: 500 }}>인원</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600">−</button>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{travelers}명</span>
            <button onClick={() => setTravelers(travelers + 1)} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600">+</button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 pb-4">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${isValid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          다음으로
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
