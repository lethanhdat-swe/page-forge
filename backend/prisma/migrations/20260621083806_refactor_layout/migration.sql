/*
  Warnings:

  - You are about to drop the `master_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_layouts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `master_layouts` DROP FOREIGN KEY `master_layouts_block_id_fkey`;

-- DropTable
DROP TABLE `master_blocks`;

-- DropTable
DROP TABLE `master_layouts`;

-- RenameIndex
ALTER TABLE `pages` RENAME INDEX `pages_user_id_fkey` TO `pages_user_id_idx`;
