-- AlterTable
ALTER TABLE `cliente` MODIFY `tipo` ENUM('PessoaFisica', 'Empresa') NOT NULL DEFAULT 'Empresa';

-- AlterTable
ALTER TABLE `funcionario` ADD COLUMN `cargo` ENUM('Gerente', 'Assistente', 'Caminhoneiro', 'Analista') NOT NULL DEFAULT 'Analista';
