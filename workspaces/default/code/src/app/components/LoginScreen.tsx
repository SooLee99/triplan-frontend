import React from 'react';
import { useNavigate } from 'react-router';
import { Mail, MapPin } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative pb-8 pt-16 px-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm mb-6">
          <MapPin size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 mb-2 text-center">
          단 3초 만에<br />일정을 완성하세요
        </h1>
        <p className="text-slate-500 text-center text-lg mt-2">
          가장 빠른 모바일 여행 플래너
        </p>
      </div>

      <div className="w-full space-y-3 pb-8">
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-[#FEE500] text-[#191919] font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-lg shadow-sm"
        >
          {/* Mock Kakao Icon */}
          <div className="w-5 h-5 bg-black/80 rounded-full flex items-center justify-center text-white font-bold text-xs mr-1">
            K
          </div>
          카카오로 시작하기
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-white text-slate-600 border border-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-base hover:bg-slate-50"
        >
          <Mail size={18} />
          이메일로 계속하기
        </button>
      </div>

      <div className="mt-auto px-4 w-full">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          가입 시 TripMaker의 <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보 처리방침</span>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
