import Link from "next/link";
import { db } from "@/lib/db";

// 이 페이지는 서버에서만 돕니다 (보안성 최고)
export default async function Home() {
  // 1. DB에서 병원 정보를 가져옵니다 (시술 정보도 같이!)
  const hospitals = await db.hospital.findMany({
    include: {
      treatments: true, // 시술 상품 정보도 같이 가져와라
    },
    orderBy: {
      createdAt: 'desc', // 최신순 정렬
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* 헤더 섹션 */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          RichDoc Global Platform (Live11)
        </h1>
        <p className="text-gray-600 text-lg">
          검증된 한국 최고의 병원을 투명한 가격으로 만나보세요.
        </p>
      </div>

      {/* 병원 리스트 카드 섹션 */}
      <div className="max-w-4xl mx-auto grid gap-6">
        {hospitals.map((hospital) => (
          <div 
            key={hospital.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {hospital.name}
                  </h2>
                  {hospital.isPartner && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                      공식 파트너
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">📍 {hospital.location}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">등록된 시술</span>
                <p className="font-bold text-xl text-blue-600">
                  {hospital.treatments.length}
                </p>
              </div>
            </div>

            {/* 병원 설명 */}
            <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg text-sm">
              {hospital.description || "병원 소개가 없습니다."}
            </p>

            {/* 시술 태그들 */}
            <div className="flex flex-wrap gap-2">
              {hospital.treatments.map((t) => (
                <span 
                  key={t.id} 
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm border border-gray-200"
                >
                  {t.name} (₩{t.priceMin.toLocaleString()}~)
                </span>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link href={`/consult/${hospital.id}`}>
                <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  상담 신청하기
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}