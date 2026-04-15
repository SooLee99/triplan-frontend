import React from 'react';
import { useNavigate } from 'react-router';
import { Settings, ChevronRight, Map, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MyPageScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4 bg-white z-10 sticky top-0 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">마이페이지</h1>
        <button className="p-2 -mr-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-50">
          <Settings size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-white px-6 py-8 shadow-sm">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-md">
              <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">여행자님</h2>
              <p className="text-sm text-slate-500 font-medium">카카오 계정으로 로그인됨</p>
            </div>
            <button className="ml-auto text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
              프로필 수정
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex-1 text-center border-r border-slate-200 last:border-0" onClick={() => navigate('/saved')}>
              <p className="text-2xl font-bold text-slate-900 mb-1">3</p>
              <p className="text-xs text-slate-500 font-medium">저장된 여행</p>
            </div>
            <div className="flex-1 text-center border-r border-slate-200 last:border-0" onClick={() => navigate('/history')}>
              <p className="text-2xl font-bold text-slate-900 mb-1">12</p>
              <p className="text-xs text-slate-500 font-medium">완료한 여행</p>
            </div>
            <div className="flex-1 text-center last:border-0">
              <p className="text-2xl font-bold text-slate-900 mb-1">5</p>
              <p className="text-xs text-slate-500 font-medium">공유한 여행</p>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="mt-2 bg-white">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">서비스 설정</h3>
          </div>
          
          <button onClick={() => navigate('/history')} className="w-full flex items-center justify-between p-6 bg-white border-b border-slate-100/50 hover:bg-slate-50 transition-colors active:bg-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Map size={16} />
              </div>
              <span className="text-base font-semibold text-slate-800">여행 기록</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
          
          <button onClick={() => navigate('/notifications')} className="w-full flex items-center justify-between p-6 bg-white border-b border-slate-100/50 hover:bg-slate-50 transition-colors active:bg-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <span className="text-base font-semibold text-slate-800">알림 설정</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button onClick={() => navigate('/privacy')} className="w-full flex items-center justify-between p-6 bg-white border-b border-slate-100/50 hover:bg-slate-50 transition-colors active:bg-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <span className="text-base font-semibold text-slate-800">개인정보 보호</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button onClick={() => navigate('/support')} className="w-full flex items-center justify-between p-6 bg-white border-b border-slate-100/50 hover:bg-slate-50 transition-colors active:bg-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <HelpCircle size={16} />
              </div>
              <span className="text-base font-semibold text-slate-800">고객 센터</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>

        <div className="p-6 mt-4">
           <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 text-slate-500 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
              <LogOut size={16} />
              로그아웃
           </button>
           <p className="text-center text-xs text-slate-400 mt-6 font-medium">TripMaker v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
