import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM `order` ORDER BY status DESC"
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