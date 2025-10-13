import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      `SELECT p.* 
       FROM product p 
       WHERE p.promotion = 1 AND p.visible = 0 
       ORDER BY p.createdAt DESC 
       LIMIT 10`
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching promotion products:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
