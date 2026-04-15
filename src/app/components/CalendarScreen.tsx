import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { DayPicker } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Navigation } from 'lucide-react';
import { type SavedTrip } from '../store';

export function CalendarScreen() {
  const navigate = useNavigate();
  const { savedTrips, loadTrip } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Find trips that intersect with the selected date
  const tripsOnSelectedDate = savedTrips.filter(trip => {
    try {
      const start = startOfDay(parseISO(trip.startDate));
      const end = startOfDay(parseISO(trip.endDate));
      const current = startOfDay(selectedDate);
      return isWithinInterval(current, { start, end });
    } catch {
      return false;
    }
  });

  const handleTripClick = (trip: SavedTrip) => {
    loadTrip(trip);
    navigate('/editor');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <div className="flex-1">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>여행 달력</h2>
          <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>저장된 모든 여행 일정을 확인하세요</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Calendar Area */}
      <div className="px-4 py-2 flex justify-center">
        <div className="bg-gray-50 rounded-3xl p-4 w-full max-w-sm shadow-sm border border-gray-100 flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            locale={ko}
            showOutsideDays
            components={{
              IconLeft: () => <ChevronLeft className="w-5 h-5" />,
              IconRight: () => <ChevronRight className="w-5 h-5" />
            }}
            modifiers={{
              hasTrip: (date) => {
                return savedTrips.some(trip => {
                  try {
                    const start = startOfDay(parseISO(trip.startDate));
                    const end = startOfDay(parseISO(trip.endDate));
                    const current = startOfDay(date);
                    return isWithinInterval(current, { start, end });
                  } catch {
                    return false;
                  }
                });
              }
            }}
            modifiersStyles={{
              hasTrip: {
                fontWeight: 'bold',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
              }
            }}
            styles={{
              caption: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' },
              caption_label: { fontSize: '1.1rem', fontWeight: 'bold' },
              nav: { display: 'flex', gap: '0.5rem' },
              nav_button: { width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' },
              head_row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
              head_cell: { flex: 1, textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' },
              row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
              cell: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
              day: { width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' },
              day_selected: { backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold' },
              day_today: { color: '#2563eb', fontWeight: 'bold' },
              day_outside: { color: '#d1d5db' }
            }}
          />
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-white mt-2 rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <h3 className="mb-4 text-gray-800" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          {format(selectedDate, 'M월 d일 (E)', { locale: ko })}
        </h3>

        {tripsOnSelectedDate.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-70">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>예정된 일정이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tripsOnSelectedDate.map(trip => (
              <button
                key={trip.id}
                onClick={() => handleTripClick(trip)}
                className="w-full text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-4 hover:border-blue-300 transition-colors active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 truncate" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {trip.destination} 여행
                  </h4>
                  <p className="text-gray-500 mt-1 flex items-center gap-1" style={{ fontSize: '0.8rem' }}>
                    <Navigation className="w-3 h-3" />
                    {trip.schedule?.length || 0}개 장소 방문
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
