import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// GET - ดึงบทความทั้งหมด หรือบทความเดียว
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    if (id) {
      // ดึงบทความเดียว
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
          { error: 'ไม่พบบทความ' },
          { status: 404 }
        );
      }

      // อัพเดตจำนวนการดู
      await pool.execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
      
      return NextResponse.json({
        success: true,
        article: articles[0]
      });
    } else {
      // ดึงบทความทั้งหมด
      const where = status === 'all' ? '' : 'WHERE a.status = ?';
      const params = status === 'all' ? [] : [status];
      
      const articlesQuery = `
        SELECT 
          a.*,
          u.name as author_firstname
        FROM articles a
        LEFT JOIN \`user\` u ON a.author_id = u.id
        ${where}
        ORDER BY 
          CASE WHEN a.published_at IS NULL OR a.published_at > NOW() THEN a.created_at ELSE a.published_at END DESC
        LIMIT ? OFFSET ?
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM articles a 
        ${where}
      `;

      const [articles] = await pool.execute(articlesQuery, [...params, limit, offset]);
      const [countResult] = await pool.execute(countQuery, params);

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// POST - สร้างบทความใหม่
export async function POST(request) {
  try {
    const {
      title,
      content,
      excerpt,
      banner,
      author_id = '1',
      status = 'published',
      published_at,
 
      category
    } = await request.json();

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // สร้างเนื้อหาตัวอย่าง (excerpt) ถ้าไม่ได้ระบุ
    const autoExcerpt = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

    const insertQuery = `
      INSERT INTO articles (
        title, content, excerpt, banner, author_id, status, 
        published_at, category, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(insertQuery, [
      title,
      content,
      autoExcerpt,
      banner || null,
      author_id,
      status,
      published_at || (status === 'published' ? new Date() : null),
    
      category || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'สร้างบทความสำเร็จ',
      article_id: result.insertId
    });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างบทความ' },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขบทความ
export async function PUT(request) {
  try {
    const {
      id,
      title,
      content,
      excerpt,
      banner,
      status,
      published_at,
   
      category
    } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const autoExcerpt = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

    const updateQuery = `
      UPDATE articles
      SET 
        title = ?, 
        content = ?, 
        excerpt = ?, 
        banner = ?, 
        status = ?,
        published_at = ?,
        category = ?
      WHERE id = ?
    `;

    await pool.execute(updateQuery, [
      title,
      content,
      autoExcerpt,
      banner || null,
      status,
      published_at,
  
      category || null,
      id
    ]);

    return NextResponse.json({
      success: true,
      message: 'แก้ไขบทความสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแก้ไขบทความ' },
      { status: 500 }
    );
  }
}

// DELETE - ลบบทความ
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'กรุณาระบุ ID บทความ' },
        { status: 400 }
      );
    }

    await pool.execute('DELETE FROM articles WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'ลบบทความสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบบทความ' },
      { status: 500 }
    );
  }
}