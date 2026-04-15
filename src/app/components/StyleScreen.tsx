import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STYLES = [
  { id: 'culture', emoji: '🏛️', label: '문화·역사', desc: '사찰, 박물관, 유적지' },
  { id: 'food', emoji: '🍜', label: '미식 탐방', desc: '로컬 맛집, 시장, 카페' },
  { id: 'nature', emoji: '🌿', label: '자연·힐링', desc: '공원, 정원, 산책' },
  { id: 'shopping', emoji: '🛍️', label: '쇼핑', desc: '백화점, 골목 쇼핑' },
  { id: 'photo', emoji: '📸', label: '포토스팟', desc: '인생샷 명소 위주' },
  { id: 'nightlife', emoji: '🌙', label: '야경·나이트', desc: '바, 전망대, 야시장' },
  { id: 'activity', emoji: '⚡', label: '액티비티', desc: '체험, 테마파크' },
  { id: 'local', emoji: '🏘️', label: '로컬 체험', desc: '현지인처럼 여행' },
];

export function StyleScreen() {
  const navigate = useNavigate();
  const { styles, setStyles } = useApp();

  const toggle = (id: string) => {
    setStyles(styles.includes(id) ? styles.filter(s => s !== id) : [...styles, id]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 500 }}>STEP 2/4</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>여행 스타일 선택</h2>
        </div>
      </div>
      <p className="px-6 text-gray-500 mb-4" style={{ fontSize: '0.85rem' }}>관심 있는 스타일을 모두 선택하세요 (복수 선택)</p>

      <div className="flex-1 px-6 overflow-y-auto pb-4">
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map(s => {
            const selected = styles.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <div style={{ fontSize: '1.5rem' }}>{s.emoji}</div>
                <div className="mt-2" style={{ fontSize: '0.9rem', fontWeight: 600, color: selected ? '#2563eb' : '#1f2937' }}>{s.label}</div>
                <div className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 pb-10">
        <button
          onClick={() => navigate('/mode')}
          disabled={styles.length === 0}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${styles.length > 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          다음으로
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
