-- เพิ่ม columns สำหรับการแจ้งชำระเงิน
ALTER TABLE `order` 
ADD COLUMN paidAdate DATE NULL COMMENT 'วันที่ชำระเงิน',
ADD COLUMN paidAtime TIME NULL COMMENT 'เวลาที่ชำระเงิน',
ADD COLUMN transfer_slip VARCHAR(255) NULL COMMENT 'หลักฐานการโอนหรือเลขอ้างอิง',
ADD COLUMN bank_account VARCHAR(100) NULL COMMENT 'บัญชีธนาคารที่โอนเข้า';

-- สร้าง table สำหรับ log การแจ้งชำระเงิน (optional)
CREATE TABLE IF NOT EXISTS payment_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transfer_date DATE NOT NULL,
    transfer_time TIME NOT NULL,
    bank_account VARCHAR(100),
    transfer_slip VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_code (order_code),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- อัพเดต enum สถานะให้รองรับ PAID (ถ้ายังไม่มี)
-- ALTER TABLE `order` MODIFY COLUMN status ENUM('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING';