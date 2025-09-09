import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET() {
  try {
    const category = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return Response.json(category);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const data = await req.json();
    const { name} = data;

    const category = await prisma.category.create({
      data: { name},
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
