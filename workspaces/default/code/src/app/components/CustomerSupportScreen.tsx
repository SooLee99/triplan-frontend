import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MessageCircle, Mail, ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  { id: '1', q: '여행 일정을 중간에 어떻게 수정하나요?', a: '여행 일정 편집 화면에서 추가하고 싶은 장소를 선택하거나 삭제하고 싶은 장소를 길게 눌러 지울 수 있습니다. 이동 수단 아이콘을 눌러 수단을 변경하면 전체 일정이 자동 재계산됩니다.' },
  { id: '2', q: '일정 공유 링크는 어떻게 생성하나요?', a: '일정 편집을 마치고 하단의 "일정 확정하기" 버튼을 누르시면 공유 화면으로 이동합니다. 거기서 "링크 공유" 또는 "이미지 저장"을 선택할 수 있습니다.' },
  { id: '3', q: '저장된 여행 기록은 어디서 볼 수 있나요?', a: '하단 메뉴바의 "내 여행" 또는 "마이페이지 > 여행 기록" 메뉴를 통해 이전에 저장하거나 완료한 전체 여행 일정을 확인할 수 있습니다.' },
  { id: '4', q: '카카오 로그인 연동을 해제하고 싶어요', a: '마이페이지의 "서비스 설정 > 계정 관리" 탭에서 카카오 계정 연동을 해제하거나 서비스 탈퇴를 진행하실 수 있습니다.' },
];

export function CustomerSupportScreen() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>('1');

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white sticky top-0 shadow-sm z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">고객 센터</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* Contact Buttons */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">무엇을 도와드릴까요?</h2>
              <p className="text-xs text-slate-500 font-medium">평일 10:00 - 18:00 지원</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 py-4 bg-[#FEE500] text-[#191919] font-bold rounded-2xl hover:bg-[#FADB00] active:scale-95 transition-all text-sm shadow-sm border border-[#FEE500]">
              <MessageCircle size={20} />
              1:1 채팅 문의
            </button>
            <button className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-sm shadow-sm border border-slate-200">
              <Mail size={20} />
              이메일 문의
            </button>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
               자주 묻는 질문
            </h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white">
                <button 
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[15px] font-bold text-slate-800 pr-4 leading-snug">
                     <span className="text-blue-600 mr-2">Q.</span>
                     {faq.q}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50/50 ${
                    openFaq === faq.id ? 'max-h-40 opacity-100 border-t border-slate-100/50' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-5 text-sm text-slate-600 font-medium leading-relaxed">
                     <span className="text-slate-400 mr-2 font-bold block mb-1">A.</span>
                     {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
