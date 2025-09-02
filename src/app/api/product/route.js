import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET = ดึง users ทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return Response.json(products);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, description, price, stock, categoryId, imageUrl } = data;

    const products = await prisma.product.create({
      data: { name, description, price, stock, categoryId, imageUrl },
    });

    return Response.json(products, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
