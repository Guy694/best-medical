import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { isStaff, STAFF_ROLES } from "@/app/lib/auth";
import { parseArticle } from "@/app/lib/articles";

const idOf = (params) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบบทความ");
  return id;
};

// GET /api/articles/:id  (?view=1 increments the view counter)
export const GET = route(async (req, { params, user }) => {
  const id = idOf(params);
  const rows = await query(
    "SELECT a.*, u.name AS author_name FROM articles a LEFT JOIN user u ON u.id = a.author_id WHERE a.id = ?",
    [id]
  );
  const a = rows[0];
  if (!a || (a.status !== "published" && !isStaff(user))) throw new HttpError(404, "ไม่พบบทความ");
  if (req.nextUrl.searchParams.get("view") === "1") {
    await query("UPDATE articles SET views = views + 1 WHERE id = ?", [id]);
    a.views = Number(a.views || 0) + 1;
  }
  return json({ success: true, article: a });
});

// PUT /api/articles/:id – partial update (staff)
export const PUT = route(
  async (req, { params }) => {
    const id = idOf(params);
    const body = await req.json().catch(() => ({}));
    const data = parseArticle(body, { partial: true });
    if (data.status === "published" && body.published_at === undefined) {
      const cur = await query("SELECT published_at FROM articles WHERE id = ?", [id]);
      if (cur[0] && !cur[0].published_at) data.published_at = new Date();
    }
    const fields = Object.keys(data);
    if (!fields.length) throw new HttpError(400, "ไม่มีข้อมูลที่ต้องการแก้ไข");
    const result = await query(
      `UPDATE articles SET ${fields.map((f) => `\`${f}\` = ?`).join(", ")}, updated_at = NOW() WHERE id = ?`,
      [...fields.map((f) => data[f] ?? null), id]
    );
    if (!result.affectedRows) throw new HttpError(404, "ไม่พบบทความ");
    return json({ success: true, message: "บันทึกบทความเรียบร้อย" });
  },
  { roles: STAFF_ROLES }
);

// DELETE /api/articles/:id (staff)
export const DELETE = route(
  async (req, { params }) => {
    const id = idOf(params);
    const result = await query("DELETE FROM articles WHERE id = ?", [id]);
    if (!result.affectedRows) throw new HttpError(404, "ไม่พบบทความ");
    return json({ success: true, message: "ลบบทความเรียบร้อย" });
  },
  { roles: STAFF_ROLES }
);
