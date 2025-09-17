import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.formData();
    const cart = JSON.parse(body.get('cart'));
    const shipping = body.get('shipping');
    const order_email = body.get('order_email');

    // สร้างเลขคำสั่งซื้อ
    const orderId = 'ORD' + Date.now();

    // รวมราคาสินค้าทั้งหมด
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shipping.cost;

    // บันทึกข้อมูลลง MySQL (เพิ่มฟิลด์ total)
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO `order` (order_code, order_email, shipping, items, totalPrice, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [orderId,order_email,shipping,JSON.stringify(cart),totalPrice]
    );
    await connection.end();

     const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chakrit694@gmail.com',
        pass: 'nqjo cxbr howx mnvr',
      },
       tls: {
    rejectUnauthorized: false
  }
    });

    await transporter.sendMail({
      from: 'chakrit694@gmail.com',
      to: order_email,
      subject: 'บริษัท เบสท เมดิคอล จำกัด เลขคำสั่งซื้อของคุณ',
      text: `ขอบคุณที่สั่งซื้อ! เลขคำสั่งซื้อของคุณคือ ${orderId} สามารถตรวจสอบสถานะได้ที่ https://best-medical.vercel.app/track-order/${orderId}`,
    });


    return new Response(JSON.stringify({ orderId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}