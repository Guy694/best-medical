import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, name, email, password, phone, address, role FROM user WHERE role != 'CUSTOMER' ORDER BY createdAt DESC"
    );
    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO user (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, address, role]
    );
    await connection.end();
    return new Response(JSON.stringify({ id: result.insertId, name, email, phone, address, role }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
