// src/app/api/orders/[orderId]/history/route.js
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - ดึงประวัติสถานะของคำสั่งซื้อ
export async function GET(request, context) {
  try {
    const { orderId } = await context.params;

    // ดึงประวัติการเปลี่ยนแปลงสถานะ
    const history = await query(
      `SELECT 
        osh.*,
        u.firstname,
        u.lastname
      FROM order_status_history osh
      LEFT JOIN users u ON osh.changed_by_user_id = u.id
      WHERE osh.order_code = ?
      ORDER BY osh.created_at ASC`,
      [orderId]
    );

    return NextResponse.json({
      success: true,
      history: history
    });

  } catch (error) {
    console.error('Error fetching order status history:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มประวัติสถานะใหม่
export async function POST(request, context) {
  try {
    const { orderId } = await context.params;
    const { status, note, tracking_number, shipping_company, changed_by_user_id } = await request.json();

    // ดึงข้อมูล order ปัจจุบัน
    const orders = await query(
      'SELECT id, orderCode, status FROM `order` WHERE orderCode = ?',
      [orderId]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบคำสั่งซื้อ' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // บันทึกประวัติ
    await query(
      `INSERT INTO order_status_history 
        (order_id, order_code, status, previous_status, note, changed_by, changed_by_user_id, tracking_number, shipping_company)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        order.orderCode,
        status,
        order.status,
        note || null,
        changed_by_user_id ? 'admin' : 'system',
        changed_by_user_id || null,
        tracking_number || null,
        shipping_company || null
      ]
    );

    // อัพเดตสถานะใน order table
    await query(
      'UPDATE `order` SET status = ? WHERE id = ?',
      [status, order.id]
    );

    return NextResponse.json({
      success: true,
      message: 'อัพเดตสถานะเรียบร้อย'
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดตสถานะ' },
      { status: 500 }
    );
  }
}
