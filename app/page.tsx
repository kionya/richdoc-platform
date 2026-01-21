import { createConsultation } from "@/app/actions";
import { Phone, Calendar, CheckCircle, Star, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. 헤더 (로고 & 문의하기) */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-900">RICH DOC</div>
          <a href="#consult" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition">
            무료 상담하기
          </a>
        </div>
      </header>

      {/* 2. 히어로 섹션 (메인 배너) */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* 텍스트 */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
              프리미엄 의료 서비스
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              당신의 아름다움을 위한<br/>
              <span className="text-blue-600">완벽한 솔루션</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              20년 경력의 의료진과 최첨단 장비로<br className="md:hidden"/> 
              안전하고 확실한 결과를 약속드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#consult" className="flex items-center justify-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg">
                <Calendar className="w-5 h-5" /> 바로 예약하기
              </a>
              <a href="tel:02-1234-5678" className="flex items-center justify-center gap-2 border border-gray-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
                <Phone className="w-5 h-5" /> 전화 상담
              </a>
            </div>
          </div>
          {/* 이미지 (나중에 병원 사진으로 교체) */}
          <div className="flex-1 w-full">
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" 
              alt="병원 이미지" 
              className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 3. 특장점 (Why Us?) */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">왜 RICH DOC인가요?</h2>
            <p className="text-gray-500">압도적인 기술력과 차별화된 서비스</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "100% 정품 정량", desc: "모든 시술 재료는 현장에서 개봉하여 확인시켜 드립니다." },
              { icon: Star, title: "프리미엄 케어", desc: "상담부터 시술 후 관리까지 1:1 전담 매니저가 케어합니다." },
              { icon: CheckCircle, title: "안전 최우선", desc: "대학병원급 멸균 시스템과 응급 안전 장비를 갖췄습니다." },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100">
                <item.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 상담 신청 섹션 (핵심 기능 연결!) */}
      <section id="consult" className="py-24 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">무료 상담 신청</h2>
            <p className="text-blue-200 mb-8 text-lg">
              고민하지 마세요. 전문 상담 실장이<br/>
              친절하게 안내해 드립니다.
            </p>
            <ul className="space-y-4 text-left inline-block">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-400" /> 시술 가격 및 이벤트 안내
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-400" /> 가장 빠른 예약 시간 확인
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-400" /> 맞춤형 시술 추천
              </li>
            </ul>
          </div>

          {/* 여기가 아까 만든 기능이 들어가는 곳입니다 */}
          <div className="flex-1 w-full bg-white text-gray-900 p-8 rounded-2xl shadow-2xl">
            <form action={createConsultation} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                <input 
                  name="customerName"
                  type="text" 
                  placeholder="예: 김이름" 
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
                <input 
                  name="phone"
                  type="tel" 
                  placeholder="010-1234-5678" 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">고민 부위 / 내용</label>
                <textarea 
                  name="content"
                  placeholder="예: 눈매 교정 가격이 궁금해요." 
                  required 
                  className="w-full h-32 bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                상담 신청하기 <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 text-center">
                보내주신 정보는 상담 목적으로만 사용됩니다.
              </p>
            </form>
          </div>

        </div>
      </section>

      {/* 5. 푸터 */}
      <footer className="bg-gray-900 text-gray-500 py-12 px-4 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">RICH DOC 의원</h3>
            <p>서울시 강남구 테헤란로 123, 리치타워 10층</p>
            <p>사업자등록번호: 123-45-67890 | 대표자: 이사님</p>
            <p>Tel: 02-1234-5678</p>
          </div>
          <div className="md:text-right">
            <p>© 2026 RICH DOC Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}