// app/api/product/new/route.js
import mysql from 'mysql2/promise';

import { dbConfig } from '@/app/lib/db';
export async function POST(req) {
  try {
    const body = await req.json();
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `INSERT INTO Product (name, codename, description, price, stock, categoryId, image_url, warranty, property)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.codename,
        body.description,
        body.price,
        body.stock,
        body.categoryId,
        body.imageUrl,
        body.warranty,
        JSON.stringify(body.property),
      ]
    );

    await connection.end();

    return new Response(JSON.stringify({ id: result.insertId, ...body }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM Product ORDER BY createdAt DESC LIMIT 10'
    );
    await connection.end();
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}