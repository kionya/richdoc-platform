-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "customerName" TEXT,
    "phone" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);
