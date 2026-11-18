import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { parseArticle, ARTICLE_STATUSES as STATUSES } from "@/app/lib/articles";
import { isStaff, STAFF_ROLES } from "@/app/lib/auth";

const LIST_COLUMNS = `a.id, a.title, a.excerpt, a.banner, a.category, a.status, a.views, a.author_id,
  a.published_at, a.created_at, a.updated_at, u.name AS author_name`;

// GET /api/articles?page=1&limit=9&category=&q=&status=published|all   (status=all → staff only)
export const GET = route(async (req, { user }) => {
  const sp = req.nextUrl.searchParams;

  // legacy: /api/articles?id=5
  if (sp.get("id")) {
    const rows = await query(
      `SELECT a.*, u.name AS author_name FROM articles a LEFT JOIN user u ON u.id = a.author_id WHERE a.id = ?`,
      [Number(sp.get("id")) || 0]
    );
    const a = rows[0];
    if (!a || (a.status !== "published" && !isStaff(user))) throw new HttpError(404, "ไม่พบบทความ");
    return json({ success: true, article: a });
  }

  const page = Math.max(parseInt(sp.get("page"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(sp.get("limit"), 10) || 9, 1), 100);
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];
  const status = sp.get("status");
  if (status === "all" && isStaff(user)) {
    // no filter
  } else if (STATUSES.includes(status) && isStaff(user)) {
    where.push("a.status = ?");
    params.push(status);
  } else {
    where.push("a.status = 'published' AND (a.published_at IS NULL OR a.published_at <= NOW())");
  }
  const category = (sp.get("category") || "").trim();
  if (category) {
    where.push("a.category = ?");
    params.push(category.slice(0, 100));
  }
  const q = (sp.get("q") || "").trim().slice(0, 100);
  if (q) {
    where.push("(a.title LIKE ? OR a.excerpt LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const articles = await query(
    `SELECT ${LIST_COLUMNS} FROM articles a LEFT JOIN user u ON u.id = a.author_id ${whereSql}
     ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM articles a ${whereSql}`, params);
  const categories = await query(
    "SELECT DISTINCT category FROM articles WHERE status = 'published' AND category IS NOT NULL AND category <> '' ORDER BY category"
  );
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return json({
    success: true,
    articles,
    categories: categories.map((c) => c.category),
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  });
});

// POST /api/articles – create (staff)
export const POST = route(
  async (req, { user }) => {
    const body = await req.json().catch(() => ({}));
    const a = parseArticle(body);
    const status = a.status || "published";
    const publishedAt = a.published_at || (status === "published" ? new Date() : null);
    const result = await query(
      `INSERT INTO articles (title, content, excerpt, banner, author_id, status, published_at, category, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [a.title, a.content, a.excerpt, a.banner || null, user.id, status, publishedAt, a.category || null]
    );
    return json({ success: true, message: "สร้างบทความสำเร็จ", article_id: result.insertId }, { status: 201 });
  },
  { roles: STAFF_ROLES }
);

