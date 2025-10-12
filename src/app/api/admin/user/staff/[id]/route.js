
import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req, context) {
  try {
   const params = await context.params;
const id = params.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, name, email, phone, address, role FROM user WHERE id = ?', [id]);
    await connection.end();
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลเจ้าหน้าที่" }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function DELETE(req, context) {
  try {
   const params = await context.params;
const id = params.id;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM user WHERE id = ?', [id]);
    await connection.end();
    return new Response(JSON.stringify({ message: "ลบพนักงานเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
  const params = await context.params;
const id = params.id;
    const { name, email, password, phone, address, role } = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE user SET name = ?, email = ?, password = ?, phone = ?, address = ?, role = ? WHERE id = ?',
      [name, email, password, phone, address, role, id]
    );
    await connection.end();
    return new Response(JSON.stringify({ message: "อัปเดตพนักงานเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
