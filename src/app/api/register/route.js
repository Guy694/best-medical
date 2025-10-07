import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // สร้างโค้ดยืนยัน
    const verifyToken = crypto.randomBytes(24).toString('hex');

    // บันทึกข้อมูลลง MySQL
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO user (name, email, password, verify_token, verified) VALUES (?, ?, ?, ?, 0)',
      [name, email, password, verifyToken]
    );
    await connection.end();

    // สร้าง URL สำหรับยืนยัน
    const verifyUrl = `https://your-domain.com/api/verify?token=${verifyToken}`;

    // ส่งอีเมลยืนยัน
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // เปลี่ยนเป็นอีเมลของคุณ
        pass: 'your-app-password',    // ใช้ App Password จาก Google
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'ยืนยันการสมัครสมาชิก',
      html: `<p>ขอบคุณที่สมัครสมาชิก กรุณาคลิก <a href="${verifyUrl}">ที่นี่</a> เพื่อยืนยันอีเมลของคุณ</p>`
    });

    return new Response(JSON.stringify({ message: "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}