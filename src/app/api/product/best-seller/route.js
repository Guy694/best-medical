import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const bestSellers = await prisma.product.findMany({
      where: { stock: { gt: 0 } },   // เฉพาะสินค้าที่มีสต๊อก
      orderBy: { sold: "desc" },     // จัดเรียงจากจำนวนขาย
      take: 10,                      // เอา 10 อันดับแรก
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        sold: true,
      },
    });
    return Response.json(bestSellers);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}