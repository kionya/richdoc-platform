// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 데이터 심기 시작...')

  // 1. 기존 데이터 삭제 (중복 방지)
  // 순서 중요: 자식(Lead, Treatment)부터 지우고 부모(User, Hospital)를 지워야 에러가 안 남
  await prisma.settlement.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.treatment.deleteMany()
  await prisma.hospital.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ 기존 데이터 청소 완료')

  // 2. 가짜 병원 3개 만들기
  const hospitalA = await prisma.hospital.create({
    data: {
      name: '리쥬엘 성형외과',
      location: '서울시 강남구 논현동',
      description: '눈/코 재수술 전문, 20년 경력',
      isPartner: true, // 제휴 병원
      commission: 15.0,
      treatments: {
        create: [
          {
            name: '자연유착 쌍꺼풀',
            category: 'EYE',
            priceMin: 1200000,
            priceMax: 1500000,
            description: '흉터 없이 자연스러운 라인',
          },
          {
            name: '코 전체 성형 (실리콘+귀연골)',
            category: 'NOSE',
            priceMin: 3500000,
            priceMax: 4500000,
            description: '자려한 코 라인 완성',
          },
        ],
      },
    },
  })

  const hospitalB = await prisma.hospital.create({
    data: {
      name: '고운몸 피부과',
      location: '서울시 서초구 서초동',
      description: '프리미엄 안티에이징 센터',
      isPartner: true,
      commission: 12.0,
      treatments: {
        create: [
          {
            name: '울쎄라 300샷',
            category: 'SKIN',
            priceMin: 990000,
            priceMax: 1200000,
            description: '정품팁 인증, 수면마취 가능',
          },
        ],
      },
    },
  })

  const hospitalC = await prisma.hospital.create({
    data: {
      name: '강남 탑 치과',
      location: '서울시 강남구 역삼동',
      isPartner: false, // 제휴 아님
      treatments: {
        create: [
          {
            name: '원데이 임플란트',
            category: 'DENTAL',
            priceMin: 800000,
            priceMax: 1000000,
          },
        ],
      },
    },
  })

  // 3. 가짜 환자(유저) 2명 만들기
  const user1 = await prisma.user.create({
    data: {
      email: 'patient1@test.com',
      name: '김테스트',
      role: 'PATIENT',
      country: 'KR',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'global_guest@test.com',
      name: 'Jane Doe',
      role: 'PATIENT',
      country: 'US',
    },
  })

  // 4. 가짜 상담(Lead) 데이터 1개 만들기
  await prisma.lead.create({
    data: {
      referralCode: 'RD-2026-TEST01',
      status: 'PENDING',
      concern: '눈이 너무 작아서 고민입니다.',
      userId: user1.id,
      hospitalId: hospitalA.id, // 리쥬엘 성형외과에 문의
    },
  })

  console.log('🌳 데이터 심기 완료! (병원 3개, 환자 2명, 상담 1건)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })