-- เพิ่ม column delivery และ warranty ในตาราง product

ALTER TABLE `product` 
ADD COLUMN `delivery` DECIMAL(10,2) NULL DEFAULT 0.00 COMMENT 'ค่าจัดส่ง (บาท)' AFTER `imageUrl`,
ADD COLUMN `warranty` INT NULL DEFAULT 0 COMMENT 'ระยะเวลาประกัน (เดือน)' AFTER `delivery`;

-- ตรวจสอบการเปลี่ยนแปลง
DESCRIBE `product`;
