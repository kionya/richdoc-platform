import { createLead } from "@/app/actions"; 
import { db } from "@/lib/db";

// 👇 여기를 잘 봐주세요! ({ params }) 가 아니라 (props: ...) 로 바뀌어야 합니다.
export default async function ConsultPage(props: { params: Promise<{ id: string }> }) {
  
  // 1. 기다렸다가 ID 꺼내기 (Next.js 15 필수 문법)
  const params = await props.params;
  const id = params.id;

  const hospital = await db.hospital.findUnique({
    where: { id: id }
  });

  if (!hospital) return <div>병원을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg">
        
        <h1 className="text-2xl font-bold mb-2">상담 신청하기</h1>
        <p className="text-gray-600 mb-6">
          <span className="text-blue-600 font-bold">{hospital.name}</span>에서 
          직접 상담해드립니다.
        </p>

        <form action={createLead} className="space-y-4">
          <input type="hidden" name="hospitalId" value={hospital.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input name="name" required className="w-full border p-2 rounded-lg" placeholder="홍길동" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input name="contact" required className="w-full border p-2 rounded-lg" placeholder="010-1234-5678" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">고민 부위 / 내용</label>
            <textarea name="concern" required className="w-full border p-2 rounded-lg h-32" placeholder="예: 코가 조금 더 높았으면 좋겠어요." />
          </div>
          {/* 👇 [추가] 사진 업로드 섹션 시작 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📸 현재 상태 사진 (선택)
            </label>
            <input 
              type="file" 
              name="photo" 
              accept="image/*" // 이미지만 선택 가능하게
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              * 정면/측면 사진을 올리시면 더 정확한 견적이 가능합니다.
            </p>
          </div>
          {/* 👆 [추가] 사진 업로드 섹션 끝 */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            무료 견적 요청하기
          </button>
        </form>
      </div>
    </div>
  );
}