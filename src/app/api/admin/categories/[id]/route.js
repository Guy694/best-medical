import mysql from 'mysql2/promise';
import pool from '@/app/lib/db';
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const id = params.id;
        const [rows] = await pool.execute('SELECT * FROM category WHERE id = ?', [id]);
        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "ไม่พบข้อมูลหมวดหมู่" }), { status: 404 });
        }
        return new Response(JSON.stringify(rows[0]), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const params = await context.params;
        const id = params.id;
        await pool.execute('DELETE FROM category WHERE id = ?', [id]);
        return new Response(JSON.stringify({ message: "ลบหมวดหมู่เรียบร้อย" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const params = await context.params;
        const id = params.id;
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
        } else {
            cate_img = file; // กรณีไม่ได้อัปโหลดใหม่ ให้ใช้ path เดิม
        }

        await pool.execute(
            'UPDATE category SET cate_name = ?, cate_img = ? WHERE id = ?',
            [
                cate_name,
                cate_img,
                id
            ]
        );

        return new Response(JSON.stringify({ message: "อัปเดตหมวดหมู่เรียบร้อย" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}