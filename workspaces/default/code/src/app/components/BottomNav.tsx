import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { Home, Calendar, MapPin, User, Settings, Compass, Search } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Calendar, label: '달력', path: '/calendar' },
    { icon: Compass, label: '내 여행', path: '/saved' },
    { icon: User, label: '마이', path: '/mypage' },
  ];

  return (
    <nav className="flex justify-around items-center h-16 bg-white border-t border-slate-100 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-50 relative pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
