import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";

// GET /api/product/new – latest 12 visible products
export const GET = route(async () => {
  const rows = await query(
    `SELECT p.id, p.pro_name, p.codename, p.price, p.stock, p.categoryId, p.imageUrl, p.createdAt, c.cate_name
     FROM product p LEFT JOIN category c ON c.id = p.categoryId
     WHERE p.visible = 0 ORDER BY p.createdAt DESC, p.id DESC LIMIT 12`
  );
  return json(rows);
});
