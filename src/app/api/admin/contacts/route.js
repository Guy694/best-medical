import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(request) {
  try {
    // ดึงข้อมูลจาก table contact
    const contacts = await query(
      `SELECT id, name, email, phone, article, detail, createdAt 
       FROM contact 
       ORDER BY createdAt DESC`
    );

    return NextResponse.json({
      success: true,
      contacts: contacts
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลข้อความ',
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');

    if (!contactId || isNaN(parseInt(contactId))) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ ID ของข้อความหรือ ID ไม่ถูกต้อง' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // ตรวจสอบว่ามีข้อความนี้อยู่หรือไม่
    const existingContact = await query(
      'SELECT id FROM contact WHERE id = ?',
      [parseInt(contactId)]
    );

    if (existingContact.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อความที่ต้องการลบ' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // ลบข้อความ
    await query(
      'DELETE FROM contact WHERE id = ?',
      [parseInt(contactId)]
    );

    return NextResponse.json({
      success: true,
      message: 'ลบข้อความสำเร็จ'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการลบข้อความ',
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}