/*
  Warnings:

  - Added the required column `json_data` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pages` ADD COLUMN `json_data` JSON NOT NULL;
