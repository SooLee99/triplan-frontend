import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, FolderOpen, ChevronRight } from 'lucide-react';

export function TravelHistoryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors active:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>여행 기록</h2>
          <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>완료한 지난 여행의 추억</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col items-center justify-center py-20 gap-4 h-full">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-gray-500" style={{ fontSize: '0.95rem', fontWeight: 600 }}>아직 완료된 여행이 없어요</p>
            <p className="text-gray-400 mt-1" style={{ fontSize: '0.8rem' }}>새로운 여행을 떠나볼까요?</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            여행 계획하기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
