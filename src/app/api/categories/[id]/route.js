import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";

// GET /api/categories/:id – { category, products }
export const GET = route(async (req, { params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบหมวดหมู่");
  const cats = await query("SELECT id, cate_name, cate_img FROM category WHERE id = ?", [id]);
  if (!cats.length) throw new HttpError(404, "ไม่พบหมวดหมู่");
  const products = await query(
    `SELECT id, pro_name, codename, price, stock, imageUrl, createdAt, categoryId
     FROM product WHERE categoryId = ? AND visible = 0 ORDER BY createdAt DESC, id DESC`,
    [id]
  );
  return json({ category: cats[0], products });
});
