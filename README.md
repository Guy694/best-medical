# Best Medical – ระบบร้านค้าออนไลน์อุปกรณ์การแพทย์

ระบบขายสินค้าออนไลน์ของ **บริษัท เบสท เมดิคอล จำกัด** (หน้าร้าน + ระบบหลังบ้าน)
สร้างด้วย Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · MySQL/MariaDB

## เริ่มต้นใช้งาน (เครื่องพัฒนา)

```bash
npm install
cp .env.example .env.local     # แล้วแก้ค่า DB_* และ AUTH_SECRET
npm run db:migrate             # อัปเกรดโครงสร้างฐานข้อมูล (รันซ้ำได้ ปลอดภัย)
npm run dev                    # http://localhost:3000
```

## ขึ้นระบบจริง (Production)

1. ตั้งค่า `.env.production` / environment ให้ครบ — **ต้องมี `AUTH_SECRET`** (ถ้าไม่มี ระบบจะไม่ยอมทำงาน)
   - ถ้าเว็บยังไม่มี HTTPS ให้ตั้ง `COOKIE_SECURE=false` ไม่เช่นนั้นจะเข้าสู่ระบบไม่ได้
   - ตั้ง `SITE_URL` เป็นโดเมนจริง (ใช้สร้างลิงก์ในอีเมล)
   - ตั้ง `SMTP_USER` / `SMTP_PASS` (Gmail App Password) เพื่อส่งอีเมลยืนยัน/เลขคำสั่งซื้อ/รีเซ็ตรหัสผ่าน
2. สำรองฐานข้อมูล แล้วรัน `npm run db:migrate`
3. `npm run build && npm run start` (หรือรันผ่าน PM2)
4. ให้สิทธิ์เขียนโฟลเดอร์ `public/pdimage`, `public/categoryimg`, `public/uploads/articles`, `storage/payments`

## โครงสร้างหลัก

```
src/middleware.js            ป้องกัน /admin, /api/admin, /user (ตรวจ session ฝั่งเซิร์ฟเวอร์)
src/app/lib/                 auth (JWT cookie), db (pool/transaction), api helpers, upload, mailer, orders
src/app/api/                 REST API ทั้งหมด
src/app/components/          Navbar, Footer, Providers (Auth/Cart/Toast), ui, ProductCard, admin
src/app/admin/               ระบบหลังบ้าน (layout มี sidebar ในตัว)
scripts/migrate.mjs          สคริปต์อัปเกรดฐานข้อมูลแบบ idempotent
storage/payments/            สลิปโอนเงิน (ไม่เปิดสาธารณะ – ดูได้เฉพาะพนักงานผ่าน /api/media/payments)
```

## ขั้นตอนคำสั่งซื้อ

`PENDING (รอชำระ)` → ลูกค้าแจ้งชำระพร้อมสลิป (ยังเป็น PENDING แต่แสดง "รอตรวจสอบการชำระ")
→ พนักงานกด **ยืนยันการชำระเงิน** → `PAID` (ตัดสต็อกอัตโนมัติ) → `SHIPPING` (ใส่เลขพัสดุ) → `COMPLETED`
การยกเลิก (`CANCELLED`) ต้องระบุเหตุผล และจะคืนสต็อกให้อัตโนมัติ

## สิทธิ์ผู้ใช้

| บทบาท | สิทธิ์ |
|---|---|
| CUSTOMER | สั่งซื้อ ดูประวัติ แก้ไขข้อมูลส่วนตัว |
| STAFF | ระบบหลังบ้านทั้งหมด ยกเว้นจัดการพนักงาน |
| ADMIN | ทุกอย่าง รวมถึงจัดการพนักงาน/สิทธิ์ |

เอกสารเก่าอยู่ที่ `docs/legacy/` และไฟล์ SQL เก่าอยู่ที่ `sql/legacy/`
