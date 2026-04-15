import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context';
import { User, ChevronRight, Bell, Shield, HelpCircle, Star, LogOut } from 'lucide-react';

const MENU_ITEMS = [
  { icon: Bell, label: '알림 설정', desc: '여행 알림을 관리합니다', path: '/notifications' },
  { icon: Star, label: '여행 기록', desc: '완료한 여행을 확인합니다', path: '/history' },
  { icon: Shield, label: '개인정보 보호', desc: '데이터 관리 및 보안', path: '/privacy' },
  { icon: HelpCircle, label: '고객센터', desc: '도움이 필요하신가요?', path: '/support' },
];

export function MyPageScreen() {
  const { savedTrips } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>마이페이지</h2>
      </div>

      {/* Profile card */}
      <div className="mx-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>여행자님</p>
            <p className="text-blue-200 mt-0.5" style={{ fontSize: '0.8rem' }}>triplan@travel.com</p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
          <div className="flex-1 cursor-pointer hover:bg-white/10 rounded-lg -m-2 p-2 transition-colors" onClick={() => navigate('/saved')}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{savedTrips.length}</p>
            <p className="text-blue-200" style={{ fontSize: '0.7rem' }}>저장된 여행</p>
          </div>
          <div className="flex-1 cursor-pointer hover:bg-white/10 rounded-lg -m-2 p-2 transition-colors" onClick={() => navigate('/history')}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>0</p>
            <p className="text-blue-200" style={{ fontSize: '0.7rem' }}>완료한 여행</p>
          </div>
          <div className="flex-1">
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>0</p>
            <p className="text-blue-200" style={{ fontSize: '0.7rem' }}>공유된 여행</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 mt-6 space-y-1">
        {MENU_ITEMS.map(({ icon: Icon, label, desc, path }) => (
          <button 
            key={label} 
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.7rem' }}>{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="px-6 pb-4">
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-red-400 transition-colors" 
          style={{ fontSize: '0.85rem', fontWeight: 500 }}
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
