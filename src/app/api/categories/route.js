import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM category WHERE parentId IS NULL ORDER BY id ASC'
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}