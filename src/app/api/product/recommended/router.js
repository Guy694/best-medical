import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const recommended = await prisma.product.findMany({
      where: { isRecommended: true },   // สมมติว่ามีฟิลด์นี้
      take: 8,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
    });
    return Response.json(recommended);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}