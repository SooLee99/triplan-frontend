import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  type Place, type ScheduleItem, type TransportMode, type SavedTrip,
  type DaySchedule, type DayPoint, type Segment,
  SAMPLE_PLACES, POINT_PRESETS,
  recalculateDaySchedule, getBaseWalkTime, getTransportDuration,
  sortByProximityWithEndpoints, estimateWalkMinutes, estimateWalkMinutesPlaces,
  getDayCount, getDayDate,
  loadSavedTrips, saveTripToStorage, deleteTripFromStorage
} from './store';

interface TripInfo {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

interface AppState {
  tripInfo: TripInfo;
  setTripInfo: (info: TripInfo) => void;
  styles: string[];
  setStyles: (s: string[]) => void;
  planMode: 'ai' | 'manual' | 'hybrid';
  setPlanMode: (m: 'ai' | 'manual' | 'hybrid') => void;
  selectedPlaces: Place[];
  setSelectedPlaces: (p: Place[]) => void;
  togglePlace: (p: Place) => void;
  // Multi-day
  daySchedules: DaySchedule[];
  setDaySchedules: (ds: DaySchedule[]) => void;
  currentDay: number; // 0-indexed
  setCurrentDay: (d: number) => void;
  dayCount: number;
  // Per-day departure/arrival
  updateDayDeparture: (dayIdx: number, point: DayPoint) => void;
  updateDayArrival: (dayIdx: number, point: DayPoint) => void;
  initDaySchedules: () => void;
  // Build schedule for current day
  buildScheduleForDay: (dayIdx: number, places: Place[]) => void;
  buildAllSchedules: () => void;
  // Edit operations (work on currentDay)
  updateDuration: (placeId: string, newDuration: number) => void;
  updateTransport: (index: number, mode: TransportMode) => void;
  updateDepartureTransport: (mode: TransportMode) => void;
  updateArrivalTransport: (mode: TransportMode) => void;
  movePlace: (fromIdx: number, toIdx: number) => void;
  removePlace: (placeId: string) => void;
  addPlace: (place: Place) => void;
  replacePlace: (oldId: string, newPlace: Place) => void;
  recalcStatus: 'idle' | 'calculating' | 'done';
  undoSchedule: () => void;
  canUndo: boolean;
  // Legacy compat
  schedule: ScheduleItem[];
  // Saved trips
  savedTrips: SavedTrip[];
  refreshSavedTrips: () => void;
  saveCurrentTrip: (existingId?: string) => string;
  deleteSavedTrip: (id: string) => void;
  loadTrip: (trip: SavedTrip) => void;
  currentTripId: string | null;
}

const AppContext = createContext<AppState | null>(null);

const DEFAULT_DEPARTURE: DayPoint = { name: '호텔/숙소 (신주쿠)', lat: 35.6938, lng: 139.7034 };
const DEFAULT_ARRIVAL: DayPoint = { name: '호텔/숙소 (신주쿠)', lat: 35.6938, lng: 139.7034 };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tripInfo, setTripInfo] = useState<TripInfo>({
    destination: '도쿄',
    startDate: '2026-05-01',
    endDate: '2026-05-03',
    travelers: 2,
  });
  const [styles, setStyles] = useState<string[]>([]);
  const [planMode, setPlanMode] = useState<'ai' | 'manual' | 'hybrid'>('ai');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [daySchedules, setDaySchedulesRaw] = useState<DaySchedule[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [recalcStatus, setRecalcStatus] = useState<'idle' | 'calculating' | 'done'>('idle');
  const historyRef = useRef<DaySchedule[][]>([]);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => loadSavedTrips());
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  const dayCount = getDayCount(tripInfo.startDate, tripInfo.endDate);

  const refreshSavedTrips = useCallback(() => {
    setSavedTrips(loadSavedTrips());
  }, []);

  const pushHistory = useCallback((ds: DaySchedule[]) => {
    historyRef.current.push(JSON.parse(JSON.stringify(ds)));
    if (historyRef.current.length > 20) historyRef.current.shift();
  }, []);

  const setDaySchedules = useCallback((ds: DaySchedule[]) => {
    setDaySchedulesRaw(ds);
  }, []);

  const animateRecalc = useCallback((newDs: DaySchedule[]) => {
    setRecalcStatus('calculating');
    setTimeout(() => {
      setDaySchedulesRaw(newDs);
      setRecalcStatus('done');
      setTimeout(() => setRecalcStatus('idle'), 1500);
    }, 600);
  }, []);

  const togglePlace = useCallback((p: Place) => {
    setSelectedPlaces(prev =>
      prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]
    );
  }, []);

  // Initialize day schedules with default departure/arrival
  const initDaySchedules = useCallback(() => {
    const count = getDayCount(tripInfo.startDate, tripInfo.endDate);
    const days: DaySchedule[] = [];
    for (let i = 0; i < count; i++) {
      // Keep existing day data if available
      const existing = daySchedules[i];
      days.push({
        day: i + 1,
        date: getDayDate(tripInfo.startDate, i),
        departure: existing?.departure || { ...DEFAULT_DEPARTURE },
        arrival: existing?.arrival || { ...DEFAULT_ARRIVAL },
        departureSegment: existing?.departureSegment,
        arrivalSegment: existing?.arrivalSegment,
        items: existing?.items || [],
        startHour: existing?.startHour || 9,
      });
    }
    setDaySchedulesRaw(days);
  }, [tripInfo.startDate, tripInfo.endDate, daySchedules]);

  const updateDayDeparture = useCallback((dayIdx: number, point: DayPoint) => {
    setDaySchedulesRaw(prev => {
      const updated = [...prev];
      if (updated[dayIdx]) {
        updated[dayIdx] = { ...updated[dayIdx], departure: point };
        // Recalculate if items exist
        if (updated[dayIdx].items.length > 0) {
          updated[dayIdx] = recalculateDaySchedule(updated[dayIdx]);
        }
      }
      return updated;
    });
  }, []);

  const updateDayArrival = useCallback((dayIdx: number, point: DayPoint) => {
    setDaySchedulesRaw(prev => {
      const updated = [...prev];
      if (updated[dayIdx]) {
        updated[dayIdx] = { ...updated[dayIdx], arrival: point };
        if (updated[dayIdx].items.length > 0) {
          updated[dayIdx] = recalculateDaySchedule(updated[dayIdx]);
        }
      }
      return updated;
    });
  }, []);

  // Build schedule for a specific day from selected places
  const buildScheduleForDay = useCallback((dayIdx: number, places: Place[]) => {
    setDaySchedulesRaw(prev => {
      const updated = [...prev];
      if (!updated[dayIdx]) return prev;
      const dep = updated[dayIdx].departure;
      const arr = updated[dayIdx].arrival;
      const sorted = sortByProximityWithEndpoints(places, dep, arr);
      const items: ScheduleItem[] = sorted.map((place) => ({
        place,
        startTime: '09:00',
      }));
      updated[dayIdx] = recalculateDaySchedule({
        ...updated[dayIdx],
        items,
      });
      return updated;
    });
    historyRef.current = [];
  }, []);

  // Build all day schedules from selected places (distribute evenly)
  const buildAllSchedules = useCallback(() => {
    setDaySchedulesRaw(prev => {
      const count = prev.length || getDayCount(tripInfo.startDate, tripInfo.endDate);
      const updated = [...prev];
      // Distribute places across days
      const placesPerDay = Math.ceil(selectedPlaces.length / count);
      const allPlaces = [...selectedPlaces];
      
      for (let i = 0; i < count; i++) {
        if (!updated[i]) continue;
        const dayPlaces = allPlaces.splice(0, placesPerDay);
        const dep = updated[i].departure;
        const arr = updated[i].arrival;
        const sorted = sortByProximityWithEndpoints(dayPlaces, dep, arr);
        const items: ScheduleItem[] = sorted.map((place) => ({
          place,
          startTime: '09:00',
        }));
        updated[i] = recalculateDaySchedule({
          ...updated[i],
          items,
        });
      }
      return updated;
    });
    historyRef.current = [];
    setCurrentTripId(null);
  }, [selectedPlaces, tripInfo]);

  // Edit operations work on currentDay
  const getCurrentDaySchedule = () => daySchedules[currentDay];

  const updateCurrentDay = useCallback((updater: (day: DaySchedule) => DaySchedule) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      if (updated[currentDay]) {
        updated[currentDay] = recalculateDaySchedule(updater(updated[currentDay]));
      }
      return updated;
    });
  }, [currentDay, pushHistory]);

  const updateDuration = useCallback((placeId: string, newDuration: number) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const newItems = day.items.map(item =>
        item.place.id === placeId ? { ...item, place: { ...item.place, duration: newDuration } } : item
      );
      updated[currentDay] = recalculateDaySchedule({ ...day, items: newItems });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const updateTransport = useCallback((index: number, mode: TransportMode) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const newItems = day.items.map((item, i) => {
        if (i === index && i < day.items.length - 1) {
          return { ...item, segment: { ...item.segment!, mode, duration: item.segment?.duration || 10 } };
        }
        return item;
      });
      updated[currentDay] = recalculateDaySchedule({ ...day, items: newItems });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const updateDepartureTransport = useCallback((mode: TransportMode) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      updated[currentDay] = recalculateDaySchedule({
        ...day,
        departureSegment: { mode, duration: day.departureSegment?.duration || 10 },
      });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const updateArrivalTransport = useCallback((mode: TransportMode) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      updated[currentDay] = recalculateDaySchedule({
        ...day,
        arrivalSegment: { mode, duration: day.arrivalSegment?.duration || 10 },
      });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const movePlace = useCallback((fromIdx: number, toIdx: number) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const arr = [...day.items];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      updated[currentDay] = recalculateDaySchedule({ ...day, items: arr });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const removePlace = useCallback((placeId: string) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const filtered = day.items.filter(item => item.place.id !== placeId);
      updated[currentDay] = recalculateDaySchedule({ ...day, items: filtered });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const addPlace = useCallback((place: Place) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const newItems = [...day.items, { place, startTime: '00:00' }];
      updated[currentDay] = recalculateDaySchedule({ ...day, items: newItems });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const replacePlace = useCallback((oldId: string, newPlace: Place) => {
    setDaySchedulesRaw(prev => {
      pushHistory(prev);
      const updated = [...prev];
      const day = updated[currentDay];
      if (!day) return prev;
      const newItems = day.items.map(item => item.place.id === oldId ? { ...item, place: newPlace } : item);
      updated[currentDay] = recalculateDaySchedule({ ...day, items: newItems });
      animateRecalc(updated);
      return prev;
    });
  }, [currentDay, pushHistory, animateRecalc]);

  const undoSchedule = useCallback(() => {
    if (historyRef.current.length > 0) {
      const prev = historyRef.current.pop()!;
      setDaySchedulesRaw(prev);
    }
  }, []);

  // Legacy compat: current day's items
  const schedule = daySchedules[currentDay]?.items || [];

  // Save current trip
  const saveCurrentTrip = useCallback((existingId?: string) => {
    const id = existingId || currentTripId || `trip_${Date.now()}`;
    const now = new Date().toISOString();
    const allItems = daySchedules.flatMap(d => d.items);
    const trip: SavedTrip = {
      id,
      destination: tripInfo.destination,
      startDate: tripInfo.startDate,
      endDate: tripInfo.endDate,
      travelers: tripInfo.travelers,
      styles,
      schedule: allItems,
      daySchedules,
      createdAt: now,
      updatedAt: now,
    };
    saveTripToStorage(trip);
    setCurrentTripId(id);
    setSavedTrips(loadSavedTrips());
    return id;
  }, [tripInfo, styles, daySchedules, currentTripId]);

  const deleteSavedTrip = useCallback((id: string) => {
    deleteTripFromStorage(id);
    setSavedTrips(loadSavedTrips());
    if (currentTripId === id) setCurrentTripId(null);
  }, [currentTripId]);

  const loadTrip = useCallback((trip: SavedTrip) => {
    setTripInfo({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      travelers: trip.travelers,
    });
    setStyles(trip.styles);
    if (trip.daySchedules && trip.daySchedules.length > 0) {
      setDaySchedulesRaw(trip.daySchedules);
    } else {
      // Legacy: single schedule → put in day 1
      setDaySchedulesRaw([{
        day: 1,
        date: trip.startDate,
        departure: { ...DEFAULT_DEPARTURE },
        arrival: { ...DEFAULT_ARRIVAL },
        items: trip.schedule,
        startHour: 9,
      }]);
    }
    setSelectedPlaces(trip.schedule.map(s => s.place));
    setCurrentTripId(trip.id);
    setCurrentDay(0);
    historyRef.current = [];
  }, []);

  return (
    <AppContext.Provider value={{
      tripInfo, setTripInfo, styles, setStyles, planMode, setPlanMode,
      selectedPlaces, setSelectedPlaces, togglePlace,
      daySchedules, setDaySchedules, currentDay, setCurrentDay, dayCount,
      updateDayDeparture, updateDayArrival, initDaySchedules,
      buildScheduleForDay, buildAllSchedules,
      updateDuration, updateTransport, updateDepartureTransport, updateArrivalTransport,
      movePlace, removePlace, addPlace, replacePlace,
      recalcStatus, undoSchedule, canUndo: historyRef.current.length > 0,
      schedule,
      savedTrips, refreshSavedTrips, saveCurrentTrip, deleteSavedTrip, loadTrip, currentTripId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
