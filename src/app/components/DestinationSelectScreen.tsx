import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Search, Check } from 'lucide-react';
import { useApp } from '../context';
import { KOREA_AREAS } from '../data/koreaRegions';

export function DestinationSelectScreen() {
  const navigate = useNavigate();
  const { tripInfo, setTripInfo } = useApp();
  const [query, setQuery] = useState('');
  const [activeAreaCode, setActiveAreaCode] = useState<number>(tripInfo.destinationAreaCode ?? KOREA_AREAS[0].code);
  const [selected, setSelected] = useState({
    areaCode: tripInfo.destinationAreaCode,
    sigunguCode: tripInfo.destinationSigunguCode,
  });

  const activeArea = useMemo(() => {
    return KOREA_AREAS.find((area) => area.code === activeAreaCode) ?? KOREA_AREAS[0];
  }, [activeAreaCode]);

  const selectedText = useMemo(() => {
    if (!selected.areaCode || !selected.sigunguCode) return '';

    const area = KOREA_AREAS.find((item) => item.code === selected.areaCode);
    const sigungu = area?.sigungu.find((item) => item.code === selected.sigunguCode);

    if (!area || !sigungu) return '';
    return `${area.name} ${sigungu.name}`;
  }, [selected]);

  const filteredSigungu = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return activeArea.sigungu;
    }

    return activeArea.sigungu.filter((sigungu) => `${activeArea.name} ${sigungu.name}`.toLowerCase().includes(normalizedQuery));
  }, [query, activeArea]);

  const handleConfirm = () => {
    if (!selected.areaCode || !selected.sigunguCode) return;

    const area = KOREA_AREAS.find((item) => item.code === selected.areaCode);
    const sigungu = area?.sigungu.find((item) => item.code === selected.sigunguCode);
    if (!area || !sigungu) return;

    setTripInfo({
      ...tripInfo,
      destination: `${area.name} ${sigungu.name}`,
      destinationAreaCode: area.code,
      destinationSigunguCode: sigungu.code,
    });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>여행지 선택</h2>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>지역 또는 도시를 선택해주세요</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3 border border-gray-100 focus-within:border-blue-300">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="지역/도시 검색"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
            style={{ fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="px-6 pt-4 pb-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {KOREA_AREAS.map((area) => {
            const isActive = activeAreaCode === area.code;
            return (
              <button
                key={area.code}
                onClick={() => {
                  setActiveAreaCode(area.code);
                  setQuery('');
                }}
                className={`px-3 py-2 rounded-full border transition-colors ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                {area.name}
              </button>
            );
          })}
        </div>
      </div>
      

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        <div>
          <p className="text-gray-500 mb-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            {activeArea.fullName} ({activeArea.code})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filteredSigungu.map((sigungu) => {
              const isSelected = selected.areaCode === activeArea.code && selected.sigunguCode === sigungu.code;
              return (
                <button
                  key={`${activeArea.code}-${sigungu.code}`}
                  onClick={() => setSelected({ areaCode: activeArea.code, sigunguCode: sigungu.code })}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                  style={{ fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <span className="truncate">{sigungu.name}</span>
                  {isSelected ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4 text-gray-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {filteredSigungu.length === 0 && (
          <div className="text-center text-gray-400 py-16" style={{ fontSize: '0.85rem' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button
          onClick={handleConfirm}
          disabled={!selectedText}
          className={`w-full py-4 rounded-2xl transition-colors ${
            selectedText ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}
          style={{ fontSize: '1rem', fontWeight: 700 }}
        >
          {selectedText ? `${selectedText} 선택 완료` : '여행지를 선택해주세요'}
        </button>
      </div>
    </div>
  );
}
