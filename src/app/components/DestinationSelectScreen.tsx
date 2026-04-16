import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Search, Check } from 'lucide-react';
import { useApp } from '../context';

type Region = {
  key: string;
  label: string;
  places: string[];
};

const REGIONS: Region[] = [
  { key: 'domestic', label: '국내 지역', places: ['서울', '부산', '제주', '강릉', '경주', '전주', '여수', '속초'] },
  { key: 'sea', label: '동남아/서남아', places: ['방콕', '다낭', '싱가포르', '발리', '세부', '푸켓', '쿠알라룸푸르', '뉴델리'] },
  { key: 'europe', label: '유럽/발칸', places: ['파리', '로마', '런던', '바르셀로나', '프라하', '부다페스트', '두브로브니크', '비엔나'] },
  { key: 'china', label: '중국', places: ['상하이', '베이징', '광저우', '선전', '청두', '시안', '항저우', '충칭'] },
  { key: 'japan', label: '일본', places: ['도쿄', '오사카', '교토', '후쿠오카', '삿포로', '오키나와', '나고야', '히로시마'] },
  { key: 'northAmerica', label: '북미/하와이', places: ['뉴욕', '로스앤젤레스', '샌프란시스코', '라스베이거스', '밴쿠버', '토론토', '호놀룰루', '시애틀'] },
  { key: 'southPacific', label: '남태평양', places: ['시드니', '멜버른', '오클랜드', '피지', '괌', '사이판', '브리즈번', '퍼스'] },
  { key: 'twHkMo', label: '대만/홍콩/마카오', places: ['타이베이', '가오슝', '타이중', '홍콩', '마카오', '타이난', '지룽', '신주'] },
  { key: 'centralAsia', label: '중앙아시아', places: ['알마티', '아스타나', '타슈켄트', '사마르칸트', '비슈케크', '두샨베'] },
  { key: 'middleEastAfrica', label: '중동/아프리카', places: ['두바이', '아부다비', '도하', '카이로', '케이프타운', '요하네스버그', '마라케시', '이스탄불'] },
  { key: 'latinAmerica', label: '중남미', places: ['칸쿤', '멕시코시티', '리우데자네이루', '상파울루', '부에노스아이레스', '리마', '산티아고', '아바나'] },
];

export function DestinationSelectScreen() {
  const navigate = useNavigate();
  const { tripInfo, setTripInfo } = useApp();
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>(REGIONS[0].key);
  const [selected, setSelected] = useState(tripInfo.destination);

  const filteredRegions = useMemo(() => {
    if (!query.trim()) {
      return REGIONS.filter((region) => region.key === activeRegion);
    }

    const normalizedQuery = query.trim().toLowerCase();

    return REGIONS.map((region) => ({
      ...region,
      places: region.places.filter((place) => place.toLowerCase().includes(normalizedQuery)),
    })).filter((region) => region.places.length > 0);
  }, [query, activeRegion]);

  const handleConfirm = () => {
    if (!selected) return;
    setTripInfo({ ...tripInfo, destination: selected });
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
          {REGIONS.map((region) => {
            const isActive = activeRegion === region.key;
            return (
              <button
                key={region.key}
                onClick={() => {
                  setActiveRegion(region.key);
                  setQuery('');
                }}
                className={`px-3 py-2 rounded-full border transition-colors ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                {region.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {filteredRegions.length > 0 ? (
          filteredRegions.map((region) => (
            <div key={region.key}>
              <p className="text-gray-500 mb-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{region.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {region.places.map((place) => {
                  const isSelected = selected === place;
                  return (
                    <button
                      key={`${region.key}-${place}`}
                      onClick={() => setSelected(place)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                      style={{ fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      <span className="truncate">{place}</span>
                      {isSelected ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4 text-gray-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-16" style={{ fontSize: '0.85rem' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl transition-colors ${
            selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}
          style={{ fontSize: '1rem', fontWeight: 700 }}
        >
          {selected ? `${selected} 선택 완료` : '여행지를 선택해주세요'}
        </button>
      </div>
    </div>
  );
}
