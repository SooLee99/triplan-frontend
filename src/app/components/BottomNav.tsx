import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, CalendarDays, Bookmark, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: '홈', icon: Home },
  { path: '/calendar', label: '달력', icon: CalendarDays },
  { path: '/saved', label: '저장', icon: Bookmark },
  { path: '/mypage', label: '마이', icon: User },
];

// Pages where the bottom nav should be visible
const SHOW_ON = ['/', '/calendar', '/saved', '/mypage'];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!SHOW_ON.includes(pathname)) return null;

  return (
    <div className="bg-white border-t border-gray-100 px-2 pb-6 pt-2 flex items-center justify-around flex-shrink-0">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              active ? '' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              active ? 'bg-blue-600' : ''
            }`}>
              <Icon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <span
              className={active ? 'text-blue-600' : 'text-gray-400'}
              style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 500 }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
