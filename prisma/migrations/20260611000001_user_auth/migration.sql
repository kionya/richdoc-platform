-- User 인증 확장(passwordHash/hospitalId/status) — 기존 User 비어있음, password DROP 안전

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "hospitalId" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_hospitalId_idx" ON "User"("hospitalId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
