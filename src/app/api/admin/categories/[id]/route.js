import { query } from "@/app/lib/db";
import { route, json, HttpError, str } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { saveImage } from "@/app/lib/upload";

const idOf = (params) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบหมวดหมู่");
  return id;
};

export const GET = route(
  async (req, { params }) => {
    const rows = await query("SELECT * FROM category WHERE id = ?", [idOf(params)]);
    if (!rows.length) throw new HttpError(404, "ไม่พบหมวดหมู่");
    return json(rows[0]);
  },
  { roles: STAFF_ROLES }
);

// PUT – multipart { cate_name, cate_img? (file) }; keeps the old image when no new file
export const PUT = route(
  async (req, { params }) => {
    const id = idOf(params);
    const fd = await req.formData();
    const cate_name = str(fd.get("cate_name"), { required: true, max: 100, label: "ชื่อหมวดหมู่" });
    const current = await query("SELECT cate_img FROM category WHERE id = ?", [id]);
    if (!current.length) throw new HttpError(404, "ไม่พบหมวดหมู่");
    const uploaded = await saveImage(fd.get("cate_img"), "categoryimg");
    await query("UPDATE category SET cate_name = ?, cate_img = ? WHERE id = ?", [
      cate_name,
      uploaded || current[0].cate_img,
      id,
    ]);
    return json({ success: true, message: "บันทึกหมวดหมู่เรียบร้อย" });
  },
  { roles: STAFF_ROLES }
);

export const DELETE = route(
  async (req, { params }) => {
    const id = idOf(params);
    const [{ n }] = await query("SELECT COUNT(*) AS n FROM product WHERE categoryId = ?", [id]);
    if (Number(n) > 0) {
      throw new HttpError(409, `ไม่สามารถลบได้ เนื่องจากมีสินค้าในหมวดหมู่นี้ ${n} รายการ กรุณาย้ายสินค้าก่อน`);
    }
    const r = await query("DELETE FROM category WHERE id = ?", [id]);
    if (!r.affectedRows) throw new HttpError(404, "ไม่พบหมวดหมู่");
    return json({ success: true, message: "ลบหมวดหมู่เรียบร้อย" });
  },
  { roles: STAFF_ROLES }
);
