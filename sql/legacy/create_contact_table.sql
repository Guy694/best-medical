-- สร้างตาราง contact สำหรับเก็บข้อความจากลูกค้า
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'ชื่อ-นามสกุล',
  `email` varchar(255) NOT NULL COMMENT 'อีเมล',
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `article` varchar(100) NOT NULL COMMENT 'หัวข้อ',
  `detail` text NOT NULL COMMENT 'รายละเอียดข้อความ',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง',
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อความติดต่อจากลูกค้า';