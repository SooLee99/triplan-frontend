import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Shield } from 'lucide-react';

export function PrivacyPolicyScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white sticky top-0 shadow-sm z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">개인정보 처리방침</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
              <Shield size={20} />
           </div>
           <div>
              <h2 className="text-xl font-bold text-slate-900">TripMaker<br/>개인정보 처리방침</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">시행일: 2026년 4월 15일</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2">1. 수집하는 개인정보 항목</h3>
            <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <ul className="list-disc list-inside mt-2 pl-4 text-slate-500 space-y-1">
              <li>필수항목: 카카오계정(이메일), 이름, 프로필 사진</li>
              <li>선택항목: 위치 정보, 마케팅 수신 동의 여부</li>
              <li>자동수집: IP 주소, 쿠키, 서비스 이용 기록, 기기 정보</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2">2. 개인정보의 수집 및 이용 목적</h3>
            <p>수집한 개인정보는 다음의 목적을 위해 활용됩니다.</p>
            <ul className="list-disc list-inside mt-2 pl-4 text-slate-500 space-y-1">
              <li>서비스 제공 및 계약 이행, 맞춤형 여행 일정 추천</li>
              <li>회원 관리, 본인 확인, 불량 회원의 부정 이용 방지</li>
              <li>신규 서비스 개발 및 통계학적 분석, 마케팅 및 광고 활용</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2">3. 개인정보의 보유 및 이용 기간</h3>
            <p>원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
            <ul className="list-disc list-inside mt-2 pl-4 text-slate-500 space-y-1">
              <li>서비스 이용 기록: 3개월</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2">4. 개인정보 파기절차 및 방법</h3>
            <p>이용자의 개인정보는 원칙적으로 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때 지체없이 파기합니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
