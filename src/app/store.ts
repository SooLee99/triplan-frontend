// Central data store for the travel planner app
export interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  duration: number; // minutes
  isIndoor: boolean;
  rating: number;
  address: string;
  lat: number;
  lng: number;
}

export type TransportMode =
  | "walk"
  | "transit"
  | "taxi"
  | "car"
  | "bike";

export interface Segment {
  mode: TransportMode;
  duration: number; // minutes
}

export interface ScheduleItem {
  place: Place;
  startTime: string; // HH:mm
  segment?: Segment; // transport to NEXT place
}

export interface DayPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface DaySchedule {
  day: number; // 1-indexed
  date: string; // YYYY-MM-DD
  departure: DayPoint;
  arrival: DayPoint;
  departureSegment?: Segment; // transport from departure → first place
  arrivalSegment?: Segment; // transport from last place → arrival
  items: ScheduleItem[];
  startHour: number;
  startMinute: number;
}

export interface SavedTrip {
  id: string;
  destination: string;
  destinationAreaCode?: number;
  destinationSigunguCode?: number;
  startDate: string;
  endDate: string;
  travelers: number;
  styles: string[];
  schedule: ScheduleItem[]; // legacy compat
  daySchedules: DaySchedule[];
  createdAt: string;
  updatedAt: string;
}

// Preset locations (Tokyo-centric defaults)
export const POINT_PRESETS: {
  label: string;
  emoji: string;
  value: string;
  lat: number;
  lng: number;
}[] = [
  {
    label: "호텔/숙소 (신주쿠)",
    emoji: "🏨",
    value: "호텔/숙소 (신주쿠)",
    lat: 35.6938,
    lng: 139.7034,
  },
  {
    label: "나리타 공항",
    emoji: "✈️",
    value: "나리타 공항",
    lat: 35.772,
    lng: 140.3929,
  },
  {
    label: "하네다 공항",
    emoji: "✈️",
    value: "하네다 공항",
    lat: 35.5494,
    lng: 139.7798,
  },
  {
    label: "도쿄역",
    emoji: "🚉",
    value: "도쿄역",
    lat: 35.6812,
    lng: 139.7671,
  },
  {
    label: "시부야역",
    emoji: "🚉",
    value: "시부야역",
    lat: 35.658,
    lng: 139.7016,
  },
  {
    label: "신주쿠역",
    emoji: "🚉",
    value: "신주쿠역",
    lat: 35.6896,
    lng: 139.7006,
  },
];

export const TRANSPORT_OPTIONS: {
  mode: TransportMode;
  label: string;
  icon: string;
  multiplier: number;
}[] = [
  { mode: "walk", label: "도보", icon: "🚶", multiplier: 1 },
  {
    mode: "transit",
    label: "대중교통",
    icon: "🚇",
    multiplier: 0.4,
  },
  { mode: "taxi", label: "택시", icon: "🚕", multiplier: 0.3 },
  { mode: "car", label: "자차", icon: "🚗", multiplier: 0.35 },
  {
    mode: "bike",
    label: "자전거",
    icon: "🚲",
    multiplier: 0.6,
  },
];

