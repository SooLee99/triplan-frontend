import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { ChevronLeft, Sparkles, PenLine, Blend } from 'lucide-react';

const MODES = [
  { id: 'ai' as const, icon: Sparkles, label: 'AI 추천', desc: 'AI가 스타일에 맞는 장소를 자동 추천하고 일정을 구성합니다', tag: '추천', color: 'blue' },
  { id: 'manual' as const, icon: PenLine, label: '직접 입력', desc: '가고 싶은 장소를 직접 검색해서 하나씩 추가합니다', tag: null, color: 'gray' },
  { id: 'hybrid' as const, icon: Blend, label: '혼합 모드', desc: 'AI 추천을 기반으로 직접 장소를 추가하거나 수정합니다', tag: '인기', color: 'violet' },
];

export function ModeScreen() {
  const navigate = useNavigate();
  const { planMode, setPlanMode } = useApp();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>STEP 3</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>계획 방식 선택</h2>
        </div>
      </div>
      <p className="px-6 text-gray-500 mb-6" style={{ fontSize: '0.85rem' }}>어떤 방식으로 여행을 계획할까요?</p>

      <div className="flex-1 px-6 space-y-3">
        {MODES.map(m => {
          const selected = planMode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setPlanMode(m.id)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}
            >
              {m.tag && (
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-white ${m.color === 'blue' ? 'bg-blue-500' : 'bg-violet-500'}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  {m.tag}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selected ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{m.label}</div>
              <div className="text-gray-400 mt-1" style={{ fontSize: '0.8rem' }}>{m.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="p-6 pb-10">
        <button
          onClick={() => navigate('/departure')}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white flex items-center justify-center gap-2"
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          출발지·도착지 설정
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}