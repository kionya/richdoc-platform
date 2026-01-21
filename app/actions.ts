"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. 상담 신청 저장하기
export async function createConsultation(formData: FormData) {
  const phone = formData.get("phone") as string;
  const content = formData.get("content") as string;
  const customerName = (formData.get("customerName") as string) || "익명 고객";
  
  if (!phone) return;

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
    console.error("상담 신청 에러:", error);
  }
  
  redirect("/");
}

// 2. 병원 목록 가져오기 (안전 모드)
export async function getHospitals() {
  try {
    const hospitals = await db.hospital.findMany({
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        location: true,
        tags: true,
        rating: true,
        reviews: true,
        image: true,
        desc: true,
      }
    });
    // 데이터 가공 (null 방지)
    return hospitals.map(h => ({
      ...h,
      tags: h.tags || "",
      image: h.image || "",
    }));
  } catch (error) {
    console.error("병원 목록 로딩 실패:", error);
    return [];
  }
}

// 3. 병원 상세 정보 가져오기 (상세 페이지용)
export async function getHospitalById(id: string) {
  try {
    const hospital = await db.hospital.findUnique({
      where: { id },
      include: {
        userReviews: { orderBy: { createdAt: 'desc' } },
        doctors: true,
        menus: true,   // 👈 ⭐ 이 줄이 없으면 가격표가 절대 안 나옵니다! 꼭 확인하세요!
      },
    });
    return hospital;
  } catch (error) {
    console.error("상세 정보 로딩 실패:", error);
    return null;
  }
}

// 4. 리뷰 작성하기
export async function addReview(hospitalId: string, userName: string, rating: number, content: string) {
  try {
    await db.review.create({
      data: {
        hospitalId,
        userName,
        rating,
        content,
      },
    });
    revalidatePath(`/hospitals/${hospitalId}`);
  } catch (error) {
    console.error("리뷰 작성 실패:", error);
  }
}

// 5. 초기 데이터 넣기 (한 방에 묶어서 생성 - 누락 방지!)
export async function seedInitialHospitals() {
  const count = await db.hospital.count();
  if (count > 0) return;

  // 1. 기존 데이터 싹 지우기 (충돌 방지)
  try {
    await db.menu.deleteMany();
    await db.doctor.deleteMany();
    await db.review.deleteMany();
    await db.hospital.deleteMany();
  } catch (e) {
    console.log("삭제 중 에러(무시 가능):", e);
  }

  // 2. 리쥬엘의원 (병원 + 의사 + 메뉴 한 번에 생성)
  await db.hospital.create({
    data: {
      id: "hospital-1",
      name: "리쥬엘의원 강남점",
      location: "서울 강남구 강남대로",
      tags: "리프팅,피부관리,보톡스",
      rating: 4.9,
      reviews: 152,
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      desc: "당신의 피부를 위한 프리미엄 솔루션, 리쥬엘입니다.",
      doctors: {
        create: [
          { name: "신현진 대표원장", specialty: "피부과 전문의 / 안티에이징" },
          { name: "김지수 원장", specialty: "쁘띠성형 / 레이저 센터장" }
        ]
      },
      menus: {
        create: [
          { name: "슈링크 유니버스 300샷", price: "15만원" },
          { name: "포텐자 (펌핑팁 포함)", price: "25만원" },
          { name: "프리미엄 리쥬란 힐러 2cc", price: "29만원" }
        ]
      }
    }
  });

  // 3. 고운몸의원
  await db.hospital.create({
    data: {
      id: "hospital-2",
      name: "고운몸의원",
      location: "서울 강남구 테헤란로",
      tags: "다이어트,체형교정,지방분해",
      rating: 4.8,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80",
      desc: "건강하고 아름다운 바디라인을 약속합니다.",
      doctors: {
        create: [
          { name: "김희경 대표원장", specialty: "가정의학과 전문의 / 비만클리닉" }
        ]
      },
      menus: {
        create: [
          { name: "MPPL 지방분해 주사 (1세트)", price: "9.9만원" },
          { name: "바디 인모드 (FX+FORMA)", price: "35만원" },
          { name: "삭센다 처방 (1펜)", price: "12만원" }
        ]
      }
    }
  });

  // 4. 바노바기
  await db.hospital.create({
    data: {
      id: "hospital-3",
      name: "바노바기성형외과",
      location: "서울 강남구 논현로",
      tags: "안면윤곽,양악수술,가슴성형",
      rating: 5.0,
      reviews: 320,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      desc: "디테일이 다른 아름다움, 바노바기입니다.",
      doctors: {
        create: [
          { name: "반재상 대표원장", specialty: "성형외과 전문의 / 가슴·바디" },
          { name: "오창현 대표원장", specialty: "성형외과 전문의 / 안면윤곽" }
        ]
      },
      menus: {
        create: [
          { name: "모티바 가슴성형", price: "900만원~" },
          { name: "안면윤곽 3종 (광대+사각+턱)", price: "1,200만원~" }
        ]
      }
    }
  });

  // 5. 바이브
  await db.hospital.create({
    data: {
      id: "hospital-4",
      name: "바이브성형외과",
      location: "서울 강남구 도산대로",
      tags: "눈성형,코성형,트렌디",
      rating: 4.7,
      reviews: 85,
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
      desc: "나만의 분위기를 찾아주는 바이브 성형외과",
      doctors: {
        create: [
          { name: "유영문 대표원장", specialty: "성형외과 전문의 / 눈·코 성형" }
        ]
      },
      menus: {
        create: [
          { name: "자연유착 쌍꺼풀", price: "99만원" },
          { name: "직반버선 코성형", price: "250만원~" }
        ]
      }
    }
  });

  // 6. 삼사오
  await db.hospital.create({
    data: {
      id: "hospital-5",
      name: "삼사오성형외과",
      location: "서울 서초구 강남대로",
      tags: "안전지향,대형병원,종합성형",
      rating: 4.9,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0674503?auto=format&fit=crop&w=800&q=80",
      desc: "365일 4계절 5감 만족, 삼사오성형외과",
      doctors: {
        create: [
          { name: "박종림 대표원장", specialty: "성형외과 전문의 / 거상·안티에이징" },
          { name: "한규남 원장", specialty: "성형외과 전문의 / 눈·코 재수술" }
        ]
      },
      menus: {
        create: [
          { name: "345 딥플레인 안면거상", price: "800만원~" },
          { name: "하안검 수술", price: "150만원" }
        ]
      }
    }
  });

  revalidatePath("/hospitals");
  revalidatePath("/");
}