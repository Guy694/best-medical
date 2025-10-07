
import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req, context) {
  try {
    const { params } = await context;
    const id = params.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM product WHERE id = ?', [id]);
    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM product WHERE id = ?', [id]);
    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);
    // ถ้ามีเฉพาะ visible
    if (body.hasOwnProperty('visible')) {
      await connection.execute(
        'UPDATE product SET visible = ? WHERE id = ?',
        [body.visible, id]
      );
    } else {
      // อัปเดตข้อมูลสินค้าอื่นๆ
      await connection.execute(
        'UPDATE product SET pro_name = ?, price = ?, description = ?, stock = ?, categoryId = ?, imageUrl = ? WHERE id = ?',
        [
          body.pro_name ?? null,
          body.price ?? null,
          body.description ?? null,
          body.stock ?? null,
          body.categoryId ?? null,
          body.imageUrl ?? null,
          id
        ]
      );
    }
    await connection.end();
    return new Response(JSON.stringify({ message: "อัปเดตสินค้าเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
