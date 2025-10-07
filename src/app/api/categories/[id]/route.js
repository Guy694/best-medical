import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req, context) {
  try {
    const { params } = await context; // ต้อง await context
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM `category` INNER join product ON category.id = product.categoryId WHERE category.id = ? AND product.visible = 0',
      [params.id]
    );
    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { params } = await context;
    const data = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE Product SET pro_name = ?, description = ?, price = ?, stock = ?, imageUrl = ? WHERE id = ?',
      [data.pro_name, data.description, data.price, data.stock, data.imageUrl, params.id]
    );
    await connection.end();
    return new Response(JSON.stringify({ message: "Product updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function DELETE(req, context) {
  try {
    const { params } = await context;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'DELETE FROM Product WHERE id = ?',
      [params.id]
    );
    await connection.end();
    return new Response(JSON.stringify({ message: "Product deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}