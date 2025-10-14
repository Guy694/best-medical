-- สร้างตาราง order_status_history สำหรับเก็บประวัติการเปลี่ยนแปลงสถานะคำสั่งซื้อ

-- ลบตารางเก่า (ถ้ามี)
DROP TABLE IF EXISTS `order_status_history`;

CREATE TABLE `order_status_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL COMMENT 'FK to order table (order_id)',
  `order_code` VARCHAR(60) NOT NULL COMMENT 'รหัสคำสั่งซื้อ (เพื่อความสะดวกในการค้นหา)',
  `status` ENUM('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NOT NULL COMMENT 'สถานะ',
  `previous_status` ENUM('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NULL COMMENT 'สถานะก่อนหน้า',
  `note` TEXT NULL COMMENT 'หมายเหตุ/รายละเอียดเพิ่มเติม',
  `changed_by` VARCHAR(100) NULL COMMENT 'ผู้ดำเนินการ (admin/system/customer)',
  `changed_by_user_id` INT(11) NULL COMMENT 'FK to users table (ถ้ามี)',
  `tracking_number` VARCHAR(100) NULL COMMENT 'เลขพัสดุ (ใช้เมื่อสถานะเป็น SHIPPING)',
  `shipping_company` VARCHAR(100) NULL COMMENT 'บริษัทขนส่ง',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันเวลาที่เปลี่ยนสถานะ',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_code` (`order_code`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_order_status_history_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='ตารางเก็บประวัติการเปลี่ยนแปลงสถานะคำสั่งซื้อ';

-- สร้าง Index เพิ่มเติมเพื่อความเร็ว
CREATE INDEX idx_order_status_lookup ON order_status_history(order_code, created_at DESC);

-- ตัวอย่างข้อมูล (ใช้ order_id จริงจากตาราง order)
INSERT INTO order_status_history (order_id, order_code, status, previous_status, note, changed_by, created_at) VALUES
-- คำสั่งซื้อที่ 26 (PENDING)
(26, 'ORD1760454643114', 'PENDING', NULL, 'คำสั่งซื้อถูกสร้าง', 'system', '2025-10-14 22:10:43'),

-- คำสั่งซื้อที่ 25 (PENDING)
(25, 'ORD1760454216551', 'PENDING', NULL, 'คำสั่งซื้อถูกสร้าง', 'system', '2025-10-14 22:03:35'),

-- คำสั่งซื้อที่ 20 (COMPLETED) - แสดงประวัติทั้งหมด
(20, 'ORD1759935326199', 'PENDING', NULL, 'คำสั่งซื้อถูกสร้าง', 'system', '2025-10-08 21:55:26'),
(20, 'ORD1759935326199', 'PAID', 'PENDING', 'ลูกค้าชำระเงินเรียบร้อย', 'customer', '2025-10-08 22:00:00'),
(20, 'ORD1759935326199', 'SHIPPING', 'PAID', 'เตรียมจัดส่งสินค้า', 'admin', '2025-10-09 09:00:00'),
(20, 'ORD1759935326199', 'COMPLETED', 'SHIPPING', 'จัดส่งสำเร็จ', 'system', '2025-10-10 14:30:00'),

-- คำสั่งซื้อที่ 21 (COMPLETED)
(21, 'ORD1759985791767', 'PENDING', NULL, 'คำสั่งซื้อถูกสร้าง', 'system', '2025-10-09 11:56:31'),
(21, 'ORD1759985791767', 'PAID', 'PENDING', 'ลูกค้าชำระเงินเรียบร้อย', 'customer', '2025-10-09 12:15:00'),
(21, 'ORD1759985791767', 'SHIPPING', 'PAID', 'เตรียมจัดส่งสินค้า', 'admin', '2025-10-09 15:00:00'),
(21, 'ORD1759985791767', 'COMPLETED', 'SHIPPING', 'จัดส่งสำเร็จ', 'system', '2025-10-10 10:20:00');

-- Trigger เพื่อบันทึกประวัติอัตโนมัติเมื่อมีการเปลี่ยนสถานะ
DROP TRIGGER IF EXISTS after_order_status_update;

DELIMITER $$

CREATE TRIGGER after_order_status_update
AFTER UPDATE ON `order`
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO order_status_history (
      order_id, 
      order_code, 
      status, 
      previous_status, 
      note, 
      changed_by,
      created_at
    ) VALUES (
      NEW.order_id,
      NEW.order_code,
      NEW.status,
      OLD.status,
      CONCAT('สถานะเปลี่ยนจาก ', OLD.status, ' เป็น ', NEW.status),
      'system',
      NOW()
    );
  END IF;
END$$

DELIMITER ;
