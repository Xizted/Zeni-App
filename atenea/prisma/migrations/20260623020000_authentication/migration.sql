-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";
ALTER TABLE "User" DROP COLUMN "username";
