/*
  Warnings:

  - You are about to alter the column `formato` on the `produto` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - Added the required column `origem` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `baseCalculo` DOUBLE NULL,
    ADD COLUMN `cest` VARCHAR(191) NULL,
    ADD COLUMN `codigoSKU` VARCHAR(191) NULL,
    ADD COLUMN `csosn` VARCHAR(191) NULL,
    ADD COLUMN `cstCofins` VARCHAR(191) NULL,
    ADD COLUMN `cstPis` VARCHAR(191) NULL,
    ADD COLUMN `icmsInterno` DOUBLE NULL,
    ADD COLUMN `ipi` DOUBLE NULL,
    ADD COLUMN `ncm` VARCHAR(191) NULL,
    ADD COLUMN `origem` VARCHAR(191) NOT NULL,
    ADD COLUMN `pesoBruto` DOUBLE NULL,
    ADD COLUMN `pesoLiquido` DOUBLE NULL,
    MODIFY `formato` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Composicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` VARCHAR(191) NOT NULL,
    `componenteId` VARCHAR(191) NOT NULL,
    `quantidade` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FornecedorProduto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` VARCHAR(191) NOT NULL,
    `fornecedorId` INTEGER NOT NULL,

    UNIQUE INDEX `FornecedorProduto_produtoId_fornecedorId_key`(`produtoId`, `fornecedorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Composicao` ADD CONSTRAINT `Composicao_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Composicao` ADD CONSTRAINT `Composicao_componenteId_fkey` FOREIGN KEY (`componenteId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FornecedorProduto` ADD CONSTRAINT `FornecedorProduto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FornecedorProduto` ADD CONSTRAINT `FornecedorProduto_fornecedorId_fkey` FOREIGN KEY (`fornecedorId`) REFERENCES `Fornecedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
