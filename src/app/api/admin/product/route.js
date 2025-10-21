import pool from '@/app/lib/db';
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pro_name = formData.get("pro_name") ?? null;
    const codename = formData.get("codename") ?? null;
    const price = formData.get("price") ?? null;
    const description = formData.get("description") ?? null;
    const stock = formData.get("stock") ?? null;
    const categoryId = formData.get("categoryId") ?? null;
    const delivery = formData.get("delivery") ?? null;
    const warranty = formData.get("warranty") ?? null;

    // รับไฟล์รูปภาพ
    const imageFile = formData.get("image");
    let imageUrl = null;
    if (imageFile && typeof imageFile !== "string") {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = Date.now() + "_" + imageFile.name;
        const folderPath = path.join(process.cwd(), "public", "pdimage");
        const filepath = path.join(folderPath, filename);
        
        // สร้างโฟลเดอร์ถ้ายังไม่มี
        if (!existsSync(folderPath)) {
          console.log("Creating folder:", folderPath);
          await mkdir(folderPath, { recursive: true });
        }
        
        console.log("Saving file to:", filepath);
        await writeFile(filepath, buffer);
        imageUrl = `/pdimage/${filename}`;
        console.log("File saved successfully:", imageUrl);
      } catch (fileError) {
        console.error("File upload error:", fileError);
        console.error("Error details:", {
          message: fileError.message,
          code: fileError.code,
          path: fileError.path
        });
        // ถ้าอัปโหลดไฟล์ไม่สำเร็จ ให้ดำเนินการต่อโดยไม่มีรูป
        imageUrl = null;
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO product (pro_name, codename, price, description, stock, categoryId, imageUrl, delivery, warranty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pro_name, codename, price, description, stock, categoryId, imageUrl, delivery, warranty]
    );
    
    console.log("Product inserted successfully:", { 
      id: result.insertId, 
      pro_name, 
      imageUrl,
      imageUploaded: imageUrl ? 'Yes' : 'No'
    });
    
    return new Response(JSON.stringify({ 
      id: result.insertId, 
      pro_name, 
      codename, 
      price, 
      description, 
      stock, 
      categoryId, 
      imageUrl,
      delivery,
      warranty,
      warning: imageUrl ? null : 'Image upload failed - product created without image'
    }), { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500 });
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



