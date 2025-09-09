import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// helper: สร้าง tree จาก flat list
function buildTree(categories) {
  const map = {};
  const roots = [];

  categories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
}

// 🟢 READ (GET) - ดึงหมวดหมู่ทั้งหมดแบบ tree
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        parent_id: true,
      },
      orderBy: { id: "asc" },
    });

    const tree = buildTree(categories);
    return Response.json(tree);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// 🟢 CREATE (POST) - เพิ่มหมวดหมู่ใหม่
export async function POST(req) {
  try {
    const { name, parent_id } = await req.json();

    const category = await prisma.category.create({
      data: { 
        name, 
        parent_id: parent_id || null 
      },
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// 🟡 UPDATE (PUT) - แก้ไขชื่อหรือ parent
export async function PUT(req) {
  try {
    const { id, name, parent_id } = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: { 
        name, 
        parent_id: parent_id || null 
      },
    });

    return Response.json(category);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// 🔴 DELETE (DELETE) - ลบหมวดหมู่
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // ลบ children ก่อน (recursive ลึกๆ อาจต้องทำเพิ่มเอง)
    await prisma.category.deleteMany({
      where: { parent_id: id }
    });

    const category = await prisma.category.delete({
      where: { id },
    });

    return Response.json(category);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
