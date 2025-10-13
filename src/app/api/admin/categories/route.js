import pool from '@/app/lib/db';
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const cate_name = formData.get("cate_name") ?? null;
    const file = formData.get("cate_img");

    let cate_img = null;
    if (file && typeof file !== "string") {
      console.log("File received:", file.name, file.size);
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name;
      const folderPath = path.join(process.cwd(), "public", "categoryimg");
      const filepath = path.join(folderPath, filename);
      
      console.log("Saving to:", filepath);
      
      // สร้างโฟลเดอร์ถ้ายังไม่มี
      try {
        await mkdir(folderPath, { recursive: true });
      } catch (error) {
        // โฟลเดอร์มีอยู่แล้ว
      }
      
      await writeFile(filepath, buffer);
      cate_img = `/categoryimg/${filename}`;
      console.log("File saved successfully:", cate_img);
    } else {
      console.log("No file received or file is string");
    }

    await pool.execute(
      "INSERT INTO category (cate_name, cate_img) VALUES (?, ?)",
      [cate_name, cate_img]
    );

    return new Response(JSON.stringify({ message: "เพิ่มหมวดหมู่สำเร็จ" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function GET(req) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM category ORDER BY id ASC'
    );
    return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}



