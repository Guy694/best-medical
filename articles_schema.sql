-- โครงสร้างตาราง articles สำหรับระบบบทความ/ข่าวสาร
-- สร้างวันที่: 13 ตุลาคม 2025
-- หมายเหตุ: ใช้ email เป็น primary login แทน username

-- สร้างตาราง users ถ้ายังไม่มี (สำหรับ Foreign Key)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL COMMENT 'อีเมลสำหรับเข้าสู่ระบบ',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่านแบบ hash',
  `firstname` varchar(100) DEFAULT NULL COMMENT 'ชื่อจริง',
  `lastname` varchar(100) DEFAULT NULL COMMENT 'นามสกุล',
  `role` enum('customer','staff','admin') NOT NULL DEFAULT 'customer' COMMENT 'สิทธิ์การใช้งาน',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันที่แก้ไขล่าสุด',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางผู้ใช้งาน';

-- เพิ่ม admin user ตัวอย่าง (ถ้ายังไม่มี)
INSERT IGNORE INTO `users` (`id`, `email`, `password`, `firstname`, `lastname`, `role`) VALUES
(1, 'admin@best-medical.com', '$2b$10$sample.hash.password', 'Admin', 'System', 'admin');

-- สร้างตาราง articles

CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT 'หัวข้อบทความ',
  `content` longtext NOT NULL COMMENT 'เนื้อหาบทความ',
  `excerpt` text DEFAULT NULL COMMENT 'สรุปย่อของบทความ',
  `banner` varchar(500) DEFAULT NULL COMMENT 'URL รูปปกบทความ',
  `category` varchar(100) DEFAULT NULL COMMENT 'หมวดหมู่บทความ',
  `status` enum('draft','published','scheduled') NOT NULL DEFAULT 'draft' COMMENT 'สถานะบทความ: draft=แบบร่าง, published=เผยแพร่, scheduled=ตั้งเวลา',
  `views` int(11) NOT NULL DEFAULT 0 COMMENT 'จำนวนการดู',
  `author_id` int(11) NOT NULL COMMENT 'ID ของผู้เขียน (FK จาก users)',
  `published_at` datetime DEFAULT NULL COMMENT 'วันที่เผยแพร่/ตั้งเวลาเผยแพร่',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันที่แก้ไขล่าสุด',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บบทความและข่าวสาร';

-- เพิ่ม Foreign Key หลังจากตารางถูกสร้างแล้ว
ALTER TABLE `articles` ADD CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO `articles` (`title`, `content`, `excerpt`, `category`, `status`, `author_id`, `published_at`) VALUES
('การเลือกซื้อเครื่องวัดความดันโลหิตที่เหมาะสม', 
'การเลือกซื้อเครื่องวัดความดันโลหิตเป็นเรื่องสำคัญสำหรับการดูแลสุขภาพ เครื่องวัดความดันโลหิตที่ดีควรมีความแม่นยำสูง ใช้งานง่าย และได้รับการรับรองมาตรฐาน

ปัจจัยที่ควรพิจารณา:
1. ความแม่นยำ - เลือกเครื่องที่ผ่านการรับรองจากองค์กรสุขภาพ
2. ขนาดที่เหมาะสม - วัดรอบแขนให้ถูกต้อง
3. การใช้งาน - ควรเป็นแบบดิจิตอลที่อ่านง่าย
4. ความทนทาน - เลือกยี่ห้อที่มีประกันและบริการหลังการขาย

การใช้งานอย่างถูกต้อง:
- นั่งพักผ่อน 5 นิก่อนวัด
- วางแขนในระดับเดียวกับหัวใจ
- ไม่พูดคุยระหว่างการวัด
- วัดติดต่อกัน 2-3 ครั้ง แล้วเอาค่าเฉลี่ย

สำหรับผู้ป่วยความดันโลหิตสูง ควรวัดความดันอย่างสม่ำเสมอและบันทึกผลเพื่อติดตามอาการ', 
'คู่มือการเลือกซื้อเครื่องวัดความดันโลหิตที่เหมาะสมสำหรับการใช้งานในครอบครัว พร้อมวิธีการใช้งานที่ถูกต้อง', 
'เครื่องมือแพทย์', 
'published', 
1, 
NOW()),

