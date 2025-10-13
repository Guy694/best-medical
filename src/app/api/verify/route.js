import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: red;">ข้อผิดพลาด</h1>
            <p>ไม่พบโทเค็นยืนยัน</p>
            <a href="/login" style="color: blue; text-decoration: none;">กลับไปหน้าเข้าสู่ระบบ</a>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // ตรวจสอบและอัปเดตสถานะยืนยัน
    const [result] = await pool.execute(
      'UPDATE user SET verified = 1, verify_token = NULL WHERE verify_token = ? AND verified = 0',
      [token]
    );

    if (result.affectedRows === 0) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: red;">ข้อผิดพลาด</h1>
            <p>โทเค็นไม่ถูกต้องหรือหมดอายุแล้ว</p>
            <a href="/register" style="color: blue; text-decoration: none;">สมัครสมาชิกใหม่</a>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: green;">ยืนยันอีเมลสำเร็จ!</h1>
          <p>บัญชีของคุณได้รับการยืนยันแล้ว สามารถเข้าสู่ระบบได้</p>
          <a href="/login" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">เข้าสู่ระบบ</a>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: red;">เกิดข้อผิดพลาด</h1>
          <p>${error.message}</p>
          <a href="/register" style="color: blue; text-decoration: none;">สมัครสมาชิกใหม่</a>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
