import React from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function LoginScreen() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to the main app (TripInfoScreen which is currently mounted at '/')
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 flex flex-col justify-center items-center px-8 relative">
        {/* Logo & Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm">
            <MapPin className="w-10 h-10" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gray-900 tracking-tight">Triplan</h1>
          <p className="text-gray-500 mt-2" style={{ fontSize: '1.1rem', fontWeight: 500 }}>더 쉽고, 더 완벽한 나의 여행</p>
        </motion.div>

        {/* Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full space-y-3"
        >
          <button
            onClick={handleLogin}
            className="w-full h-14 bg-[#FEE500] hover:bg-[#FBDD00] text-black/85 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-colors active:scale-95"
            style={{ fontWeight: 600 }}
          >
            <MessageCircle className="w-6 h-6 fill-black/85" />
            카카오 로그인
          </button>
          <button
            onClick={handleLogin}
            className="w-full h-14 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-colors active:scale-95"
            style={{ fontWeight: 600 }}
          >
            이메일로 계속하기
          </button>
        </motion.div>
      </div>

      {/* Footer Links */}
      <div className="px-8 pb-10 pt-4 flex flex-col items-center justify-center text-gray-400 gap-2 shrink-0">
        <p style={{ fontSize: '0.8rem' }}>로그인 시 다음 약관에 동의하는 것으로 간주합니다.</p>
        <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
          <button className="underline decoration-gray-300 underline-offset-2">이용약관</button>
          <span>|</span>
          <button className="underline decoration-gray-300 underline-offset-2">개인정보 처리방침</button>
        </div>
      </div>
    </div>
  );
}
