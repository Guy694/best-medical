import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// GET - ดึงบทความเดียว
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const articleQuery = `
      SELECT 
        a.*,
        u.name as author_firstname
      FROM articles a
      LEFT JOIN \`user\` u ON a.author_id = u.id
      WHERE a.id = ?
    `;
    
    const [articles] = await pool.execute(articleQuery, [id]);
    
    if (articles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทความ' },
        { status: 404 }
      );
    }

    // อัพเดตจำนวนการดู
    await pool.execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      article: articles[0]
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขบทความ
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('Updating article:', { id, body });

    const {
      title,
      content,
      excerpt,
      banner,
      status,
      published_at,
      category
    } = body;

    // ตรวจสอบว่าบทความมีอยู่จริง
    const [existing] = await pool.execute('SELECT id FROM articles WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทความที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    // สร้าง query แบบ dynamic
    let updateFields = [];
    let values = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      values.push(content);
    }
    if (excerpt !== undefined) {
      updateFields.push('excerpt = ?');
      values.push(excerpt);
    }
    if (banner !== undefined) {
      updateFields.push('banner = ?');
      values.push(banner);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      values.push(status);
    }
    if (published_at !== undefined) {
      updateFields.push('published_at = ?');
      values.push(published_at);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      values.push(category);
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    const updateQuery = `
      UPDATE articles 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    console.log('Update query:', updateQuery);
    console.log('Values:', values);

    await pool.execute(updateQuery, values);

    return NextResponse.json({
      success: true,
      message: 'แก้ไขบทความสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการแก้ไขบทความ', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - ลบบทความ
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    console.log('Deleting article:', id);

    // ตรวจสอบว่าบทความมีอยู่จริง
    const [existing] = await pool.execute('SELECT id, title FROM articles WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทความที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ลบบทความ
    await pool.execute('DELETE FROM articles WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'ลบบทความสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบบทความ', details: error.message },
      { status: 500 }
    );
  }
}
