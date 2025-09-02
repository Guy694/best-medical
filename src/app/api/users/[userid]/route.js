import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET user ตาม id
export async function GET(req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.userid) },
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

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT = update user
export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: Number(params.userid) },
      data,
    });

    return Response.json(updatedUser);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// DELETE = ลบ user
export async function DELETE(req, { params }) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.userid) },
    });

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}