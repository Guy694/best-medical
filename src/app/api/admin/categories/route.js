import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const cate_name = formData.get("cate_name") ?? null;
    const file = formData.get("cate_img");

    let cate_img = null;
    if (file && typeof file !== "string") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name;
      const filepath = path.join(process.cwd(), "public", "categoryimg", filename);
      await writeFile(filepath, buffer);
      cate_img = `/categoryimg/${filename}`;
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO category (cate_name, cate_img) VALUES (?, ?)",
      [cate_name, cate_img]
    );
    await connection.end();

    return new Response(JSON.stringify({ message: "เพิ่มหมวดหมู่สำเร็จ" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function GET(req) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM category ORDER BY id ASC'
    );
    await connection.end();
    return new Response(JSON.stringify(rows), { status: 200,headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}



