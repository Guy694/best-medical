import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'ประเภทไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์รูปภาพ' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // เส้นทางสำหรับบันทึกไฟล์
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'articles');
    const filePath = join(uploadDir, fileName);

    // สร้างโฟลเดอร์ถ้าไม่มี
    const { mkdir } = await import('fs/promises');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // โฟลเดอร์มีอยู่แล้ว
    }

    // บันทึกไฟล์
    await writeFile(filePath, buffer);

    // ส่งคืน URL ของไฟล์
    const fileUrl = `/uploads/articles/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'อัพโหลดสำเร็จ',
      url: fileUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
      { status: 500 }
    );
  }
}