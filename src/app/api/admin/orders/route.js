import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT 
        o.order_id,
        o.order_code,
        o.order_email,
        o.totalPrice,
        o.status,
        o.shippingAddress,
        o.slipUrl,
        o.items,
        o.paidAtdate,
        o.paidAttime,
        o.createdAt,
        DATE_FORMAT(o.createdAt, '%d/%m/%Y %H:%i') as orderDate
      FROM \`order\` o
      ORDER BY o.createdAt DESC
    `);

    await connection.end();
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { order_id, status } = await req.json();
    
    if (!order_id || !status) {
      return new Response(JSON.stringify({ error: 'Missing order_id or status' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // ถ้าเปลี่ยนสถานะเป็น PAID ให้ตัด stock
    if (status === 'PAID') {
      // ดึงข้อมูล order เพื่อเอา items
      const [orderData] = await connection.execute(
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
            await connection.execute(
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
    await connection.execute(
      'UPDATE `order` SET status = ? WHERE order_id = ?',
      [status, order_id]
    );
    
    await connection.end();
    
    return new Response(JSON.stringify({ message: 'Order updated successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}