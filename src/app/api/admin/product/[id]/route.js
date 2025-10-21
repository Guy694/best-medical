
import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';

export async function GET(req, context) {
  try {
    const { params } = await context;
    const id = params.id;
    const [rows] = await pool.execute('SELECT * FROM product WHERE id = ?', [id]);
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลสินค้า" }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { params } = await context;
    const id = params.id;
    await pool.execute('DELETE FROM product WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: "ลบสินค้าเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { params } = await context;
    const id = params.id;
    const body = await req.json();
    
    // ถ้ามีเฉพาะ visible
    if (body.hasOwnProperty('visible') && Object.keys(body).length === 1) {
      await pool.execute(
        'UPDATE product SET visible = ? WHERE id = ?',
        [body.visible, id]
      );
    } else {
      // อัปเดตข้อมูลสินค้าอื่นๆ
      await pool.execute(
        'UPDATE product SET pro_name = ?, price = ?, description = ?, stock = ?, categoryId = ?, imageUrl = ?, delivery = ?, warranty = ? WHERE id = ?',
        [
          body.pro_name ?? null,
          body.price ?? null,
          body.description ?? null,
          body.stock ?? null,
          body.categoryId ?? null,
          body.imageUrl ?? null,
          body.delivery ?? null,
          body.warranty ?? null,
          id
        ]
      );
    }
    
    return new Response(JSON.stringify({ message: "อัปเดตสินค้าเรียบร้อย" }), { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
