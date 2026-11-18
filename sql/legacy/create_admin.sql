-- สร้าง admin user สำหรับทดสอบ
INSERT INTO user (name, email, password, role, verify_token, verified) 
VALUES (
  'Admin Test', 
  'admin@test.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewVyVBXXw8VGYd0u', -- password123
  'ADMIN', 
  1,
  1
);

-- แสดงข้อมูล users ทั้งหมด
SELECT id, name, email, role, verified FROM user;