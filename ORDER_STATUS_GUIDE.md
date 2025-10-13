# วิธีใช้งานระบบตรวจสอบสถานะคำสั่งซื้อ

## 🎯 **ฟีเจอร์ที่สร้างเสร็จแล้ว:**

### 1. **หน้าตรวจสอบสถานะ (`/paidstatus`)**
- ✅ ฟอร์มค้นหาด้วยเลขที่ใบสั่งซื้อ
- ✅ แสดง Timeline สถานะแบบ Interactive
- ✅ ข้อมูลลูกค้าและคำสั่งซื้อ
- ✅ รายการสินค้าที่สั่งซื้อ
- ✅ ที่อยู่จัดส่งและเลขติดตามพัสดุ

### 2. **API Endpoint (`/api/order-status`)**
- ✅ รองรับการค้นหาด้วย `order_code`
- ✅ ส่งคืนข้อมูลครบถ้วน
- ✅ Error handling ที่ดี

### 3. **หน้าทดสอบ (`/order-test`)**
- ✅ เลขที่ใบสั่งซื้อตัวอย่างสำหรับทดสอบ
- ✅ คำแนะนำการใช้งาน
- ✅ ข้อมูล API Documentation

## 🏗️ **สถานะที่รองรับ:**

| สถานะ | ความหมาย | สี |
|-------|-----------|-----|
| `PENDING` | รอดำเนินการ | 🟡 เหลือง |
| `PAID` | ชำระเงินแล้ว | 🔵 น้ำเงิน |
| `SHIPPING` | กำลังจัดส่ง | 🟣 ม่วง |
| `COMPLETED` | สำเร็จ | 🟢 เขียว |
| `CANCELLED` | ยกเลิก | 🔴 แดง |

## 🧪 **วิธีทดสอบ:**

### 1. **เตรียมข้อมูลทดสอบ**
รันคำสั่ง SQL ใน phpMyAdmin หรือ MySQL:
```sql
-- เพิ่ม columns ที่จำเป็น
ALTER TABLE `order` ADD COLUMN orderCode VARCHAR(50) UNIQUE;
ALTER TABLE `order` ADD COLUMN paymentMethod VARCHAR(100);
ALTER TABLE `order` ADD COLUMN trackingNumber VARCHAR(100);
ALTER TABLE `orderitem` ADD COLUMN price DECIMAL(10,2);

-- เพิ่มข้อมูลทดสอบ
INSERT INTO `order` (userId, totalPrice, status, orderCode, shippingAddress, paymentMethod, trackingNumber) VALUES
(1, 1250.00, 'PENDING', 'ORD-2024-101', '123 ถ.สุขุมวิท กรุงเทพฯ', 'โอนผ่านธนาคาร', NULL),
(1, 2800.00, 'PAID', 'ORD-2024-102', '456 ถ.พหลโยธิน กรุงเทพฯ', 'บัตรเครดิต', NULL),
(1, 3500.00, 'SHIPPING', 'ORD-2024-103', '789 ถ.รัชดาภิเษก กรุงเทพฯ', 'โอนผ่านธนาคาร', 'TH1234567890'),
(1, 950.00, 'COMPLETED', 'ORD-2024-104', '321 ถ.ลาดพร้าว กรุงเทพฯ', 'เก็บเงินปลายทาง', 'TH0987654321'),
(1, 1800.00, 'CANCELLED', 'ORD-2024-105', '654 ถ.บางนา กรุงเทพฯ', 'โอนผ่านธนาคาร', NULL);
```

### 2. **ทดสอบใช้งาน**
1. ไปที่ `/order-test` - หน้าทดสอบ
2. คัดลอกเลขที่ใบสั่งซื้อ
3. ไปที่ `/paidstatus` - หน้าตรวจสอบสถานะ
4. วางเลขที่ใบสั่งซื้อและกดค้นหา
5. ดูผลลัพธ์ที่แสดง Timeline และข้อมูลครบถ้วน

### 3. **ทดสอบ API โดยตรง**
```
GET /api/order-status?order_code=ORD-2024-101
```

## 🎨 **UI Features:**

### Timeline สถานะ
- ✅ แสดงขั้นตอนทั้ง 4 ขั้น
- ✅ ไอคอนเปลี่ยนตามสถานะ
- ✅ สีเปลี่ยนตามความคืบหน้า
- ✅ รองรับสถานะ Cancelled แยกต่างหาก

### การแสดงผล
- ✅ Header สีตามสถานะ
- ✅ ข้อมูลลูกค้า (ชื่อ, อีเมล, เบอร์โทร)
- ✅ ข้อมูลคำสั่งซื้อ (ยอดรวม, วิธีชำระ, เลขติดตาม)
- ✅ ที่อยู่จัดส่ง
- ✅ รายการสินค้าพร้อมราคา

### Responsive Design
- ✅ ใช้งานได้บนมือถือ
- ✅ Timeline ปรับตัวตามหน้าจอ
- ✅ Grid layout สำหรับข้อมูล

## 🔧 **Database Schema ที่ใช้:**

### Table: `order`
- `id` - Primary key
- `userId` - Foreign key to users
- `totalPrice` - ยอดรวม
- `status` - ENUM สถานะ
- `orderCode` - เลขที่ใบสั่งซื้อ (เพิ่มใหม่)
- `shippingAddress` - ที่อยู่จัดส่ง
- `paymentMethod` - วิธีชำระเงิน (เพิ่มใหม่)
- `trackingNumber` - เลขติดตามพัสดุ (เพิ่มใหม่)
- `createdAt` - วันที่สร้าง

### Table: `orderitem`
- `id` - Primary key
- `orderId` - Foreign key to order
- `productId` - Foreign key to products
- `quantity` - จำนวน
- `price` - ราคาต่อหน่วย (เพิ่มใหม่)

## 🚀 **ขั้นตอนต่อไป:**

1. **รันคำสั่ง SQL** เพื่อเพิ่มข้อมูลทดสอบ
2. **ทดสอบการทำงาน** ใน browser
3. **ปรับแต่ง UI** ตามต้องการ
4. **เชื่อมต่อกับระบบ Order** ที่มีอยู่

ระบบพร้อมใช้งานแล้ว! 🎉