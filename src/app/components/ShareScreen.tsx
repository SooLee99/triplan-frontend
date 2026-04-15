import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { TRANSPORT_OPTIONS } from '../store';
import { ChevronLeft, Copy, MessageCircle, Share2, Download, Clock, MapPin } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export function ShareScreen() {
  const navigate = useNavigate();
  const { tripInfo, schedule } = useApp();

  const totalDuration = schedule.reduce((sum, item) => {
    let t = item.place.duration;
    if (item.segment) t += item.segment.duration;
    return sum + t;
  }, 0);

  const copyToClipboard = () => {
    const text = schedule.map((item, i) => {
      let line = `${i + 1}. ${item.startTime} ${item.place.name} (${item.place.duration}분)`;
      if (item.segment) {
        const mode = TRANSPORT_OPTIONS.find(t => t.mode === item.segment!.mode);
        line += `\n   → ${mode?.label} ${item.segment.duration}분`;
      }
      return line;
    }).join('\n');
    navigator.clipboard.writeText(`📍 ${tripInfo.destination} 여행 일정\n${tripInfo.startDate}\n\n${text}`);
    toast.success('일정이 클립보드에 복사되었습니다');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Toaster position="top-center" />
      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>일정 공유</h2>
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-6">
        {/* Summary card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4" />
            <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.8 }}>여행 일정 요약</span>
          </div>
          <h3 className="text-white mt-1" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{tripInfo.destination}</h3>
          <div className="flex items-center gap-3 mt-2" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            <span>{tripInfo.startDate.replace(/-/g, '.')} ~ {tripInfo.endDate.replace(/-/g, '.')}</span>
            <span>|</span>
            <span>{tripInfo.travelers}명</span>
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-white/20">
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{schedule.length}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>장소</div>
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>총 소요시간</div>
            </div>
          </div>
        </div>

        {/* Timeline summary */}
        <div className="space-y-0">
          {schedule.map((item, idx) => (
            <React.Fragment key={item.place.id}>
              <div className="flex items-start gap-3 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                  {idx < schedule.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.startTime}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.place.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-gray-400" style={{ fontSize: '0.75rem' }}>
                    <Clock className="w-3 h-3" />
                    <span>{item.place.duration}분 체류</span>
                    <span>·</span>
                    <span>{item.place.category}</span>
                  </div>
                </div>
              </div>
              {item.segment && idx < schedule.length - 1 && (
                <div className="ml-11 text-gray-400 flex items-center gap-1 pb-1" style={{ fontSize: '0.7rem' }}>
                  <span>{TRANSPORT_OPTIONS.find(t => t.mode === item.segment!.mode)?.icon}</span>
                  <span>{TRANSPORT_OPTIONS.find(t => t.mode === item.segment!.mode)?.label} {item.segment.duration}분</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Share actions */}
      <div className="p-6 pb-10 border-t border-gray-100 space-y-3">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <button onClick={copyToClipboard} className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl">
            <Copy className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600" style={{ fontSize: '0.7rem', fontWeight: 500 }}>복사</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600" style={{ fontSize: '0.7rem', fontWeight: 500 }}>카카오톡</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl">
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600" style={{ fontSize: '0.7rem', fontWeight: 500 }}>이미지 저장</span>
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white"
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
