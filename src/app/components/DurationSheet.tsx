import React, { useState } from 'react';
import { type Place } from '../store';
import { X, Clock, Minus, Plus } from 'lucide-react';

interface Props {
  place: Place;
  onClose: () => void;
  onSave: (duration: number) => void;
}

const PRESETS = [30, 60, 90, 120, 180];

export function DurationSheet({ place, onClose, onSave }: Props) {
  const [duration, setDuration] = useState(place.duration);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>체류시간 수정</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Place info */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{place.name}</div>
            <div className="text-gray-400" style={{ fontSize: '0.75rem' }}>현재 {place.duration}분 → 변경 후 {duration}분</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <button
            onClick={() => setDuration(Math.max(15, duration - 15))}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <div className="text-blue-600" style={{ fontSize: '2.2rem', fontWeight: 700 }}>{duration}</div>
            <div className="text-gray-400" style={{ fontSize: '0.75rem' }}>분</div>
          </div>
          <button
            onClick={() => setDuration(duration + 15)}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={15}
          max={300}
          step={15}
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
        />

        {/* Presets */}
        <div className="flex gap-2 mb-6">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setDuration(p)}
              className={`flex-1 py-2 rounded-xl text-center transition-all ${duration === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              style={{ fontSize: '0.8rem', fontWeight: 500 }}
            >
              {p >= 60 ? `${p / 60}시간` : `${p}분`}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSave(duration)}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white"
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