('5 วิธีดูแลสุขภาพในหน้าหนาว', 
'ฤดูหนาวเป็นช่วงเวลาที่ร่างกายต้องการการดูแลเป็นพิเศษ เนื่องจากอากาศหนาวเย็นอาจส่งผลต่อระบบภูมิคุ้มกันและสุขภาพโดยรวม

5 วิธีดูแลสุขภาพในหน้าหนาว:

1. ดื่มน้ำให้เพียงพอ
แม้อากาศจะหนาว แต่ร่างกายยังคงต้องการน้ำเพื่อการทำงานที่เหมาะสม ดื่มน้ำอุ่นหรือชาสมุนไพรจะช่วยให้ร่างกายอบอุ่น

2. รับประทานอาหารที่มีวิตามินซี
ส้ม มะนาว กีวี่ และผักใบเขียวจะช่วยเสริมภูมิคุ้มกัน

3. ออกกำลังกายสม่ำเสมอ
แม้อากาศหนาว แต่การออกกำลังกายยังคงสำคัญ เลือกกิจกรรมในร่มเช่น โยคะ หรือการเต้น

4. นอนหลับให้เพียงพอ
การนอนหลับ 7-8 ชั่วโมงจะช่วยให้ร่างกายฟื้นฟูและเสริมภูมิคุ้มกัน

5. สวมใส่เสื้อผ้าให้อบอุ่น
ป้องกันการสูญเสียความร้อนจากร่างกาย โดยเฉพาะบริเวณหัว มือ และเท้า

การดูแลสุขภาพในฤดูหนาวที่ดีจะช่วยให้คุณผ่านพ้นช่วงเวลานี้ไปได้อย่างมีสุขภาพดี', 
'5 วิธีง่ายๆ ในการดูแลสุขภาพช่วงฤดูหนาว เพื่อให้ร่างกายแข็งแรงและมีภูมิคุ้มกันที่ดี', 
'สุขภาพ', 
'published', 
1, 
NOW()),

('ข่าวสาร: โปรโมชั่นเครื่องมือแพทย์ลดราคา 30%', 
'ประกาศข่าวดี! Best Medical ขอประกาศโปรโมชั่นพิเศษสำหรับลูกค้าทุกท่าน

🎉 โปรโมชั่นเครื่องมือแพทย์ลดราคาสูงสุด 30%
📅 ระยะเวลา: 15-30 ตุลาคม 2025
🏷️ สินค้าในโปรโมชั่น:
- เครื่องวัดความดันโลหิต
- เครื่องวัดระดับน้ำตาลในเลือด
- เครื่องวัดอุณหภูมิดิจิตอล
- หน้ากากออกซิเจน
- อุปกรณ์ดูแลผู้ป่วยติดเตียง

💳 เงื่อนไขโปรโมชั่น:
- ซื้อขั้นต่ำ 1,000 บาท รับส่วนลด 10%
- ซื้อขั้นต่ำ 3,000 บาท รับส่วนลด 20%
- ซื้อขั้นต่ำ 5,000 บาท รับส่วนลด 30%

🚚 ส่งฟรีทั่วประเทศสำหรับยอดซื้อตั้งแต่ 2,000 บาทขึ้นไป

📞 สั่งซื้อได้ที่:
- เว็บไซต์: www.best-medical.com
- โทร: 02-123-4567
- Line: @bestmedical

อย่าพลาดโอกาสดีนี้ เพราะของมีจำนวนจำกัด!', 
'โปรโมชั่นพิเศษลดราคาสูงสุด 30% สำหรับเครื่องมือแพทย์คุณภาพ ระหว่างวันที่ 15-30 ตุลาคม 2025', 
'ข่าวสาร', 
'published', 
1, 
NOW() - INTERVAL 1 DAY);

-- เพิ่มข้อมูลสำหรับทดสอบการตั้งเวลา (บทความที่จะเผยแพร่ในอนาคต)
INSERT INTO `articles` (`title`, `content`, `excerpt`, `category`, `status`, `author_id`, `published_at`) VALUES
('เทคโนโลยีใหม่ในการวินิจฉัยโรค 2026', 
'เทคโนโลยีการแพทย์กำลังพัฒนาไปอย่างรวดเร็ว ในปี 2026 เราจะได้เห็นนวัตกรรมใหม่ๆ ที่จะช่วยให้การวินิจฉัยโรคแม่นยำและรวดเร็วยิ่งขึ้น...', 
'ติดตามเทคโนโลยีการแพทย์ล่าสุดที่จะเปลี่ยนแปลงวงการแพทย์ในอนาคต', 
'เทคโนโลยี', 
'scheduled', 
1, 
'2025-12-01 09:00:00');

-- คำสั่งสำหรับอัปเดตตาราง (ถ้าตารางมีอยู่แล้ว)
-- ALTER TABLE `articles` ADD COLUMN `views` int(11) NOT NULL DEFAULT 0 COMMENT 'จำนวนการดู' AFTER `status`;
-- ALTER TABLE `articles` ADD COLUMN `published_at` datetime DEFAULT NULL COMMENT 'วันที่เผยแพร่/ตั้งเวลาเผยแพร่' AFTER `author_id`;
-- ALTER TABLE `articles` ADD INDEX `idx_status` (`status`);
-- ALTER TABLE `articles` ADD INDEX `idx_category` (`category`);
-- ALTER TABLE `articles` ADD INDEX `idx_published_at` (`published_at`);