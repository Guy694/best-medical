import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";

// GET /api/categories – top-level categories with visible product counts
export const GET = route(async () => {
  const rows = await query(
    `SELECT c.id, c.cate_name, c.cate_img, c.parentId,
            (SELECT COUNT(*) FROM product p WHERE p.categoryId = c.id AND p.visible = 0) AS product_count
     FROM category c WHERE c.parentId IS NULL ORDER BY c.cate_name ASC`
  );
  return json(rows);
});
