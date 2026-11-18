# แก้ไขปัญหา Upload ไฟล์บน Server

## ปัญหา
- Upload ไฟล์ไม่ได้บน production server
- ข้อมูลถูก insert ใน database แต่ไฟล์ไม่ถูกบันทึก

## สาเหตุที่เป็นไปได้

### 1. Permission ของโฟลเดอร์ (Linux/Unix Server)
โฟลเดอร์ `public/pdimage` และ `public/categoryimg` ต้องมี permission ที่ให้เขียนไฟล์ได้

**วิธีแก้:**
```bash
# SSH เข้า server แล้วรันคำสั่ง
cd /path/to/your/best-medical

# สร้างโฟลเดอร์ถ้ายังไม่มี
mkdir -p public/pdimage
mkdir -p public/categoryimg
mkdir -p public/contact
mkdir -p public/payments

# ตั้ง permission
chmod 755 public/pdimage
chmod 755 public/categoryimg
chmod 755 public/contact
chmod 755 public/payments

# ตั้ง owner (เปลี่ยน www-data เป็น user ของ web server ที่คุณใช้)
chown -R www-data:www-data public/pdimage
chown -R www-data:www-data public/categoryimg
chown -R www-data:www-data public/contact
chown -R www-data:www-data public/payments
```

### 2. Next.js Static Export
ถ้าคุณใช้ `output: 'export'` ใน next.config.js จะไม่สามารถใช้ API routes ได้

**วิธีแก้:**
แก้ไข `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ลบหรือ comment บรรทัดนี้ออก
  // output: 'export',
};

export default nextConfig;
```

### 3. Vercel/Serverless Deployment
ถ้า deploy บน Vercel หรือ serverless platform ไม่สามารถเขียนไฟล์ลง filesystem ได้

**วิธีแก้:** ต้องใช้ Cloud Storage แทน เช่น:
- AWS S3
- Cloudinary
- Vercel Blob
- Google Cloud Storage

## โค้ดที่แก้ไขแล้ว

โค้ดใน API routes ได้ถูกแก้ไขให้:
1. ✅ สร้างโฟลเดอร์อัตโนมัติถ้ายังไม่มี
2. ✅ ตรวจสอบการมีอยู่ของโฟลเดอร์ก่อน
3. ✅ แสดง error log ที่ละเอียด
4. ✅ ถ้า upload ไฟล์ไม่สำเร็จ จะดำเนินการต่อโดยไม่มีรูปภาพ (แทนที่จะ error ทั้งหมด)
5. ✅ แสดง warning message ว่าไฟล์ upload ไม่สำเร็จ

## การตรวจสอบ Log

### ตรวจสอบ Console Log
เมื่อ upload ไฟล์ ให้เปิด terminal/console ของ server และดู log:
```
Creating folder: /path/to/public/pdimage
Saving file to: /path/to/public/pdimage/1234567890_image.jpg
File saved successfully: /pdimage/1234567890_image.jpg
```

ถ้ามี error จะแสดง:
```
File upload error: [Error message]
Error details: { message: '...', code: '...', path: '...' }
```

### Error Codes ที่พบบ่อย
- `EACCES`: ไม่มีสิทธิ์เขียนไฟล์ (permission denied)
- `ENOENT`: ไม่พบโฟลเดอร์
- `EROFS`: ระบบไฟล์เป็น read-only

## วิธีแก้ระยะยาว: ใช้ Cloud Storage

### ตัวอย่างการใช้ Cloudinary (แนะนำ)

1. สมัคร Cloudinary ฟรี: https://cloudinary.com/

2. ติดตั้ง package:
```bash
npm install cloudinary
```

3. สร้างไฟล์ `src/app/lib/cloudinary.js`:
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

4. เพิ่มใน `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. แก้ไข API route:
```javascript
import cloudinary from '@/app/lib/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");
    
    let imageUrl = null;
    if (imageFile && typeof imageFile !== "string") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString('base64');
      const dataURI = `data:${imageFile.type};base64,${base64}`;
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'best-medical/products',
      });
      
      imageUrl = result.secure_url;
    }
    
    // ... rest of code
  }
}
```

## สรุป
1. ✅ โค้ดได้ถูกแก้ไขให้รองรับ error handling แล้ว
2. ⚠️ ตรวจสอบ permission บน server
3. ⚠️ ตรวจสอบว่าไม่ได้ใช้ static export
4. 💡 พิจารณาใช้ Cloud Storage สำหรับ production

## ติดต่อเพิ่มเติม
หากยังมีปัญหา กรุณาส่ง log error มาเพื่อวินิจฉัยเพิ่มเติม
