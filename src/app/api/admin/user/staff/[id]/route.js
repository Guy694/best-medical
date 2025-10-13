import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(req, context) {
  try {
   const params = await context.params;
const id = params.id;
    const [rows] = await pool.execute('SELECT id, name, email, phone, address, role FROM user WHERE id = ?', [id]);
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
    await pool.execute('DELETE FROM user WHERE id = ?', [id]);
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
    // hash password ก่อนอัปเดต
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    await pool.execute(
      'UPDATE user SET name = ?, email = ?, password = ?, phone = ?, address = ?, role = ? WHERE id = ?',
      [name, email, hashedPassword || password, phone, address, role, id]
    );
    return new Response(JSON.stringify({ message: "อัปเดตพนักงานเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
