import { db } from "@/lib/db";
import { updateStatus } from "./actions";

export default async function AdminPage() {
  // 1. 모든 상담 내역을 최신순으로 가져오기 (병원 정보, 유저 정보 포함)
  const leads = await db.lead.findMany({
    include: {
      hospital: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🏥 통합 관리자 대시보드</h1>
          <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600">
            총 접수: <strong>{leads.length}</strong>건
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">접수일 / 번호</th>
                <th className="p-4 font-semibold text-gray-600">환자 정보</th>
                <th className="p-4 font-semibold text-gray-600">사진</th>
                <th className="p-4 font-semibold text-gray-600">고민 내용</th>
                <th className="p-4 font-semibold text-gray-600">신청 병원</th>
                <th className="p-4 font-semibold text-gray-600">현재 상태</th>
                <th className="p-4 font-semibold text-gray-600">관리 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-mono text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                    <div className="font-bold text-blue-600">{lead.referralCode}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="font-medium">{lead.user.name}</div>
                    <div className="text-sm text-gray-400">{lead.user.phone}</div>
                  </td>

                  <td className="p-4">
                    {lead.photo ? (
                      <img 
                        src={lead.photo} 
                        alt="환자 사진" 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:scale-150 transition-transform cursor-pointer"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">없음</span>
                    )}
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="truncate text-gray-600" title={lead.concern || ""}>
                      {lead.concern}
                    </p>
                  </td>

                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                      {lead.hospital?.name || "미지정"}
                    </span>
                  </td>

                  <td className="p-4">
                    {lead.status === "PENDING" && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">대기중</span>
                    )}
                    {lead.status === "CONFIRMED" && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">예약확정</span>
                    )}
                    {lead.status === "VISITED" && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">내원완료</span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* 예약 확정 버튼 */}
                      {lead.status === "PENDING" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="newStatus" value="CONFIRMED" />
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition">
                            확정하기
                          </button>
                        </form>
                      )}

                      {/* 내원 완료 버튼 */}
                      {lead.status === "CONFIRMED" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="newStatus" value="VISITED" />
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition">
                            내원처리
                          </button>
                        </form>
                      )}
                      
                      {lead.status === "VISITED" && (
                        <span className="text-gray-400 text-sm">완료됨</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    아직 접수된 상담 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}