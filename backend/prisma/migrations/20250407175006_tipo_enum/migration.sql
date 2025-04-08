/*
  Warnings:

  - You are about to alter the column `tipo` on the `cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `cliente` MODIFY `tipo` ENUM('PessoaFisica', 'PessoaJuridica', 'Empresa') NOT NULL;
