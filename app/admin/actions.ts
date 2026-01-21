'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 상태를 변경하는 핵심 함수 (버튼 누르면 실행됨)
export async function updateStatus(formData: FormData) {
  const leadId = formData.get("leadId") as string;
  const newStatus = formData.get("newStatus") as string;

  // DB 업데이트
  await db.lead.update({
    where: { id: leadId },
    data: { status: newStatus },
  });

  // 변경된 내용이 화면에 즉시 반영되도록 새로고침
  revalidatePath("/admin");
}