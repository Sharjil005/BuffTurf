/*
  Warnings:
  - A unique constraint covering the columns [active_key] on the table bookings will be added. If there are existing duplicate values, this will fail.
*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_time_slot_id_fkey`;
-- DropIndex
DROP INDEX `bookings_time_slot_id_booking_date_key` ON `bookings`;
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `active_key` VARCHAR(191) NULL;
-- CreateIndex
CREATE UNIQUE INDEX `bookings_active_key_key` ON `bookings`(`active_key`);