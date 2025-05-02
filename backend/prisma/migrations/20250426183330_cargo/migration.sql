/*
  Warnings:

  - You are about to alter the column `cargo` on the `funcionario` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `funcionario` MODIFY `cargo` VARCHAR(191) NULL;
