"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, Check, Plus, ArrowRight, X, ShieldCheck } from "lucide-react";
import { getHospitals, createConsultation } from "@/app/actions";
import Link from "next/link"; 

export default function HospitalMainSection() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getHospitals();
        // 데이터가 배열이 아니면 빈 배열로 처리 (안전장치 1)
        setHospitals(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("데이터 로딩 실패", e);
        setHospitals([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert("비교는 최대 3개까지만 가능합니다!");
        return;
      }
      setCompareList([...compareList, id]);
    }
  };

  const selectedHospitalNames = hospitals
    .filter(h => compareList.includes(h.id))
    .map(h => h.name)
    .join(", ");

  return (
    <section id="hospitals" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold text-sm tracking-wide">PARTNERS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">제휴 병원 둘러보기</h2>
          <p className="text-gray-500">원하는 병원을 선택해서 비교 견적을 받아보세요.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">병원 목록을 불러오는 중...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => {
              const isSelected = compareList.includes(hospital.id);
              // 👇 안전장치 2: 태그가 없으면 빈 문자열로 처리
              const tagsArray = (hospital.tags || "").split(',');

              return (
                <div key={hospital.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-lg ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                  {/* 이미지 영역 */}
                  <Link href={`/hospitals/${hospital.id}`} className="block relative h-48 bg-gray-200 cursor-pointer group">
                    <img src={hospital.image || ""} alt={hospital.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center shadow-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-bold">{hospital.rating}</span>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link href={`/hospitals/${hospital.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition">{hospital.name}</h3>
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" /> {hospital.location}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{hospital.desc}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {/* 👇 안전장치 3: 태그 렌더링 시 에러 방지 */}
                      {tagsArray.slice(0, 3).map((tag: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        href={`/hospitals/${hospital.id}`}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition"
                      >
                        상세보기
                      </Link>
                      <button 
                        onClick={() => toggleCompare(hospital.id)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${
                          isSelected 
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {isSelected ? <><Check className="w-4 h-4 mr-1"/> 담기</> : <><Plus className="w-4 h-4 mr-1"/> 담기</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 장바구니 UI (기존과 동일) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {compareList.length}
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 text-lg">병원 선택 완료</p>
                <p className="text-sm text-gray-500">최대 3개까지 비교 가능</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setCompareList([])} className="px-4 text-gray-500 font-medium hover:text-gray-800 transition">
                 초기화
               </button>
               <button onClick={() => setIsModalOpen(true)} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-800 flex items-center shadow-lg transition transform hover:-translate-y-1">
                 비교견적 받기 <ArrowRight className="w-5 h-5 ml-2" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 UI (기존과 동일) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">견적 요청서</h3>
              <p className="text-gray-500 mt-2">선택하신 <span className="text-blue-600 font-bold">{compareList.length}개 병원</span>의<br/>최저가 견적을 확인해드립니다.</p>
            </div>
            <form action={createConsultation} className="space-y-4">
              <input type="hidden" name="content" value={`[메인페이지 장바구니] 선택병원: ${selectedHospitalNames}`} />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                <input name="customerName" type="text" placeholder="예: 홍길동" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                <input name="phone" type="tel" placeholder="010-1234-5678" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 mt-4 text-lg shadow-lg shadow-blue-200">무료 견적서 받기</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}