import { getHospitalById, addReview } from "@/app/actions";
import { Star, User, DollarSign, MapPin, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

// 👇 Next.js 15버전 호환 타입 (Promise)
type Props = {
  params: Promise<{ id: string }>;
};

export default async function HospitalDetailPage(props: Props) {
  // ⭐⭐ 여기가 핵심입니다! await으로 기다렸다가 ID를 꺼내야 합니다.
  const params = await props.params;
  const hospitalId = params.id;
  
  // 데이터 가져오기
  const hospital = await getHospitalById(hospitalId);

  // 1. 데이터가 없을 때 (에러 처리)
  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">⚠ 병원을 찾을 수 없습니다.</h2>
          <p className="text-gray-600 mb-4">요청하신 ID가 데이터베이스에 없습니다.</p>
          <div className="bg-white p-3 rounded border text-xs text-left font-mono text-gray-500 break-all">
            {/* ID가 비어있는지 확인하는 디버깅용 코드 */}
            <strong>Requested ID:</strong> {hospitalId ? hospitalId : "(ID 감지 실패! await params 확인 필요)"}
          </div>
        </div>
        <Link href="/hospitals" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          목록으로 돌아가서 다시 선택하기
        </Link>
      </div>
    );
  }

  // 안전장치
  const tagsArray = (hospital.tags || "").split(',');

  // 리뷰 작성 함수
  async function submitReview(formData: FormData) {
    "use server";
    const userName = formData.get("userName") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    await addReview(hospital!.id, userName, rating, content);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10 px-4 h-14 flex items-center shadow-sm">
        <Link href="/hospitals" className="mr-4"><ArrowLeft className="w-6 h-6" /></Link>
        <h1 className="font-bold text-lg truncate">{hospital.name}</h1>
      </div>

      <div className="relative h-64 bg-gray-200">
        <img src={hospital.image || ""} alt={hospital.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
          <h2 className="text-white text-2xl font-bold">{hospital.name}</h2>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {hospital.location}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-0">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-yellow-500 font-bold text-lg">
              <Star className="w-5 h-5 fill-current mr-1" /> {hospital.rating}
            </div>
            <span className="text-gray-400 text-sm">리뷰 {hospital.userReviews?.length || 0}개</span>
          </div>
          <p className="text-gray-600 leading-relaxed">{hospital.desc}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tagsArray.map((tag, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">#{tag}</span>
            ))}
          </div>
        </div>

        {/* 의료진 정보 */}
        {hospital.doctors && hospital.doctors.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600"/> 대표 의료진</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {hospital.doctors.map(doc => (
                <div key={doc.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 overflow-hidden bg-gray-100 flex items-center justify-center text-2xl">
                     👨‍⚕️
                  </div>
                  <div className="font-bold text-sm text-gray-900 mt-2">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.specialty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⭐ 시술 가격표 (여기가 중요!) ⭐ */}
        {hospital.menus && hospital.menus.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600"/> 주요 시술 가격
            </h3>
            <ul className="space-y-3">
              {hospital.menus.map((menu) => (
                <li key={menu.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                  <span className="text-gray-700 font-medium">{menu.name}</span>
                  <span className="font-bold text-blue-600">{menu.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm mb-20">
          <h3 className="font-bold text-lg mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-600"/> 실제 후기</h3>
          
          <form action={submitReview} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="mb-3">
              <input name="userName" placeholder="이름 (익명)" className="border p-3 rounded-lg w-full mb-2" required />
              <select name="rating" className="border p-3 rounded-lg w-full mb-2 bg-white">
                <option value="5">⭐⭐⭐⭐⭐ (최고예요)</option>
                <option value="4">⭐⭐⭐⭐ (좋아요)</option>
                <option value="3">⭐⭐⭐ (보통이에요)</option>
              </select>
              <textarea name="content" placeholder="솔직한 후기를 남겨주세요" className="border p-3 rounded-lg w-full h-24 resize-none" required></textarea>
            </div>
            <button className="bg-blue-600 text-white px-4 py-3 rounded-xl text-sm w-full font-bold">후기 등록</button>
          </form>

          <div className="space-y-6">
            {(!hospital.userReviews || hospital.userReviews.length === 0) ? (
              <p className="text-gray-400 text-center text-sm py-4">아직 등록된 후기가 없습니다.</p>
            ) : (
              hospital.userReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm">{review.userName}</span>
                    <span className="text-yellow-400 text-xs">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.content}</p>
                  <div className="text-xs text-gray-400 mt-2 text-right">{review.createdAt.toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t p-4 z-20 safe-area-bottom">
        <Link href="/" className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-xl text-center">
          이 병원 상담 신청하기
        </Link>
      </div>
    </div>
  );
}