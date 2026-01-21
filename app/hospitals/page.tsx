"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, Check, Plus, X, ArrowRight, RefreshCcw } from "lucide-react";
import { getHospitals, seedInitialHospitals } from "@/app/actions"; // 👈 배달원 소환

// 병원 데이터 타입 정의
interface Hospital {
  id: number;
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
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 화면이 켜지면 DB에서 병원 목록 가져오기
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getHospitals();
    setHospitals(data);
    setIsLoading(false);
  };

  // 2. (초기 세팅용) 데이터가 없을 때 누르는 버튼 기능
  const handleSeed = async () => {
    if (confirm("초기 데이터를 DB에 넣으시겠습니까?")) {
      await seedInitialHospitals();
      alert("데이터 주입 완료! 새로고침됩니다.");
      loadData();
    }
  };

  // 비교함 기능
  const toggleCompare = (id: number) => {
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
          {/* 👇 데이터가 하나도 없을 때만 보이는 '초기화 버튼' */}
          {hospitals.length === 0 && !isLoading && (
            <button onClick={handleSeed} className="text-xs bg-gray-800 text-white px-3 py-2 rounded flex items-center gap-2">
              <RefreshCcw className="w-3 h-3"/> 초기 데이터 넣기 (관리자용)
            </button>
          )}
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
                        {/* 태그가 콤마로 되어있으므로 쪼개서 보여줌 */}
                        {hospital.tags.split(',').map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                     <button className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg">
                       상세보기
                     </button>
                     <button 
                      onClick={() => toggleCompare(hospital.id)}
                      className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
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
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-2xl p-4 z-50 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {compareList.length}
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900">비교함에 담긴 병원</p>
                <p className="text-xs text-gray-500">최대 3개까지 비교 가능합니다.</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setCompareList([])} className="px-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-700">
                 초기화
               </button>
               <button className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 flex items-center shadow-lg">
                 비교견적 요청하기 <ArrowRight className="w-4 h-4 ml-2" />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}