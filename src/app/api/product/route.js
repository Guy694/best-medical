import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // หรือใช้ DB lib อื่นได้

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  try {
    let products;
    if (categoryId) {
      products = await prisma.product.findMany({
        where: { categoryId: Number(categoryId) },
      });
    } else {
      products = await prisma.product.findMany();
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
