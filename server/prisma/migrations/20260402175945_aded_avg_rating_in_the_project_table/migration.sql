/*
  Warnings:

  - You are about to drop the column `totalRatings` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "avgRating" DECIMAL(2,1) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "totalRatings";
