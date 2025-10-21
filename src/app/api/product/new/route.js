// app/api/product/new/route.js
import pool from '@/app/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const [result] = await pool.execute(
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

    return new Response(JSON.stringify({ id: result.insertId, ...body }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM product WHERE visible = 0 ORDER BY createdAt DESC LIMIT 10'
    );
    return new Response(JSON.stringify(rows), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching new products:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}