import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicyScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors active:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>개인정보 처리방침</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-gray-600" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
        <section>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 700 }}>1. 개인정보의 수집 및 이용 목적</h3>
          <p>Triplan은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>회원 가입 및 관리</li>
            <li>서비스 제공 및 계약 이행</li>
            <li>맞춤형 여행 일정 추천 서비스 제공</li>
          </ul>
        </section>

        <section>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 700 }}>2. 수집하는 개인정보의 항목</h3>
          <p>서비스 이용 과정에서 아래와 같은 정보들이 수집될 수 있습니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>필수항목: 이메일 주소, 비밀번호, 닉네임, 프로필 사진</li>
            <li>선택항목: 여행 취향, 이동 수단 선호도</li>
            <li>자동수집: IP 주소, 쿠키, 서비스 이용 기록, 기기 정보</li>
          </ul>
        </section>

        <section>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 700 }}>3. 개인정보의 보유 및 이용기간</h3>
          <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>서비스 이용 기록: 1년 (통신비밀보호법)</li>
            <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
          </ul>
        </section>

        <section>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 700 }}>4. 정보주체의 권리, 의무 및 그 행사방법</h3>
          <p>이용자는 개인정보주체로서 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수 있습니다.</p>
        </section>

        <div className="pt-8 pb-10 text-center text-gray-400">
          <p>시행일자: 2026년 4월 14일</p>
        </div>
      </div>
    </div>
  );
}
