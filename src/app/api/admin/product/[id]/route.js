import pool, { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { saveImage } from "@/app/lib/upload";
import { parseProduct, assertCategory } from "@/app/lib/products";

const idOf = (params) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบสินค้า");
  return id;
};

export const GET = route(
  async (req, { params }) => {
    const rows = await query(
      "SELECT p.*, c.cate_name FROM product p LEFT JOIN category c ON c.id = p.categoryId WHERE p.id = ?",
      [idOf(params)]
    );
    if (!rows.length) throw new HttpError(404, "ไม่พบสินค้า");
    return json(rows[0]);
  },
  { roles: STAFF_ROLES }
);

/**
 * PUT /api/admin/product/:id
 *  - JSON { visible: 0|1 }        → toggle visibility only
 *  - JSON { stock: n } (only)     → quick stock update
 *  - multipart / JSON full form   → full update (multipart may include a new "image")
 */
export const PUT = route(
  async (req, { params }) => {
    const id = idOf(params);
    const ct = req.headers.get("content-type") || "";
    const isMultipart = ct.includes("multipart/form-data");
    const src = isMultipart ? await req.formData() : await req.json().catch(() => ({}));

    if (!isMultipart) {
      const keys = Object.keys(src);
      if (keys.length === 1 && keys[0] === "visible") {
        const r = await query("UPDATE product SET visible = ? WHERE id = ?", [Number(src.visible) ? 1 : 0, id]);
        if (!r.affectedRows) throw new HttpError(404, "ไม่พบสินค้า");
        return json({ success: true, message: Number(src.visible) ? "ซ่อนสินค้าแล้ว" : "แสดงสินค้าแล้ว" });
      }
      if (keys.length === 1 && keys[0] === "stock") {
        const stock = Number(src.stock);
        if (!Number.isInteger(stock) || stock < 0) throw new HttpError(400, "จำนวนสต็อกไม่ถูกต้อง");
        const r = await query("UPDATE product SET stock = ? WHERE id = ?", [stock, id]);
        if (!r.affectedRows) throw new HttpError(404, "ไม่พบสินค้า");
        return json({ success: true, message: "อัปเดตสต็อกแล้ว" });
      }
    }

    const p = parseProduct(src);
    await assertCategory(pool, p.categoryId);
    const current = await query("SELECT imageUrl FROM product WHERE id = ?", [id]);
    if (!current.length) throw new HttpError(404, "ไม่พบสินค้า");

    let imageUrl = current[0].imageUrl;
    if (isMultipart) {
      const uploaded = await saveImage(src.get("image"), "pdimage");
      if (uploaded) imageUrl = uploaded;
      else if (src.get("removeImage") === "1") imageUrl = null;
    } else if (src.imageUrl !== undefined) {
      imageUrl = src.imageUrl || null;
    }

    await query(
      `UPDATE product SET pro_name = ?, codename = ?, price = ?, description = ?, pro_size = ?, stock = ?,
         categoryId = ?, imageUrl = ?, delivery = ?, warranty = ?, visible = ? WHERE id = ?`,
      [p.pro_name, p.codename, p.price, p.description, p.pro_size, p.stock, p.categoryId, imageUrl, p.delivery, p.warranty, p.visible, id]
    );
    return json({ success: true, message: "บันทึกสินค้าเรียบร้อย", imageUrl });
  },
  { roles: STAFF_ROLES }
);

export const DELETE = route(
  async (req, { params }) => {
    const id = idOf(params);
    const r = await query("DELETE FROM product WHERE id = ?", [id]);
    if (!r.affectedRows) throw new HttpError(404, "ไม่พบสินค้า");
    return json({ success: true, message: "ลบสินค้าเรียบร้อย" });
  },
  { roles: STAFF_ROLES }
);
