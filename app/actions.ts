"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. 상담 신청 저장하기
export async function createConsultation(formData: FormData) {
  const phone = formData.get("phone") as string;
  const content = formData.get("content") as string;
  const customerName = (formData.get("customerName") as string) || "익명 고객";
  
  if (!phone || !content) {
    return;
  }

  try {
    await db.consultation.create({
      data: {
        phone,
        content,
        customerName,
      },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("에러 발생:", error);
  }
  
  // 메인으로 이동
  redirect("/");
}

// 2. 병원 목록 가져오기 (이게 없어서 에러가 났던 겁니다!)
export async function getHospitals() {
  try {
    const hospitals = await db.hospital.findMany({
      orderBy: { rating: 'desc' },
    });
    return hospitals;
  } catch (error) {
    console.error("병원 목록 불러오기 실패:", error);
    return [];
  }
}

// 3. 초기 데이터(병원 5개) 넣기
export async function seedInitialHospitals() {
  const count = await db.hospital.count();
  if (count > 0) return; // 데이터가 있으면 중복 생성 방지

  await db.hospital.createMany({
    data: [
      {
        name: "리쥬엘의원 강남점",
        location: "서울 강남구 강남대로",
        tags: "리프팅,피부관리,보톡스",
        rating: 4.9,
        reviews: 152,
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
        desc: "당신의 피부를 위한 프리미엄 솔루션, 리쥬엘입니다."
      },
      {
        name: "고운몸의원",
        location: "서울 강남구 테헤란로",
        tags: "다이어트,체형교정,지방분해",
        rating: 4.8,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80",
        desc: "건강하고 아름다운 바디라인을 약속합니다."
      },
      {
        name: "바노바기성형외과",
        location: "서울 강남구 논현로",
        tags: "안면윤곽,양악수술,가슴성형",
        rating: 5.0,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        desc: "디테일이 다른 아름다움, 바노바기입니다."
      },
      {
        name: "바이브성형외과",
        location: "서울 강남구 도산대로",
        tags: "눈성형,코성형,트렌디",
        rating: 4.7,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
        desc: "나만의 분위기를 찾아주는 바이브 성형외과"
      },
      {
        name: "삼사오성형외과",
        location: "서울 서초구 강남대로",
        tags: "안전지향,대형병원,종합성형",
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1516549655169-df83a0674503?auto=format&fit=crop&w=800&q=80",
        desc: "365일 4계절 5감 만족, 삼사오성형외과"
      },
    ]
  });
}