import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TransportMode = 'walk' | 'transit' | 'taxi' | 'car' | 'bike';

export interface Place {
  id: string;
  name: string;
  category: string;
  stayMinutes: number;
  image: string;
  rating: number;
  isIndoor: boolean;
  lat?: number;
  lng?: number;
}

export interface Segment {
  fromId: string;
  toId: string;
  transport: TransportMode;
  durationMinutes: number;
  distance: string;
}

export interface TripInfo {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  styles: string[];
  planMode: 'ai' | 'manual' | 'hybrid';
}

export interface WeatherInfo {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rain';
  icon: string;
}

const TRANSPORT_SPEEDS: Record<TransportMode, { label: string; icon: string; speedFactor: number }> = {
  walk: { label: '도보', icon: '🚶', speedFactor: 1 },
  transit: { label: '대중교통', icon: '🚇', speedFactor: 0.4 },
  taxi: { label: '택시', icon: '🚕', speedFactor: 0.3 },
  car: { label: '자차', icon: '🚗', speedFactor: 0.35 },
  bike: { label: '자전거', icon: '🚲', speedFactor: 0.6 },
};

export const getTransportInfo = (mode: TransportMode) => TRANSPORT_SPEEDS[mode];

const defaultPlaces: Place[] = [
  { id: '1', name: '경복궁', category: '역사/문화', stayMinutes: 90, image: 'https://images.unsplash.com/photo-1625551922738-3fb390d041dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHeWVvbmdib2tndW5nJTIwcGFsYWNlJTIwU2VvdWwlMjBLb3JlYXxlbnwxfHx8fDE3NzYxNTY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.7, isIndoor: false },
  { id: '2', name: '북촌한옥마을', category: '역사/문화', stayMinutes: 60, image: 'https://images.unsplash.com/photo-1597052142820-3be3987c0e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdWtjaG9uJTIwSGFub2slMjBWaWxsYWdlJTIwU2VvdWx8ZW58MXx8fHwxNzc2MTU2OTAzfDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.5, isIndoor: false },
  { id: '3', name: '인사동 쌈지길', category: '쇼핑/문화', stayMinutes: 45, image: 'https://images.unsplash.com/photo-1622517806875-92161d3fd09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbnNhZG9uZyUyMHN0cmVldCUyMFNlb3VsJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzc2MTU2OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.3, isIndoor: true },
  { id: '4', name: 'N서울타워', category: '관광/전망', stayMinutes: 60, image: 'https://images.unsplash.com/photo-1645451350581-2aebd3932286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOYW1zYW4lMjBUb3dlciUyMFNlb3VsJTIwbmlnaHR8ZW58MXx8fHwxNzc2MDQyODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.6, isIndoor: true },
  { id: '5', name: '홍대 걷고싶은거리', category: '쇼핑/엔터', stayMinutes: 75, image: 'https://images.unsplash.com/photo-1748696009709-ffd507a4ef61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25nZGFlJTIwc3RyZWV0JTIwU2VvdWwlMjBuaWdodGxpZmV8ZW58MXx8fHwxNzc2MTU2OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.4, isIndoor: false },
  { id: '6', name: '명동', category: '쇼핑/맛집', stayMinutes: 60, image: 'https://images.unsplash.com/photo-1748696147482-413d1e29ed8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNeWVvbmdkb25nJTIwc2hvcHBpbmclMjBTZW91bHxlbnwxfHx8fDE3NzYxNTY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 4.2, isIndoor: false },
];

const defaultSegments: Segment[] = [
  { fromId: '1', toId: '2', transport: 'walk', durationMinutes: 15, distance: '1.2km' },
  { fromId: '2', toId: '3', transport: 'walk', durationMinutes: 10, distance: '0.8km' },
  { fromId: '3', toId: '4', transport: 'transit', durationMinutes: 25, distance: '4.5km' },
  { fromId: '4', toId: '5', transport: 'taxi', durationMinutes: 20, distance: '8.2km' },
  { fromId: '5', toId: '6', transport: 'transit', durationMinutes: 15, distance: '5.1km' },
];

interface TripContextType {
  tripInfo: TripInfo;
  setTripInfo: (info: TripInfo) => void;
  places: Place[];
  setPlaces: (p: Place[]) => void;
  segments: Segment[];
  setSegments: (s: Segment[]) => void;
  weather: WeatherInfo;
  updateStayTime: (placeId: string, minutes: number) => void;
  updateTransport: (fromId: string, toId: string, mode: TransportMode) => void;
  removePlace: (placeId: string) => void;
  reorderPlaces: (fromIndex: number, toIndex: number) => void;
  getTimeline: () => { place: Place; startTime: string; segment?: Segment }[];
  totalDuration: number;
  isRecalculating: boolean;
  historyStack: { places: Place[]; segments: Segment[] }[];
  undo: () => void;
}

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripInfo, setTripInfo] = useState<TripInfo>({
    destination: '서울',
    startDate: '2026-04-18',
    endDate: '2026-04-18',
    travelers: 2,
    styles: [],
    planMode: 'ai',
  });
  const [places, setPlacesState] = useState<Place[]>(defaultPlaces);
  const [segments, setSegmentsState] = useState<Segment[]>(defaultSegments);
  const [weather] = useState<WeatherInfo>({ temp: 18, condition: 'cloudy', icon: '⛅' });
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [historyStack, setHistoryStack] = useState<{ places: Place[]; segments: Segment[] }[]>([]);

  const pushHistory = useCallback(() => {
    setHistoryStack(prev => [...prev.slice(-9), { places: [...places], segments: [...segments] }]);
  }, [places, segments]);

  const triggerRecalc = useCallback(() => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 800);
  }, []);

  const setPlaces = useCallback((p: Place[]) => {
    pushHistory();
    setPlacesState(p);
    triggerRecalc();
  }, [pushHistory, triggerRecalc]);

  const setSegments = useCallback((s: Segment[]) => {
    pushHistory();
    setSegmentsState(s);
    triggerRecalc();
  }, [pushHistory, triggerRecalc]);

  const updateStayTime = useCallback((placeId: string, minutes: number) => {
    pushHistory();
    setPlacesState(prev => prev.map(p => p.id === placeId ? { ...p, stayMinutes: minutes } : p));
    triggerRecalc();
  }, [pushHistory, triggerRecalc]);

  const updateTransport = useCallback((fromId: string, toId: string, mode: TransportMode) => {
    pushHistory();
    setSegmentsState(prev => prev.map(s => {
      if (s.fromId === fromId && s.toId === toId) {
        const baseDuration = s.durationMinutes / getTransportInfo(s.transport).speedFactor;
        const newDuration = Math.round(baseDuration * getTransportInfo(mode).speedFactor);
        return { ...s, transport: mode, durationMinutes: newDuration };
      }
      return s;
    }));
    triggerRecalc();
  }, [pushHistory, triggerRecalc]);

  const removePlace = useCallback((placeId: string) => {
    pushHistory();
    const idx = places.findIndex(p => p.id === placeId);
    const newPlaces = places.filter(p => p.id !== placeId);
    const newSegments = segments.filter(s => s.fromId !== placeId && s.toId !== placeId);
    if (idx > 0 && idx < places.length - 1) {
      const prev = places[idx - 1];
      const next = places[idx + 1];
      newSegments.push({ fromId: prev.id, toId: next.id, transport: 'transit', durationMinutes: 15, distance: '~3km' });
    }
    setPlacesState(newPlaces);
    setSegmentsState(newSegments);
    triggerRecalc();
  }, [places, segments, pushHistory, triggerRecalc]);

  const reorderPlaces = useCallback((fromIndex: number, toIndex: number) => {
    pushHistory();
    const newPlaces = [...places];
    const [moved] = newPlaces.splice(fromIndex, 1);
    newPlaces.splice(toIndex, 0, moved);
    const newSegments: Segment[] = [];
    for (let i = 0; i < newPlaces.length - 1; i++) {
      const existing = segments.find(s => s.fromId === newPlaces[i].id && s.toId === newPlaces[i + 1].id);
      newSegments.push(existing || { fromId: newPlaces[i].id, toId: newPlaces[i + 1].id, transport: 'transit', durationMinutes: 15, distance: '~3km' });
    }
    setPlacesState(newPlaces);
    setSegmentsState(newSegments);
    triggerRecalc();
  }, [places, segments, pushHistory, triggerRecalc]);

  const getTimeline = useCallback(() => {
    let currentMinutes = 9 * 60; // start 09:00
    return places.map((place, i) => {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const segment = segments.find(s => s.fromId === place.id);
      currentMinutes += place.stayMinutes + (segment?.durationMinutes || 0);
      return { place, startTime, segment: i < places.length - 1 ? segment : undefined };
    });
  }, [places, segments]);

  const totalDuration = places.reduce((acc, p) => acc + p.stayMinutes, 0) + segments.reduce((acc, s) => acc + s.durationMinutes, 0);

  const undo = useCallback(() => {
    if (historyStack.length === 0) return;
    const last = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));
    setPlacesState(last.places);
    setSegmentsState(last.segments);
  }, [historyStack]);

  return (
    <TripContext.Provider value={{ tripInfo, setTripInfo, places, setPlaces, segments, setSegments, weather, updateStayTime, updateTransport, removePlace, reorderPlaces, getTimeline, totalDuration, isRecalculating, historyStack, undo }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be inside TripProvider');
  return ctx;
}
