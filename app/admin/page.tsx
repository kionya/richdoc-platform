import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// ⚠️ 비밀번호 설정 (원하는 걸로 바꾸세요)
const ADMIN_PASSWORD = "1234";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ pass?: string }>;
}) {
  // 1. 주소창의 비밀번호 확인
  const { pass } = await searchParams;

  // 2. 비밀번호가 틀리면 -> 로그인 창 보여주기
  if (pass !== ADMIN_PASSWORD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 접속</h1>
          <p className="text-gray-500 mb-6 text-sm">보안을 위해 비밀번호를 입력하세요.</p>
          
          <form className="space-y-4">
            <input
              type="password"
              name="pass"
              placeholder="비밀번호"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              접속하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. 비밀번호가 맞으면 -> 데이터 가져오기 (DB)
  // (⚠️ 만약 에러가 나면 'consultation'을 'lead'나 'request'로 바꿔보세요!)
  const consultations = await db.consultation.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 4. 관리자 대시보드 화면 렌더링
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">상담 신청 내역 📊</h1>
          <a href="/" className="text-blue-600 hover:underline">← 메인으로</a>
        </div>

        <div className="grid gap-4">
          {consultations.length === 0 ? (
            <p className="text-gray-500 text-center py-10">아직 들어온 상담이 없습니다.</p>
          ) : (
            consultations.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.customerName || "이름 없음"}</h3>
                    <p className="text-gray-500 text-sm">{item.phone}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm mb-4">
                  {item.content}
                </p>

                {/* 사진이 있으면 보여주기 */}
                {item.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">첨부 사진:</p>
                    <img 
                      src={item.imageUrl} 
                      alt="첨부파일" 
                      className="w-32 h-32 object-cover rounded-lg border" 
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}