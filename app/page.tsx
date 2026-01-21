import { Phone, Calendar, ShieldCheck, Star, CheckCircle, ArrowRight } from "lucide-react";
import HospitalMainSection from "@/components/HospitalMainSection"; // 👈 방금 만든 부품 가져오기

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. 헤더 */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-900">RICH DOC</div>
          <a href="#hospitals" className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-200 transition">
            병원 둘러보기
          </a>
        </div>
      </header>

      {/* 2. 히어로 섹션 (메인 배너) */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <span className="inline-block bg-white border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm">
              ✨ 상위 1% 병원 플랫폼
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              실패 없는 선택,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                비교하고 결정하세요
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              검증된 병원들의 견적을 한눈에 비교하고<br className="md:hidden"/> 
              나에게 딱 맞는 혜택을 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#hospitals" className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform">
                <Calendar className="w-5 h-5" /> 병원 리스트 보기
              </a>
            </div>
            
            <div className="mt-10 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" /> 검증된 의료진
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" /> 100% 정품인증
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <img 
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80" 
              alt="메인 이미지" 
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3] rotate-1 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* 3. ⭐ 여기가 핵심! 병원 리스트 & 장바구니 섹션 ⭐ */}
      <HospitalMainSection />

      {/* 4. 특장점 섹션 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">왜 RICH DOC인가요?</h2>
            <p className="text-gray-500">압도적인 데이터와 차별화된 큐레이션</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "엄격한 입점 심사", desc: "의료사고 이력, 전문의 여부 등 15가지 항목을 통과한 병원만 소개합니다." },
              { icon: Star, title: "실제 리뷰 기반", desc: "광고성 후기를 배제하고 실제 고객들의 영수증 인증 리뷰만을 제공합니다." },
              { icon: CheckCircle, title: "안심 케어 서비스", desc: "상담부터 수술 후 회복까지 전담 매니저가 1:1로 밀착 케어합니다." },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300">
                <item.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 푸터 */}
      <footer className="bg-gray-900 text-gray-500 py-12 px-4 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">RICH DOC</h3>
            <p>서울시 강남구 테헤란로 123</p>
            <p>사업자등록번호: 123-45-67890</p>
          </div>
          <div className="md:text-right">
            <p>© 2026 RICH DOC Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}