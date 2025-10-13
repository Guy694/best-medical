-- เพิ่ม column orderCode, paymentMethod, trackingNumber ถ้ายังไม่มี
ALTER TABLE `order` ADD COLUMN orderCode VARCHAR(50) UNIQUE;
ALTER TABLE `order` ADD COLUMN paymentMethod VARCHAR(100);
ALTER TABLE `order` ADD COLUMN trackingNumber VARCHAR(100);

-- เพิ่ม column price ใน orderitem ถ้ายังไม่มี
ALTER TABLE `orderitem` ADD COLUMN price DECIMAL(10,2);

-- สร้าง orderCode สำหรับ orders ที่มีอยู่แล้ว
UPDATE `order` SET orderCode = CONCAT('ORD-2024-', LPAD(id, 3, '0')) WHERE orderCode IS NULL;

-- เพิ่มข้อมูลตัวอย่างสำหรับทดสอบ (ใช้ userId ที่มีอยู่)
INSERT INTO `order` (userId, totalPrice, status, orderCode, shippingAddress, paymentMethod, trackingNumber) VALUES
(1, 1250.00, 'PENDING', 'ORD-2024-101', '123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110', 'โอนผ่านธนาคาร', NULL),
(1, 2800.00, 'PAID', 'ORD-2024-102', '456 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400', 'บัตรเครดิต', NULL),
(1, 3500.00, 'SHIPPING', 'ORD-2024-103', '789 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', 'โอนผ่านธนาคาร', 'TH1234567890'),
(1, 950.00, 'COMPLETED', 'ORD-2024-104', '321 ถ.ลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230', 'เก็บเงินปลายทาง', 'TH0987654321'),
(1, 1800.00, 'CANCELLED', 'ORD-2024-105', '654 ถ.บางนา แขวงบางนา เขตบางนา กรุงเทพฯ 10260', 'โอนผ่านธนาคาร', NULL);

-- เพิ่ม order items สำหรับทดสอบ (ใช้ productId ที่มีอยู่)
INSERT INTO orderitem (orderId, productId, quantity, price) VALUES
-- สำหรับ ORD-2024-101 (PENDING)
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-101'), 1, 2, 500.00),
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-101'), 2, 1, 250.00),

-- สำหรับ ORD-2024-102 (PAID)
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-102'), 1, 1, 1200.00),
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-102'), 2, 3, 533.33),

-- สำหรับ ORD-2024-103 (SHIPPING)
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-103'), 1, 5, 700.00),

-- สำหรับ ORD-2024-104 (COMPLETED)
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-104'), 2, 1, 950.00),

-- สำหรับ ORD-2024-105 (CANCELLED)
((SELECT id FROM `order` WHERE orderCode = 'ORD-2024-105'), 1, 1, 1800.00);