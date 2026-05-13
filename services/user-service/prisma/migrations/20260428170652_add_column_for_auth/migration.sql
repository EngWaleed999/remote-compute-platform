/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `user_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshTokenHash]` on the table `user_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserAction" ADD VALUE 'LOGIN_SUCCESS';
ALTER TYPE "UserAction" ADD VALUE 'LOGIN_FAILURE';
ALTER TYPE "UserAction" ADD VALUE 'USER_REGISTERED';
ALTER TYPE "UserAction" ADD VALUE 'TOKEN_REFRESHED';
ALTER TYPE "UserAction" ADD VALUE 'REFRESH_TOKEN_REUSE';
ALTER TYPE "UserAction" ADD VALUE 'USER_LOGOUT';
ALTER TYPE "UserAction" ADD VALUE 'RESTORE_REQUESTED';
ALTER TYPE "UserAction" ADD VALUE 'ACCOUNT_RESTORED';
ALTER TYPE "UserAction" ADD VALUE 'ALL_SESSIONS_REVOKED';
ALTER TYPE "UserAction" ADD VALUE 'TOKEN_VERSION_BUMPED';

-- DropIndex
DROP INDEX "user_sessions_refreshToken_key";

-- DropIndex
DROP INDEX "user_sessions_token_idx";

-- DropIndex
DROP INDEX "user_sessions_token_key";

-- AlterTable
ALTER TABLE "user_sessions" DROP COLUMN "refreshToken",
DROP COLUMN "token",
ADD COLUMN     "familyId" TEXT,
ADD COLUMN     "refreshTokenHash" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "restoreCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "restoreCodeHash" TEXT,
ADD COLUMN     "restoreCodeUsed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshTokenHash_key" ON "user_sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "user_sessions_familyId_idx" ON "user_sessions"("familyId");

-- CreateIndex
CREATE INDEX "user_sessions_refreshTokenHash_idx" ON "user_sessions"("refreshTokenHash");
