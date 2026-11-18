import pool, { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { saveImage } from "@/app/lib/upload";
import { parseProduct, assertCategory } from "@/app/lib/products";

// GET /api/admin/product – all products (incl. hidden) with category name
export const GET = route(
  async () => {
    const rows = await query(
      `SELECT p.*, c.cate_name FROM product p LEFT JOIN category c ON c.id = p.categoryId
       ORDER BY p.createdAt DESC, p.id DESC`
    );
    return json(rows);
  },
  { roles: STAFF_ROLES }
);

// POST /api/admin/product – multipart form (image optional)
export const POST = route(
  async (req) => {
    const fd = await req.formData();
    const p = parseProduct(fd);
    await assertCategory(pool, p.categoryId);
    const imageUrl = (await saveImage(fd.get("image"), "pdimage")) || null;
    const [result] = await pool.execute(
      `INSERT INTO product (pro_name, codename, price, description, pro_size, stock, categoryId, imageUrl, delivery, warranty, visible, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [p.pro_name, p.codename, p.price, p.description, p.pro_size, p.stock, p.categoryId, imageUrl, p.delivery, p.warranty, p.visible]
    );
    return json({ success: true, message: "เพิ่มสินค้าเรียบร้อย", id: result.insertId, imageUrl }, { status: 201 });
  },
  { roles: STAFF_ROLES }
);
