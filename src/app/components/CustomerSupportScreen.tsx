import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = [
  { q: 'AI 추천 여행은 어떻게 만들어지나요?', a: '사용자가 선택한 여행 테마와 인원, 날짜를 기반으로 가장 적합한 장소들을 매칭하여 일정을 최적화합니다.' },
  { q: '작성한 여행 일정을 공유할 수 있나요?', a: '네, 각 일정의 상세 화면 하단에서 [확정하기] 후 [공유하기]를 눌러 카카오톡이나 링크로 공유하실 수 있습니다.' },
  { q: '다중일 여행은 어떻게 설정하나요?', a: '여행 생성 시 날짜를 2일 이상으로 선택하면 자동으로 각 일자별 일정을 추천해 드립니다. 각 일자의 출발/도착 지점도 설정 가능합니다.' },
  { q: '동선을 변경하고 싶어요.', a: '타임라인 에디터에서 이동 수단이나 장소의 우측 아이콘을 탭하여 순서를 변경하거나 장소를 삭제, 추가할 수 있습니다.' },
];

export function CustomerSupportScreen() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-3 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors active:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>고객 센터</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Contact Options */}
        <div className="bg-white px-6 py-6 mb-2">
          <h3 className="text-gray-900 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700 }}>어떤 도움이 필요하신가요?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100 active:scale-[0.98]">
              <MessageCircle className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-gray-800" style={{ fontSize: '0.9rem', fontWeight: 600 }}>1:1 채팅 문의</span>
              <span className="text-gray-400 mt-1" style={{ fontSize: '0.7rem' }}>평일 10:00 - 18:00</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100 active:scale-[0.98]">
              <Mail className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-gray-800" style={{ fontSize: '0.9rem', fontWeight: 600 }}>이메일 문의</span>
              <span className="text-gray-400 mt-1" style={{ fontSize: '0.7rem' }}>help@triplan.com</span>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 700 }}>자주 묻는 질문</h3>
          </div>
          
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden transition-colors">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-800 pr-4" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    <span className="text-blue-600 mr-2">Q.</span>{item.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <span className="text-gray-600 leading-relaxed" style={{ fontSize: '0.85rem' }}>
                      <span className="text-gray-900 font-bold mr-2">A.</span>{item.a}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
