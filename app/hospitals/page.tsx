"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, Check, Plus, ArrowRight, X } from "lucide-react";
import { getHospitals, seedInitialHospitals, createConsultation } from "@/app/actions";

interface Hospital {
  id: string; // ID가 문자열(uuid)로 바뀌었으므로 string
  name: string;
  location: string;
  tags: string;
  rating: number;
  reviews: number;
  image: string;
  desc: string;
}

export default function HospitalListPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]); // ID가 문자열이라 string[]
  const [isLoading, setIsLoading] = useState(true);
  
  // 팝업(모달) 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getHospitals();
    // @ts-ignore (타입 충돌 방지용)
    setHospitals(data);
    setIsLoading(false);
  };

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

  // 선택한 병원 이름들 가져오기 (DB에 저장하기 위해)
  const selectedHospitalNames = hospitals
    .filter(h => compareList.includes(h.id))
    .map(h => h.name)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-blue-900">RICH DOC</a>
          <span className="text-sm text-gray-500">제휴 병원 목록</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🏥 실시간 제휴 병원</h1>
        </div>
        
        {isLoading ? (
          <p className="text-center py-20 text-gray-500">데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="grid gap-6">
            {hospitals.map((hospital) => {
              const isSelected = compareList.includes(hospital.id);
              return (
                <div key={hospital.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-300'}`}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={hospital.image} alt={hospital.name} className="w-full sm:w-32 h-32 object-cover rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{hospital.name}</h2>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1" /> {hospital.location}
                          </div>
                        </div>
                        <div className="flex items-center text-yellow-500 font-bold">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {hospital.rating} <span className="text-gray-400 font-normal ml-1">({hospital.reviews})</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-1">{hospital.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {hospital.tags.split(',').map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                     <button 
                      onClick={() => toggleCompare(hospital.id)}
                      className={`flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors w-full sm:w-auto justify-center ${
                        isSelected ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                     >
                       {isSelected ? <><Check className="w-4 h-4 mr-1"/> 담기 완료</> : <><Plus className="w-4 h-4 mr-1"/> 비교함 담기</>}
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 비교함 바 (장바구니) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-2xl p-4 z-40 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {compareList.length}
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900">선택한 병원 비교하기</p>
                <p className="text-xs text-gray-500">{selectedHospitalNames}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setCompareList([])} className="px-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-700">
                 초기화
               </button>
               <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 flex items-center shadow-lg"
               >
                 견적 요청 <ArrowRight className="w-4 h-4 ml-2" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 👇 견적 요청 팝업 (모달) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-bold mb-2">비교 견적 요청서</h3>
            <p className="text-sm text-gray-500 mb-6">
              선택하신 <span className="text-blue-600 font-bold">{compareList.length}개 병원</span>의 견적을 비교해드립니다.
            </p>

            <form action={createConsultation} className="space-y-4">
              {/* 숨겨진 정보 (어떤 병원을 선택했는지 몰래 보냄) */}
              <input type="hidden" name="content" value={`[비교견적요청] 선택병원: ${selectedHospitalNames}`} />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                <input name="customerName" type="text" placeholder="홍길동" className="w-full border p-3 rounded-lg bg-gray-50" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">연락처 (필수)</label>
                <input name="phone" type="tel" placeholder="010-1234-5678" required className="w-full border p-3 rounded-lg bg-gray-50" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 mt-2">
                무료 견적 받기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}