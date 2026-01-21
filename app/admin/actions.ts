"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createConsultation(formData: FormData) {
  // 1. 폼에서 데이터 꺼내기
  const phone = formData.get("phone") as string;
  const content = formData.get("content") as string;
  const customerName = (formData.get("customerName") as string) || "익명 고객";
  
  // (사진은 일단 없으면 통과)
  const file = formData.get("file") as File; 
  let imageUrl = ""; 

  // 2. 데이터 유효성 검사 (전화번호 없으면 저장 안 함)
  if (!phone || !content) {
    console.log("❌ 필수 정보 누락");
    return;
  }

  try {
    // 3. 진짜 데이터베이스에 저장하기 (여기가 핵심!)
    await db.consultation.create({
      data: {
        phone: phone,
        content: content,
        customerName: customerName,
        imageUrl: imageUrl, // 사진 기능은 나중에 붙여도 됨
      },
    });

    console.log("✅ 상담 신청 저장 완료!");

    // 4. 관리자 페이지가 바로 최신화되도록 새로고침
    revalidatePath("/admin");

  } catch (error) {
    console.error("🔥 저장 중 에러 발생:", error);
    // 에러가 나도 일단 멈추지 않게 처리
  }

  // 5. 성공 페이지로 이동
  redirect("/success"); // 성공 페이지가 없다면 이 줄은 지우셔도 됩니다.
}