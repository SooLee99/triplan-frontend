import React from 'react';
import { TRANSPORT_OPTIONS, type TransportMode } from '../store';
import { X, CheckCircle2 } from 'lucide-react';

interface Props {
  currentMode: TransportMode;
  fromName: string;
  toName: string;
  onClose: () => void;
  onSelect: (mode: TransportMode) => void;
}

export function TransportSheet({ currentMode, fromName, toName, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-2">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>이동수단 변경</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-400 mb-5" style={{ fontSize: '0.8rem' }}>
          {fromName} → {toName}
        </p>

        <div className="space-y-2">
          {TRANSPORT_OPTIONS.map(opt => {
            const selected = currentMode === opt.mode;
            // Estimate time display
            const baseTime = 25; // placeholder
            const estTime = Math.round(baseTime * opt.multiplier);
            return (
              <button
                key={opt.mode}
                onClick={() => onSelect(opt.mode)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                  <div className="text-left">
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{opt.label}</div>
                    <div className="text-gray-400" style={{ fontSize: '0.75rem' }}>예상 약 {estTime}분</div>
                  </div>
                </div>
                {selected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
