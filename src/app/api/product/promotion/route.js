// app/api/product/new/route.js
import mysql from 'mysql2/promise';

import { dbConfig } from '@/app/lib/db';

export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM Promotion INNER JOIN Product ON Promotion.productId = Product.id ORDER BY endDate DESC'
    );
    await connection.end();
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}