import pool from '@/app/lib/db';
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pro_name = formData.get("pro_name") ?? null;
    const codename = formData.get("codename") ?? null;
    const price = formData.get("price") ?? null;
    const description = formData.get("description") ?? null;
    const stock = formData.get("stock") ?? null;
    const categoryId = formData.get("categoryId") ?? null;

    // รับไฟล์รูปภาพ
    const imageFile = formData.get("image");
    let imageUrl = null;
    if (imageFile && typeof imageFile !== "string") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = Date.now() + "_" + imageFile.name;
      const filepath = path.join(process.cwd(), "public", "pdimage", filename);
      await writeFile(filepath, buffer);
      imageUrl = `/pdimage/${filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO product (pro_name, codename, price, description, stock, categoryId, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pro_name, codename, price, description, stock, categoryId, imageUrl]
    );
    return new Response(JSON.stringify({ id: result.insertId, pro_name, codename, price, description, stock, categoryId, imageUrl }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM product ORDER BY visible ASC'
    );
    return new Response(JSON.stringify(rows), { status: 200,headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}



