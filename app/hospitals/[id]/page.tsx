import { getHospitalById, addReview } from "@/app/actions";
import { Star, User, DollarSign, MapPin, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function HospitalDetailPage({ params }: { params: { id: string } }) {
  // 1. ID가 제대로 넘어오는지 확인
  const hospitalId = params.id;
  const hospital = await getHospitalById(hospitalId);

  // 2. 병원이 없을 때 '어떤 ID를 찾았는지' 화면에 보여줌 (범인 색출용)
  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">⚠ 병원을 찾을 수 없습니다.</h2>
          <p className="text-gray-600 mb-4">요청하신 ID가 데이터베이스에 없습니다.</p>
          <div className="bg-white p-3 rounded border text-xs text-left font-mono text-gray-500 break-all">
            <strong>Requested ID:</strong><br/> {hospitalId}
          </div>
        </div>
        <Link href="/hospitals" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          목록으로 돌아가서 다시 선택하기
        </Link>
      </div>
    );
  }

  // 안전장치: 태그가 null일 경우 대비
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
            {/* 리뷰 개수 안전하게 표시 */}
            <span className="text-gray-400 text-sm">리뷰 {hospital.userReviews?.length || 0}개</span>
          </div>
          <p className="text-gray-600 leading-relaxed">{hospital.desc}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tagsArray.map((tag, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">#{tag}</span>
            ))}
          </div>
        </div>

        {/* 의사 정보가 있을 때만 표시 */}
        {hospital.doctors && hospital.doctors.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600"/> 대표 의료진</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {hospital.doctors.map(doc => (
                <div key={doc.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 overflow-hidden">
                    {/* 의사 이미지 없으면 기본 아이콘 */}
                     <div className="w-full h-full bg-gray-300 flex items-center justify-center">👨‍⚕️</div>
                  </div>
                  <div className="font-bold text-sm">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.specialty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm mb-20">
          <h3 className="font-bold text-lg mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-600"/> 실제 후기</h3>
          
          <form action={submitReview} className="mb-8 bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <input name="userName" placeholder="이름 (익명)" className="border p-2 rounded w-full mb-2" required />
              <select name="rating" className="border p-2 rounded w-full mb-2">
                <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                <option value="4">⭐⭐⭐⭐ (4점)</option>
                <option value="3">⭐⭐⭐ (3점)</option>
              </select>
              <textarea name="content" placeholder="솔직한 후기를 남겨주세요" className="border p-2 rounded w-full h-20" required></textarea>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full font-bold">후기 등록</button>
          </form>

          <div className="space-y-4">
            {(!hospital.userReviews || hospital.userReviews.length === 0) ? (
              <p className="text-gray-400 text-center text-sm">아직 등록된 후기가 없습니다.</p>
            ) : (
              hospital.userReviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm">{review.userName}</span>
                    <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.content}</p>
                  <div className="text-xs text-gray-300 mt-1">{review.createdAt.toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t p-4 z-20">
        <Link href="/" className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg text-center">
          이 병원 상담 신청하기
        </Link>
      </div>
    </div>
  );
}