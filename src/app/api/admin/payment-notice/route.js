// src/app/api/admin/payment-notice/route.js
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - ดึงรายการการแจ้งชำระเงินทั้งหมด
export async function GET() {
  try {
    const paymentsQuery = `
      SELECT 
        pn.*,
        o.status,
        o.orderCode,
        o.id as order_id
      FROM payment_notifications pn
      LEFT JOIN \`order\` o ON pn.order_id = o.id
      ORDER BY pn.created_at DESC
    `;

    const payments = await query(paymentsQuery);
    
    return NextResponse.json(payments);

  } catch (error) {
    console.error('Error fetching payment notifications:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตสถานะการชำระเงิน
export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'กรุณาระบุข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Update order status
    const updateQuery = `
      UPDATE \`order\` 
      SET status = ?
      WHERE id = ?
    `;

    await query(updateQuery, [status, orderId]);

    return NextResponse.json({
      success: true,
      message: 'อัปเดตสถานะเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' },
      { status: 500 }
    );
  }
}