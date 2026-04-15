import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { type SavedTrip } from '../store';
import {
  ChevronLeft, Bookmark, MapPin, Calendar, Users, Clock,
  Trash2, Pencil, MoreVertical, ChevronRight, FolderOpen, X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export function SavedTripsScreen() {
  const navigate = useNavigate();
  const { savedTrips, deleteSavedTrip, loadTrip } = useApp();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLoad = (trip: SavedTrip) => {
    loadTrip(trip);
    navigate('/editor');
  };

  const handleDelete = (id: string) => {
    deleteSavedTrip(id);
    setDeleteConfirmId(null);
    setMenuOpenId(null);
    toast.success('여행이 삭제되었습니다');
  };

  const handleEdit = (trip: SavedTrip) => {
    loadTrip(trip);
    setMenuOpenId(null);
    navigate('/editor');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } catch { return dateStr; }
  };

  const getTotalDuration = (trip: SavedTrip) => {
    return trip.schedule.reduce((sum, item) => {
      let t = item.place.duration;
      if (item.segment) t += item.segment.duration;
      return sum + t;
    }, 0);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>저장된 여행</h2>
          <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{savedTrips.length}개의 여행 일정</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Trip list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {savedTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-gray-500" style={{ fontSize: '0.95rem', fontWeight: 600 }}>저장된 여행이 없어요</p>
              <p className="text-gray-400 mt-1" style={{ fontSize: '0.8rem' }}>여행 일정을 만들고 저장해보세요</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
              style={{ fontSize: '0.9rem', fontWeight: 600 }}
            >
              새 여행 만들기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedTrips.map((trip) => {
              const totalMin = getTotalDuration(trip);
              const totalH = Math.floor(totalMin / 60);
              const totalM = totalMin % 60;
              const isMenuOpen = menuOpenId === trip.id;

              return (
                <div key={trip.id} className="relative">
                  <div
                    onClick={() => handleLoad(trip)}
                    className="w-full bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 hover:border-blue-200 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span style={{ fontSize: '1.05rem', fontWeight: 700 }} className="truncate">{trip.destination}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: '0.75rem' }}>
                            <Calendar className="w-3 h-3" />
                            {trip.startDate.replace(/-/g, '.')} ~ {trip.endDate.replace(/-/g, '.')}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: '0.75rem' }}>
                            <Users className="w-3 h-3" />
                            {trip.travelers}명
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : trip.id); }}
                        className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Place preview chips */}
                    <div className="flex items-center gap-1.5 mt-3 overflow-hidden">
                      {trip.schedule.slice(0, 4).map((item, i) => (
                        <React.Fragment key={item.place.id}>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg flex-shrink-0 border border-gray-100">
                            <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0">
                              <img src={item.place.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-gray-600 truncate max-w-[60px]" style={{ fontSize: '0.65rem', fontWeight: 500 }}>{item.place.name}</span>
                          </div>
                          {i < Math.min(trip.schedule.length - 1, 3) && (
                            <span className="text-gray-300 flex-shrink-0" style={{ fontSize: '0.6rem' }}>→</span>
                          )}
                        </React.Fragment>
                      ))}
                      {trip.schedule.length > 4 && (
                        <span className="text-gray-400 flex-shrink-0 bg-white px-2 py-1 rounded-lg border border-gray-100" style={{ fontSize: '0.65rem', fontWeight: 500 }}>
                          +{trip.schedule.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Bottom stats */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200/60">
                      <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {trip.schedule.length}개 장소
                      </span>
                      <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        <Clock className="w-3 h-3 text-blue-500" />
                        {totalH}시간 {totalM}분
                      </span>
                      <span className="text-gray-300 ml-auto" style={{ fontSize: '0.65rem' }}>
                        {new Date(trip.updatedAt).toLocaleDateString('ko-KR')} 수정
                      </span>
                    </div>
                  </div>

                  {/* Context menu dropdown */}
                  {isMenuOpen && (
                    <div className="absolute top-12 right-4 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 min-w-[140px]">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(trip); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-left"
                        style={{ fontSize: '0.85rem', fontWeight: 500 }}
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                        수정하기
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(trip.id); setMenuOpenId(null); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-left text-red-500"
                        style={{ fontSize: '0.85rem', fontWeight: 500 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation overlay */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-[340px]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDeleteConfirmId(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center" style={{ fontSize: '1.05rem', fontWeight: 700 }}>여행을 삭제할까요?</h3>
            <p className="text-gray-400 text-center mt-1" style={{ fontSize: '0.8rem' }}>삭제된 여행은 복구할 수 없습니다</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600"
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white"
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close menu on backdrop click */}
      {menuOpenId && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
      )}
    </div>
  );
}