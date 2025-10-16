#!/bin/bash

# สคริปต์สำหรับตรวจสอบและสร้างโฟลเดอร์ที่จำเป็นสำหรับ upload ไฟล์

echo "🔍 ตรวจสอบโฟลเดอร์สำหรับ upload ไฟล์..."

# กำหนด path ของ project
PROJECT_PATH="."

# สร้างโฟลเดอร์ที่จำเป็น
folders=(
  "public/pdimage"
  "public/categoryimg"
  "public/contact"
  "public/payments"
)

echo ""
echo "📁 สร้างโฟลเดอร์..."

for folder in "${folders[@]}"; do
  FULL_PATH="$PROJECT_PATH/$folder"
  
  if [ -d "$FULL_PATH" ]; then
    echo "✅ $folder - มีอยู่แล้ว"
  else
    mkdir -p "$FULL_PATH"
    echo "✨ $folder - สร้างใหม่"
  fi
done

echo ""
echo "🔐 ตั้งค่า permission..."

# ตั้งค่า permission (755 = rwxr-xr-x)
for folder in "${folders[@]}"; do
  FULL_PATH="$PROJECT_PATH/$folder"
  chmod 755 "$FULL_PATH"
  echo "✅ chmod 755 $folder"
done

echo ""
echo "👤 ตรวจสอบ owner..."

# แสดงข้อมูล owner
for folder in "${folders[@]}"; do
  FULL_PATH="$PROJECT_PATH/$folder"
  ls -ld "$FULL_PATH"
done

echo ""
echo "💡 หมายเหตุ:"
echo "   - ถ้า deploy บน server ให้รันคำสั่ง:"
echo "     sudo chown -R www-data:www-data public/pdimage public/categoryimg public/contact public/payments"
echo "   - เปลี่ยน www-data เป็น user ที่ web server ของคุณใช้งาน"
echo ""
echo "✅ เสร็จสิ้น!"
