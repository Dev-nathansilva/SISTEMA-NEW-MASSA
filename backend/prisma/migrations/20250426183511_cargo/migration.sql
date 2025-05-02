/*
  Warnings:

  - Made the column `cargo` on table `funcionario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `funcionario` MODIFY `cargo` VARCHAR(191) NOT NULL DEFAULT '';
