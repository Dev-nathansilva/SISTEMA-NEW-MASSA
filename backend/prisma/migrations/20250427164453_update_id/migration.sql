/*
  Warnings:

  - You are about to alter the column `produtoId` on the `composicao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `componenteId` on the `composicao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `produtoId` on the `fornecedorproduto` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `produto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `produto` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `composicao` DROP FOREIGN KEY `Composicao_componenteId_fkey`;

-- DropForeignKey
ALTER TABLE `composicao` DROP FOREIGN KEY `Composicao_produtoId_fkey`;

-- DropForeignKey
ALTER TABLE `fornecedorproduto` DROP FOREIGN KEY `FornecedorProduto_produtoId_fkey`;

-- DropIndex
DROP INDEX `Composicao_componenteId_fkey` ON `composicao`;

-- DropIndex
DROP INDEX `Composicao_produtoId_fkey` ON `composicao`;

-- AlterTable
ALTER TABLE `composicao` MODIFY `produtoId` INTEGER NOT NULL,
    MODIFY `componenteId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `fornecedorproduto` MODIFY `produtoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `produto` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Composicao` ADD CONSTRAINT `Composicao_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Composicao` ADD CONSTRAINT `Composicao_componenteId_fkey` FOREIGN KEY (`componenteId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FornecedorProduto` ADD CONSTRAINT `FornecedorProduto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
