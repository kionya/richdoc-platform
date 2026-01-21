import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 기존 데이터가 있으면 충돌나니까 확인 (또는 삭제)
  // 여기서는 seed가 실행될 땐 보통 빈 DB라고 가정하고 그냥 넣습니다.
  
  // 2. 병원 5개 데이터 심기
  await prisma.hospital.createMany({
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
    ],
  });

  console.log('🌱 병원 데이터 5개 심기 완료!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });