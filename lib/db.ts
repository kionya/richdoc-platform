// lib/db.ts
import { PrismaClient } from '@prisma/client'

// 전역 변수에 prisma 저장소를 만듭니다 (개발할 때 연결이 자꾸 끊기는 것 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db