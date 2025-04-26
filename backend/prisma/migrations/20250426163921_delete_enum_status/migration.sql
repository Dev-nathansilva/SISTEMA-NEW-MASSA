/*
  Warnings:

  - You are about to alter the column `status` on the `fornecedor` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `TinyInt`.
  - You are about to alter the column `status` on the `vendedor` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `fornecedor` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `vendedor` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
