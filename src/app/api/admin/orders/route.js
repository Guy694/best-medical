import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        o.order_id,
        o.order_code,
        o.fullName,
        o.order_email,
        o.order_phone,
        o.totalPrice,
        o.status,
        o.shippingAddress,
        o.transfer_slip_file,
        o.items,
        o.paidAtdate,
        o.paidAttime,
        o.createdAt,
        DATE_FORMAT(o.createdAt, '%d/%m/%Y %H:%i') as orderDate
      FROM \`order\` o
      ORDER BY o.createdAt DESC
    `);

    console.log('Fetched orders:', rows.length);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json({ error: error.message, details: error.stack }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { order_id, status, note } = await req.json();
    
    if (!order_id || !status) {
      return NextResponse.json({ error: 'Missing order_id or status' }, { status: 400 });
    }

    // ถ้าเปลี่ยนสถานะเป็น PAID ให้ตัด stock
    if (status === 'PAID') {
      // ดึงข้อมูล order เพื่อเอา items
      const [orderData] = await pool.execute(
        'SELECT items FROM `order` WHERE order_id = ?',
        [order_id]
      );
      
      if (orderData.length > 0) {
        let items = orderData[0].items;
        if (typeof items === 'string') {
          items = JSON.parse(items);
        }
        
        // ตัด stock สำหรับแต่ละสินค้า
        for (const item of items) {
          if (
            typeof item.product_id !== 'undefined' && item.product_id !== null &&
            typeof item.quantity !== 'undefined' && item.quantity !== null
          ) {
            await pool.execute(
              'UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?',
              [item.quantity, item.product_id, item.quantity]
            );
          } else {
            console.warn('Order item missing product_id or quantity:', item);
          }
        }
      }
    }
    
    // อัปเดตสถานะ order
    await pool.execute(
      'UPDATE `order` SET status = ? WHERE order_id = ?',
      [status, order_id]
    );

    // บันทึก history และ note (ถ้ามี)
    if (note || status === 'CANCELLED') {
      await pool.execute(
        'INSERT INTO order_status_history (order_id, status, note, created_at) VALUES (?, ?, ?, NOW())',
        [order_id, status, note || null]
      );
    }
    
    return NextResponse.json({ message: 'Order updated successfully', success: true });
  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}