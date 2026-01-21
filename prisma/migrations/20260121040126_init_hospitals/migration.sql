/*
  Warnings:

  - You are about to drop the column `commission` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `isPartner` on the `Hospital` table. All the data in the column will be lost.
  - Added the required column `desc` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Hospital` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "commission",
DROP COLUMN "description",
DROP COLUMN "isPartner",
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviews" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
