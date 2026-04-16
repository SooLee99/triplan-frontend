export interface MapLocationItem {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
}

export const MAP_LOCATION_ITEMS: MapLocationItem[] = [
  { id: 'shinjuku-hotel', name: '호텔/숙소 (신주쿠)', address: '1-1 Nishi-Shinjuku, Tokyo', category: '숙소', lat: 35.6938, lng: 139.7034 },
  { id: 'narita-airport', name: '나리타 국제공항', address: '1-1 Furugome, Narita, Chiba', category: '공항', lat: 35.7720, lng: 140.3929 },
  { id: 'haneda-airport', name: '하네다 공항', address: 'Haneda Airport, Ota City, Tokyo', category: '공항', lat: 35.5494, lng: 139.7798 },
  { id: 'tokyo-station', name: '도쿄역', address: '1 Chome Marunouchi, Chiyoda City, Tokyo', category: '역', lat: 35.6812, lng: 139.7671 },
  { id: 'shibuya-station', name: '시부야역', address: '2 Chome Dogenzaka, Shibuya, Tokyo', category: '역', lat: 35.6580, lng: 139.7016 },
  { id: 'asakusa', name: '아사쿠사', address: '2 Chome Asakusa, Taito City, Tokyo', category: '관광', lat: 35.7148, lng: 139.7967 },
  { id: 'tokyo-skytree', name: '도쿄 스카이트리', address: '1 Chome Oshiage, Sumida City, Tokyo', category: '랜드마크', lat: 35.7101, lng: 139.8107 },
  { id: 'odaiba', name: '오다이바', address: 'Daiba, Minato City, Tokyo', category: '관광', lat: 35.6270, lng: 139.7753 },
  { id: 'tokyo-disneyland', name: '도쿄 디즈니랜드', address: '1-1 Maihama, Urayasu, Chiba', category: '테마파크', lat: 35.6329, lng: 139.8804 },
  { id: 'ueno-station', name: '우에노역', address: '7 Chome Ueno, Taito City, Tokyo', category: '역', lat: 35.7141, lng: 139.7774 },
];
