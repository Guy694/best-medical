import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password, phone, address, role FROM user WHERE role != 'CUSTOMER' ORDER BY createdAt DESC"
    );
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, password, phone, address, role } = await req.json();
    // hash password ก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO user (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, role]
    );
    return new Response(JSON.stringify({ id: result.insertId, name, email, phone, address, role }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
