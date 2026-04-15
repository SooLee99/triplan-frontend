import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Bell, Smartphone, Mail, AlertTriangle } from 'lucide-react';

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onCheckedChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    push: true,
    marketing: false,
    email: true,
    nightMode: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>알림 설정</h2>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* App Notifications */}
        <section>
          <h3 className="text-gray-500 mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>앱 알림</h3>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>앱 푸시 알림</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>여행 일정, 초대 알림 등을 받습니다</p>
                </div>
              </div>
              <Switch checked={settings.push} onCheckedChange={() => toggle('push')} />
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>마케팅 정보 수신</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>이벤트, 할인 혜택 정보를 받습니다</p>
                </div>
              </div>
              <Switch checked={settings.marketing} onCheckedChange={() => toggle('marketing')} />
            </div>
          </div>
        </section>

        {/* Email Notifications */}
        <section>
          <h3 className="text-gray-500 mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>이메일 알림</h3>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>이메일 소식</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>주요 여행 정보와 요약 리포트</p>
                </div>
              </div>
              <Switch checked={settings.email} onCheckedChange={() => toggle('email')} />
            </div>
          </div>
        </section>

        {/* Night Mode */}
        <section>
          <h3 className="text-gray-500 mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>방해 금지</h3>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: '1rem', fontWeight: 600 }}>야간 알림 제한</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>오후 10시 ~ 오전 8시 푸시 무음</p>
                </div>
              </div>
              <Switch checked={settings.nightMode} onCheckedChange={() => toggle('nightMode')} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
