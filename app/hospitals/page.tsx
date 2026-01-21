"use client";

import { useState } from "react";
import { Star, MapPin, Check, Plus, X, ArrowRight } from "lucide-react";

// 🏥 가상의 병원 데이터 (나중에는 DB에서 가져올 겁니다)
const HOSPITALS = [
  {
    id: 1,
    name: "강남 리치 성형외과",
    location: "서울 강남구 테헤란로",
    tags: ["눈성형", "코성형", "재수술전문"],
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    desc: "20년 무사고, 자연스러운 라인을 추구합니다."
  },
  {
    id: 2,
    name: "더 뷰티 피부과",
    location: "서울 서초구",
    tags: ["리프팅", "피부관리", "보톡스"],
    rating: 4.8,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    desc: "최신 레이저 장비 보유, 1:1 맞춤 케어"
  },
  {
    id: 3,
    name: "아이디얼 치과",
    location: "서울 강남구 신사동",
    tags: ["라미네이트", "치아교정", "미백"],
    rating: 5.0,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    desc: "하루 만에 완성하는 스마일 라인"
  },
  {
    id: 4,
    name: "바디 핏 클리닉",
    location: "서울 송파구",
    tags: ["지방흡입", "다이어트", "체형교정"],
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80",
    desc: "당신이 꿈꾸던 워너비 몸매의 완성"
  },
];

export default function HospitalListPage() {
  // 🛒 장바구니(비교함) 상태 관리
  const [compareList, setCompareList] = useState<number[]>([]);

  // 비교함에 담기/빼기 기능
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
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-blue-900">RICH DOC</a>
          <span className="text-sm text-gray-500">제휴 병원 목록</span>
        </div>
      </header>

      {/* 메인 리스트 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">🏥 추천 병원 리스트</h1>
        
        <div className="grid gap-6">
          {HOSPITALS.map((hospital) => {
            const isSelected = compareList.includes(hospital.id);
            
            return (
              <div key={hospital.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-300'}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 병원 이미지 */}
                  <img src={hospital.image} alt={hospital.name} className="w-full sm:w-32 h-32 object-cover rounded-xl bg-gray-200" />
                  
                  {/* 병원 정보 */}
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
                      {hospital.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                   <button className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg">
                     상세보기
                   </button>
                   <button 
                    onClick={() => toggleCompare(hospital.id)}
                    className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                      isSelected 
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                   >
                     {isSelected ? <><Check className="w-4 h-4 mr-1"/> 담기 완료</> : <><Plus className="w-4 h-4 mr-1"/> 비교함 담기</>}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 🛒 하단 플로팅 비교 바 (장바구니) */}
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
               <button 
                 onClick={() => setCompareList([])}
                 className="px-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-700"
               >
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