-- 병원 등급(tier) + 혜택(benefits) 추가, default 있어 기존 행 자동 채움
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "benefits" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'RECOMMENDED';

-- CreateIndex
CREATE INDEX "Hospital_tier_idx" ON "Hospital"("tier");
