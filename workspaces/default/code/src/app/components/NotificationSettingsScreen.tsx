import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Bell, Moon, Mail, Smartphone } from 'lucide-react';

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    push: true,
    marketing: false,
    email: true,
    doNotDisturb: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white sticky top-0 shadow-sm z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">알림 설정</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Toggle List */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100/50">
          
          <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 mb-0.5">앱 푸시 알림</p>
                <p className="text-xs text-slate-500 font-medium">일정 변경 및 중요 알림 수신</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('push')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner
                ${settings.push ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform duration-300
                ${settings.push ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 mb-0.5">마케팅 정보 수신</p>
                <p className="text-xs text-slate-500 font-medium">새로운 기능 및 혜택 안내</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('marketing')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner
                ${settings.marketing ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform duration-300
                ${settings.marketing ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 mb-0.5">이메일 알림</p>
                <p className="text-xs text-slate-500 font-medium">일정 요약 및 여행 팁 수신</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('email')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner
                ${settings.email ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform duration-300
                ${settings.email ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-100 flex items-center justify-center shrink-0">
                <Moon size={20} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 mb-0.5">방해금지 모드</p>
                <p className="text-xs text-slate-500 font-medium">오후 10시 ~ 오전 8시 알림 무음</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('doNotDisturb')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner
                ${settings.doNotDisturb ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform duration-300
                ${settings.doNotDisturb ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