export const SAMPLE_PLACES: Place[] = [
  {
    id: "1",
    name: "센소지(아사쿠사)",
    category: "사찰·명소",
    image:
      "https://images.unsplash.com/photo-1705803420366-58334fd4df1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHRlbXBsZSUyMGphcGFuJTIwdHJhdmVsfGVufDF8fHx8MTc3NjE1Njk5N3ww&ixlib=rb-4.1.0&q=80&w=400",
    duration: 90,
    isIndoor: false,
    rating: 4.7,
    address: "도쿄 다이토구 아사쿠사 2-3-1",
    lat: 35.7148,
    lng: 139.7967,
  },
  {
    id: "2",
    name: "시부야 스크램블",
    category: "거리·쇼핑",
    image:
      "https://images.unsplash.com/photo-1609942225969-3f3109a13eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlidXlhJTIwY3Jvc3NpbmclMjB0b2t5byUyMHN0cmVldHxlbnwxfHx8fDE3NzYxNTY5OTd8MA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 60,
    isIndoor: false,
    rating: 4.5,
    address: "도쿄 시부야구 도겐자카 2",
    lat: 35.6595,
    lng: 139.7004,
  },
  {
    id: "3",
    name: "도쿄타워",
    category: "랜드마크",
    image:
      "https://images.unsplash.com/photo-1691929607102-5284d991921f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHRvd2VyJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc3NjE1Njk5OHww&ixlib=rb-4.1.0&q=80&w=400",
    duration: 60,
    isIndoor: true,
    rating: 4.6,
    address: "도쿄 미나토구 시바코엔 4-2-8",
    lat: 35.6586,
    lng: 139.7454,
  },
  {
    id: "4",
    name: "신주쿠교엔",
    category: "자연·공원",
    image:
      "https://images.unsplash.com/photo-1638658952026-7931bbe29bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGdhcmRlbiUyMHBhcmt8ZW58MXx8fHwxNzc2MTU2OTk4fDA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 75,
    isIndoor: false,
    rating: 4.8,
    address: "도쿄 신주쿠구 나이토마치 11",
    lat: 35.6852,
    lng: 139.71,
  },
  {
    id: "5",
    name: "츠키지 시장",
    category: "맛집·시장",
    image:
      "https://images.unsplash.com/photo-1556173302-31961d329ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c3VraWppJTIwZmlzaCUyMG1hcmtldCUyMHRva3lvJTIwZm9vZHxlbnwxfHx8fDE3NzYxNTY5OTh8MA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 90,
    isIndoor: false,
    rating: 4.4,
    address: "도쿄 주오구 츠키지 4-16-2",
    lat: 35.6654,
    lng: 139.7707,
  },
  {
    id: "6",
    name: "아키하바라",
    category: "쇼핑·문화",
    image:
      "https://images.unsplash.com/photo-1662107399413-ccaf9bbb1ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxha2loYWJhcmElMjBuZW9uJTIwbGlnaHRzJTIwdG9reW98ZW58MXx8fHwxNzc2MTU2OTk4fDA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 75,
    isIndoor: false,
    rating: 4.3,
    address: "도쿄 치요다구 소토칸다",
    lat: 35.7023,
    lng: 139.7745,
  },
  {
    id: "7",
    name: "메이지 신궁",
    category: "사찰·명소",
    image:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWlqaSUyMHNocmluZSUyMHRva3lvfGVufDF8fHx8MTc3NjE1Njk5OHww&ixlib=rb-4.1.0&q=80&w=400",
    duration: 60,
    isIndoor: false,
    rating: 4.6,
    address: "도쿄 시부야구 요요기카미조노 1-1",
    lat: 35.6764,
    lng: 139.6993,
  },
  {
    id: "8",
    name: "오다이바",
    category: "테마파크",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG9kYWliYSUyMHJhaW5ib3clMjBicmlkZ2V8ZW58MXx8fHwxNzc2MTU2OTk4fDA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 120,
    isIndoor: false,
    rating: 4.4,
    address: "도쿄 미나토구 다이바",
    lat: 35.6269,
    lng: 139.7753,
  },
  {
    id: "9",
    name: "우에노 공원",
    category: "자연·공원",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1ZW5vJTIwcGFyayUyMHRva3lvfGVufDF8fHx8MTc3NjE1Njk5OHww&ixlib=rb-4.1.0&q=80&w=400",
    duration: 75,
    isIndoor: false,
    rating: 4.5,
    address: "도쿄 다이토구 우에노공원",
    lat: 35.7146,
    lng: 139.7732,
  },
  {
    id: "10",
    name: "롯본기 힐즈",
    category: "쇼핑·문화",
    image:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3Bwb25naSUyMGhpbGxzJTIwdG9reW98ZW58MXx8fHwxNzc2MTU2OTk4fDA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 90,
    isIndoor: true,
    rating: 4.3,
    address: "도쿄 미나토구 롯본기 6-10-1",
    lat: 35.6604,
    lng: 139.7292,
  },
];

export const INDOOR_ALTERNATIVES: Place[] = [
  {
    id: "i1",
    name: "모리 미술관",
    category: "미술관",
    image:
      "https://images.unsplash.com/photo-1761263225198-c2bf51cc4d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG11c2V1bSUyMGFydCUyMGluZG9vcnxlbnwxfHx8fDE3NzYxNTcwMDN8MA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 90,
    isIndoor: true,
    rating: 4.5,
    address: "도쿄 미나토구 롯본기 6-10-1",
    lat: 35.6604,
    lng: 139.7292,
  },
  {
    id: "i2",
    name: "오모테산도 힐즈",
    category: "쇼핑몰",
    image:
      "https://images.unsplash.com/photo-1772160801956-e471dbee631b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHNob3BwaW5nJTIwbWFsbCUyMGluZG9vcnxlbnwxfHx8fDE3NzYxNTcwMDN8MA&ixlib=rb-4.1.0&q=80&w=400",
    duration: 60,
    isIndoor: true,
    rating: 4.2,
    address: "도쿄 시부야구 진구마에 4-12-10",
    lat: 35.6657,
    lng: 139.7093,
  },
  {
    id: "i3",
    name: "도쿄타워",
    category: "랜드마크",
    image:
      "https://images.unsplash.com/photo-1691929607102-5284d991921f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHRvd2VyJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc3NjE1Njk5OHww&ixlib=rb-4.1.0&q=80&w=400",
    duration: 60,
    isIndoor: true,
    rating: 4.6,
    address: "도쿄 미나토구 시바코엔 4-2-8",
    lat: 35.6586,
    lng: 139.7454,
  },
];

// Haversine distance in km
export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Sort places by nearest-neighbor starting from a given lat/lng (departure)
export function sortByProximity(
  places: Place[],
  startLat?: number,
  startLng?: number,
): Place[] {
  if (places.length <= 1) return [...places];
  const sorted: Place[] = [];
  const remaining = [...places];

  // If we have a starting point, use it; otherwise use first place
  let curLat = startLat ?? places[0].lat;
  let curLng = startLng ?? places[0].lng;

  if (startLat === undefined) {
    sorted.push(remaining.shift()!);
    curLat = sorted[0].lat;
    curLng = sorted[0].lng;
  }

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((p, i) => {
      const d = haversine(curLat, curLng, p.lat, p.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });
    const picked = remaining.splice(nearestIdx, 1)[0];
    sorted.push(picked);
    curLat = picked.lat;
    curLng = picked.lng;
  }
  return sorted;
}

