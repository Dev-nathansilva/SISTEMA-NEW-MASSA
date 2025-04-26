/*
  Warnings:

  - You are about to alter the column `status` on the `cliente` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `cliente` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
