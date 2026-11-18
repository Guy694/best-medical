import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";

const PUBLIC_COLUMNS = `p.id, p.pro_name, p.codename, p.description, p.price, p.stock, p.categoryId,
  p.imageUrl, p.createdAt, p.warranty, p.pro_size, p.delivery, c.cate_name`;

const SORTS = {
  newest: "p.createdAt DESC, p.id DESC",
  price_asc: "(p.price = 0), p.price ASC",
  price_desc: "p.price DESC",
  name: "p.pro_name ASC",
};

// GET /api/product?category=ID&q=text&sort=newest|price_asc|price_desc|name&limit=N
export const GET = route(async (req) => {
  const sp = req.nextUrl.searchParams;
  const where = ["p.visible = 0"];
  const params = [];

  const category = Number(sp.get("category"));
  if (Number.isInteger(category) && category > 0) {
    where.push("p.categoryId = ?");
    params.push(category);
  }
  const q = (sp.get("q") || "").trim().slice(0, 100);
  if (q) {
    where.push("(p.pro_name LIKE ? OR p.codename LIKE ? OR p.description LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const exclude = Number(sp.get("exclude"));
  if (Number.isInteger(exclude) && exclude > 0) {
    where.push("p.id <> ?");
    params.push(exclude);
  }
  const order = SORTS[sp.get("sort")] || SORTS.newest;
  const limit = Math.min(Math.max(parseInt(sp.get("limit"), 10) || 500, 1), 500);

  const rows = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM product p LEFT JOIN category c ON c.id = p.categoryId
     WHERE ${where.join(" AND ")} ORDER BY ${order} LIMIT ${limit}`,
    params
  );
  return json(rows);
});
