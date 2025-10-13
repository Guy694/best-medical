import pool from '@/app/lib/db';
import bcrypt from "bcryptjs";

// POST /api/auth - Login
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, address, role, password, verified FROM user WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return Response.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    const user = users[0];

    // ตรวจสอบรหัสผ่าน
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // ส่งข้อมูลผู้ใช้กลับ (ไม่รวมรหัสผ่าน)
    const { password: _, ...userData } = user;
    return Response.json(userData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
