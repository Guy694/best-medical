import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM product WHERE visible = 0 ORDER BY createdAt DESC'
    );
    return new Response(JSON.stringify(rows), { status: 200,headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}