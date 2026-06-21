/*
  Warnings:

  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `pages_user_id_fkey`;

-- DropTable
DROP TABLE `pages`;

-- CreateTable
CREATE TABLE `websites` (
    `id` VARCHAR(191) NOT NULL,
    `subdomain_name` VARCHAR(191) NOT NULL,
    `custom_domain` VARCHAR(191) NULL,
    `json_data` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLIC') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `websites_subdomain_name_key`(`subdomain_name`),
    UNIQUE INDEX `websites_custom_domain_key`(`custom_domain`),
    INDEX `websites_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `websites` ADD CONSTRAINT `websites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
