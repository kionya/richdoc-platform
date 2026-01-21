"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 👇 함수 이름이 'createConsultation' 이어야 합니다!
export async function createConsultation(formData: FormData) {
  const phone = formData.get("phone") as string;
  const content = formData.get("content") as string;
  const customerName = (formData.get("customerName") as string) || "익명 고객";
  
  // 필수값 체크
  if (!phone || !content) {
    return;
  }

  try {
    // DB에 저장
    await db.consultation.create({
      data: {
        phone,
        content,
        customerName,
      },
    });

    // 관리자 페이지 새로고침
    revalidatePath("/admin");
    
  } catch (error) {
    console.error("에러 발생:", error);
  }

  // 성공하면 메인으로 이동 (또는 성공 페이지)
  redirect("/");
}