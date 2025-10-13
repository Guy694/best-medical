import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      "SELECT name, email, password, phone, address, role FROM user WHERE role = 'CUSTOMER' ORDER BY createdAt DESC"
    );
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
