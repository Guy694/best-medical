import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุอีเมล' },
        { status: 400 }
      );
    }

    // Query orders by email
    const ordersQuery = `
      SELECT 
        o.order_id,
        o.order_code,
        o.order_email,
        o.totalPrice,
        o.status,
        o.createdAt,
        o.shippingAddress,
        COUNT(oi.id) as item_count
      FROM \`order\` o
      LEFT JOIN orderitem oi ON o.order_id = oi.orderId
      WHERE o.order_email = ?
      GROUP BY o.order_id
      ORDER BY o.createdAt DESC
    `;

    const [orders] = await pool.execute(ordersQuery, [email]);

    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', details: error.message },
      { status: 500 }
    );
  }
}
