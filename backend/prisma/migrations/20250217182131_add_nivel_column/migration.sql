-- AlterTable
ALTER TABLE `user` ADD COLUMN `nivel` ENUM('admin', 'vendedor', 'padrao') NOT NULL DEFAULT 'padrao';
