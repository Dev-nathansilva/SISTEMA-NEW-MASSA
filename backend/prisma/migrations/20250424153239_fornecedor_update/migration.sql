-- AlterTable
ALTER TABLE `fornecedor` MODIFY `endereco` VARCHAR(191) NULL,
    MODIFY `bairro` VARCHAR(191) NULL,
    MODIFY `cep` VARCHAR(191) NULL,
    MODIFY `nomeTitular` VARCHAR(191) NULL,
    MODIFY `limiteCredito` DOUBLE NULL,
    MODIFY `condicoesPagamento` VARCHAR(191) NULL;
