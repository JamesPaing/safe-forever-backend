-- AlterTable
ALTER TABLE `sessions` ADD COLUMN `user_agent` VARCHAR(255) NULL,
    ADD COLUMN `valid` BOOLEAN NOT NULL DEFAULT true;
