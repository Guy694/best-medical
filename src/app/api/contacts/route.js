import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function POST(request) {
  try {
    const { name, email, phone, article, detail } = await request.json();

    // Validate required fields
    if (!name || !email || !article || !detail) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Insert contact data
    const insertQuery = `
      INSERT INTO contact (name, email, phone, article, detail, createdAt)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(insertQuery, [
      name,
      email,
      phone || null,
      article,
      detail
    ]);

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อความเรียบร้อยแล้ว',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await query('SELECT * FROM contact ORDER BY createdAt DESC');
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}