import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';

// export async function GET(req) {
//   try {

//     const [rows] =  await pool.execute(
//       "SELECT id, name, email, password, phone, address, role FROM user WHERE role != 'CUSTOMER' ORDER BY createdAt DESC"
//     );
//     await connection.end();
//     return new Response(JSON.stringify(rows), {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

export async function PUT(req, context) {
  try {
    const { params } = await context;
    const id = params.id;
    const { status, slipUrl, paidAtdate, paidAttime } = await req.json();
    await pool.execute(
      'UPDATE order SET status = ?, slipUrl = ?, paidAtdate = ?, paidAttime = ? WHERE order_code = ?',
      [status, slipUrl, paidAtdate, paidAttime, id]
    );
    return new Response(JSON.stringify({ message: "อัปเดตพนักงานเรียบร้อย" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