// Sort places considering both departure and arrival (optimize path)
export function sortByProximityWithEndpoints(
  places: Place[],
  departure: DayPoint,
  arrival: DayPoint,
): Place[] {
  if (places.length <= 1) return [...places];
  // Nearest neighbor from departure
  return sortByProximity(places, departure.lat, departure.lng);
}

// Estimate walking minutes from distance
export function estimateWalkMinutes(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const km = haversine(fromLat, fromLng, toLat, toLng);
  return Math.max(5, Math.round((km / 4.5) * 60)); // ~4.5 km/h walking speed
}

export function estimateWalkMinutesPlaces(
  from: Place,
  to: Place,
): number {
  return estimateWalkMinutes(
    from.lat,
    from.lng,
    to.lat,
    to.lng,
  );
}

export function getTransportDuration(
  baseWalkMin: number,
  mode: TransportMode,
): number {
  const opt = TRANSPORT_OPTIONS.find((o) => o.mode === mode);
  return Math.max(
    3,
    Math.round(baseWalkMin * (opt?.multiplier ?? 1)),
  );
}

export function recalculateSchedule(
  items: ScheduleItem[],
  startHour: number = 9,
  startMin: number = 0,
): ScheduleItem[] {
  let currentMin = startHour * 60 + startMin;
  return items.map((item) => {
    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    const newItem = {
      ...item,
      startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    };
    currentMin += item.place.duration;
    if (item.segment) {
      currentMin += item.segment.duration;
    }
    return newItem;
  });
}

// Recalculate a full day schedule including departure/arrival segments
export function recalculateDaySchedule(
  day: DaySchedule,
): DaySchedule {
  const items = day.items;
  const startMin = day.startHour * 60 + (day.startMinute || 0);
  let currentMin = startMin;

  // Departure → first place segment
  let departureSegment: Segment | undefined;
  if (items.length > 0) {
    const baseWalk = estimateWalkMinutes(
      day.departure.lat,
      day.departure.lng,
      items[0].place.lat,
      items[0].place.lng,
    );
    const mode = day.departureSegment?.mode || "transit";
    departureSegment = {
      mode,
      duration: getTransportDuration(baseWalk, mode),
    };
    currentMin += departureSegment.duration;
  }

  // Recalculate items
  const newItems = items.map((item, i) => {
    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    const newItem: ScheduleItem = {
      ...item,
      startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    };
    currentMin += item.place.duration;
    if (i < items.length - 1) {
      const nextPlace = items[i + 1].place;
      const baseWalk = estimateWalkMinutes(
        item.place.lat,
        item.place.lng,
        nextPlace.lat,
        nextPlace.lng,
      );
      const mode = item.segment?.mode || "transit";
      newItem.segment = {
        mode,
        duration: getTransportDuration(baseWalk, mode),
      };
      currentMin += newItem.segment.duration;
    } else {
      newItem.segment = undefined;
    }
    return newItem;
  });

  // Last place → arrival segment
  let arrivalSegment: Segment | undefined;
  if (items.length > 0) {
    const lastPlace = items[items.length - 1].place;
    const baseWalk = estimateWalkMinutes(
      lastPlace.lat,
      lastPlace.lng,
      day.arrival.lat,
      day.arrival.lng,
    );
    const mode = day.arrivalSegment?.mode || "transit";
    arrivalSegment = {
      mode,
      duration: getTransportDuration(baseWalk, mode),
    };
  }

  return {
    ...day,
    items: newItems,
    departureSegment,
    arrivalSegment,
  };
}

export function getBaseWalkTime(
  fromId: string,
  toId: string,
): number {
  const allPlaces = [...SAMPLE_PLACES, ...INDOOR_ALTERNATIVES];
  const from = allPlaces.find((p) => p.id === fromId);
  const to = allPlaces.find((p) => p.id === toId);
  if (from && to) return estimateWalkMinutesPlaces(from, to);
  return 25;
}

// Compute number of days between two date strings
export function getDayCount(
  startDate: string,
  endDate: string,
): number {
  const s = new Date(startDate);
  const e = new Date(endDate);
  return Math.max(
    1,
    Math.round(
      (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );
}

// Get date string for a specific day
export function getDayDate(
  startDate: string,
  dayIndex: number,
): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayIndex);
  return d.toISOString().split("T")[0];
}

// LocalStorage helpers for saved trips
const STORAGE_KEY = "triplan_saved_trips";

export function loadSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTripToStorage(trip: SavedTrip): void {
  const trips = loadSavedTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) {
    trips[idx] = {
      ...trip,
      updatedAt: new Date().toISOString(),
    };
  } else {
    trips.unshift(trip);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function deleteTripFromStorage(tripId: string): void {
  const trips = loadSavedTrips().filter((t) => t.id !== tripId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}