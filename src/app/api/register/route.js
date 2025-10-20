import pool from '@/app/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างโค้ดยืนยัน
    const verifyToken = crypto.randomBytes(24).toString('hex');

    // บันทึกข้อมูลลง MySQL
    
    // ตรวจสอบอีเมลซ้ำ
    const [existingUser] = await pool.execute('SELECT id FROM user WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "อีเมลนี้ถูกใช้งานแล้ว" }), { status: 400 });
    }
    await pool.execute(
      'INSERT INTO user (name, email, password, verify_token, verified) VALUES (?, ?, ?, ?, 0)',
      [name, email, hashedPassword, verifyToken]
    );

    // สร้าง URL สำหรับยืนยัน
    const verifyUrl = `https://best-medical-bm.com/api/verify?token=${verifyToken}`;

    // ส่งอีเมลยืนยัน
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chakrit694@gmail.com', // เปลี่ยนเป็นอีเมลของคุณ
        pass: 'nqjo cxbr howx mnvr',    // ใช้ App Password จาก Google
        
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: 'chakrit694@gmail.com',
      to: email,
      subject: 'ยืนยันการสมัครสมาชิก',
      html: `<p>ขอบคุณที่สมัครสมาชิก กรุณาคลิก <a href="${verifyUrl}">ที่นี่</a> เพื่อยืนยันอีเมลของคุณ</p>`
    });

    return new Response(JSON.stringify({ message: "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}