import pool from '@/app/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.formData();
    const cart = JSON.parse(body.get('cart'));
    const shipping = body.get('shipping');
    const order_email = body.get('order_email');
    const totalPrice = body.get('totalPrice');

    console.log('Received order data:', { 
      cartItems: cart?.length, 
      shipping, 
      order_email, 
      totalPrice 
    });

    // Validation
    if (!cart || cart.length === 0) {
      return new Response(
        JSON.stringify({ error: 'ตะกร้าสินค้าว่างเปล่า' }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!order_email || !order_email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'กรุณากรอกอีเมลที่ถูกต้อง' }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // สร้างเลขคำสั่งซื้อ
    const orderId = 'ORD' + Date.now();

    console.log('Creating order:', { orderId, order_email, totalPrice });

    // บันทึกข้อมูลลง MySQL (ใช้ pool.execute แทน getConnection)
    // เพิ่ม transfer_slip_file เป็น empty string เพราะเป็น NOT NULL
    await pool.execute(
      'INSERT INTO `order` (order_code, order_email, shipping, items, totalPrice, transfer_slip_file, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [orderId, order_email, shipping, JSON.stringify(cart), totalPrice, '']
    );

    console.log('Order saved to database successfully');

    // ส่งอีเมล (แยกออกมาเป็น async เพื่อไม่ให้ block)
    sendOrderEmail(order_email, orderId).catch(err => {
      console.error('Error sending email:', err);
      // ไม่ throw error เพื่อให้คำสั่งซื้อสำเร็จแม้อีเมลส่งไม่สำเร็จ
    });

    return new Response(JSON.stringify({ orderId, success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error in sendOrder:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ฟังก์ชันส่งอีเมลแยกออกมา
async function sendOrderEmail(order_email, orderId) {
  try {
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
      text: `ขอบคุณที่สั่งซื้อ! เลขคำสั่งซื้อของคุณคือ ${orderId} สามารถชำระเงินได้ที่ https://www.best-medical-bm.com/payment-notice และตรวจสอบสถานะได้ที่ https://www.best-medical-bm.com/paidstatus`,
    });

    console.log('Email sent successfully to:', order_email);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}