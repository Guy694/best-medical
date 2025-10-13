-- เพิ่มคอลัมน์สำหรับเก็บไฟล์หลักฐานการโอนในตาราง order
ALTER TABLE `order` 
ADD COLUMN `transfer_slip_file` VARCHAR(255) NULL COMMENT 'ไฟล์หลักฐานการโอน',
ADD COLUMN `paidAdate` DATE NULL COMMENT 'วันที่โอนเงิน',
ADD COLUMN `paidAtime` TIME NULL COMMENT 'เวลาที่โอนเงิน',
ADD COLUMN `transfer_slip` VARCHAR(255) NULL COMMENT 'เลขที่อ้างอิงการโอน',
ADD COLUMN `bank_account` VARCHAR(100) NULL COMMENT 'บัญชีธนาคารที่โอนเข้า',
ADD COLUMN `orderCode` VARCHAR(50) NULL COMMENT 'รหัสใบสั่งซื้อ';

-- สร้างตาราง payment_notifications สำหรับบันทึกการแจ้งชำระเงิน
CREATE TABLE IF NOT EXISTS `payment_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transfer_date` date NOT NULL,
  `transfer_time` time NOT NULL,
  `bank_account` varchar(100) DEFAULT NULL,
  `transfer_slip` varchar(255) DEFAULT NULL,
  `transfer_slip_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `order_code` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;