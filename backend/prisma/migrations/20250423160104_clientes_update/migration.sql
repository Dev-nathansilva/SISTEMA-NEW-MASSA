/*
  Warnings:

  - The values [PessoaJuridica] on the enum `Cliente_tipo` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `observacoes` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `tipo` ENUM('PessoaFisica', 'Empresa') NOT NULL,
    MODIFY `bairro` VARCHAR(191) NULL DEFAULT 'Não informado',
    MODIFY `cep` VARCHAR(191) NULL DEFAULT '00000-000',
    MODIFY `cidade` VARCHAR(191) NULL DEFAULT 'Não informado',
    MODIFY `credito` DOUBLE NULL DEFAULT 0.0,
    MODIFY `endereco` VARCHAR(191) NULL DEFAULT 'Não informado';
