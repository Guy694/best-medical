import { query } from "@/app/lib/db";
import { route, json, str } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { saveImage } from "@/app/lib/upload";

// GET /api/admin/categories – all categories with product counts
export const GET = route(
  async () => {
    const rows = await query(
      `SELECT c.*, (SELECT COUNT(*) FROM product p WHERE p.categoryId = c.id) AS product_count
       FROM category c ORDER BY c.cate_name ASC`
    );
    return json(rows);
  },
  { roles: STAFF_ROLES }
);

// POST /api/admin/categories – multipart { cate_name, cate_img? }
export const POST = route(
  async (req) => {
    const fd = await req.formData();
    const cate_name = str(fd.get("cate_name"), { required: true, max: 100, label: "ชื่อหมวดหมู่" });
    const cate_img = await saveImage(fd.get("cate_img"), "categoryimg");
    const result = await query("INSERT INTO category (cate_name, cate_img) VALUES (?, ?)", [cate_name, cate_img]);
    return json({ success: true, message: "เพิ่มหมวดหมู่สำเร็จ", id: result.insertId }, { status: 201 });
  },
  { roles: STAFF_ROLES }
);
