import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// POST /api/auth - Login
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        password: true,
      },
    });
    if (!user) {
      return Response.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }
    // const valid = await bcrypt.compare(password, user.password);
    const valid = password === user.password;
    if (!valid) {
      return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const { password: _, ...userData } = user;
    return Response.json(userData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
