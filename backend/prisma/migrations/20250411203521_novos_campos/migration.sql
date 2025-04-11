-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `bairro` VARCHAR(191) NOT NULL DEFAULT 'Não informado',
    ADD COLUMN `cep` VARCHAR(191) NOT NULL DEFAULT '00000-000',
    ADD COLUMN `cidade` VARCHAR(191) NOT NULL DEFAULT 'Não informado',
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `credito` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `endereco` VARCHAR(191) NOT NULL DEFAULT 'Não informado',
    MODIFY `inscricaoEstadual` VARCHAR(191) NULL;
