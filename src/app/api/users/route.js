import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET = ดึง users ทั้งหมด
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST = เพิ่ม user ใหม่
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, password, phone, address, role } = data;

    const newUser = await prisma.user.create({
      data: { name, email, password, phone, address, role },
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
