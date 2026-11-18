import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { isStaff } from "@/app/lib/auth";

// GET /api/product/:id – product detail (hidden products only for staff)
export const GET = route(async (req, { params, user }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบสินค้า");
  const rows = await query(
    `SELECT p.id, p.pro_name, p.codename, p.description, p.price, p.stock, p.categoryId, p.imageUrl,
            p.createdAt, p.warranty, p.property, p.pro_size, p.delivery, p.visible, c.cate_name
     FROM product p LEFT JOIN category c ON c.id = p.categoryId WHERE p.id = ?`,
    [id]
  );
  const product = rows[0];
  if (!product || (Number(product.visible) !== 0 && !isStaff(user))) throw new HttpError(404, "ไม่พบสินค้า");
  return json(product);
});
