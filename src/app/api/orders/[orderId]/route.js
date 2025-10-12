import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req, context) {
  try {
const params = await context.params;
const orderId = params.orderId;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
  'SELECT * FROM `order` WHERE order_code = ?',
  [orderId]
);
    await connection.end();
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "ไม่พบคำสั่งซื้อ" }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}