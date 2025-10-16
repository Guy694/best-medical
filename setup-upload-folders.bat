@echo off
REM สคริปต์สำหรับ Windows - สร้างโฟลเดอร์ที่จำเป็นสำหรับ upload ไฟล์

echo 🔍 ตรวจสอบและสร้างโฟลเดอร์สำหรับ upload ไฟล์...
echo.

REM สร้างโฟลเดอร์ที่จำเป็น
if not exist "public\pdimage" (
    mkdir "public\pdimage"
    echo ✨ สร้าง public\pdimage
) else (
    echo ✅ public\pdimage - มีอยู่แล้ว
)

if not exist "public\categoryimg" (
    mkdir "public\categoryimg"
    echo ✨ สร้าง public\categoryimg
) else (
    echo ✅ public\categoryimg - มีอยู่แล้ว
)

if not exist "public\contact" (
    mkdir "public\contact"
    echo ✨ สร้าง public\contact
) else (
    echo ✅ public\contact - มีอยู่แล้ว
)

if not exist "public\payments" (
    mkdir "public\payments"
    echo ✨ สร้าง public\payments
) else (
    echo ✅ public\payments - มีอยู่แล้ว
)

echo.
echo ✅ เสร็จสิ้น!
echo.
pause
