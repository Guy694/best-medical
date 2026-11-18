import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";

// GET /api/admin/contacts
export const GET = route(
  async () => {
    const contacts = await query(
      "SELECT id, name, email, phone, article, detail, createdAt, is_read FROM contact ORDER BY createdAt DESC LIMIT 1000"
    ).catch(() =>
      query("SELECT id, name, email, phone, article, detail, createdAt, 0 AS is_read FROM contact ORDER BY createdAt DESC LIMIT 1000")
    );
    return json({ success: true, contacts });
  },
  { roles: STAFF_ROLES }
);

// PATCH /api/admin/contacts { id, is_read }
export const PATCH = route(
  async (req) => {
    const { id, is_read } = await req.json().catch(() => ({}));
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, "รหัสข้อความไม่ถูกต้อง");
    await query("UPDATE contact SET is_read = ? WHERE id = ?", [is_read ? 1 : 0, n]);
    return json({ success: true });
  },
  { roles: STAFF_ROLES }
);

// DELETE /api/admin/contacts?id=1
export const DELETE = route(
  async (req) => {
    const id = Number(req.nextUrl.searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "รหัสข้อความไม่ถูกต้อง");
    const r = await query("DELETE FROM contact WHERE id = ?", [id]);
    if (!r.affectedRows) throw new HttpError(404, "ไม่พบข้อความ");
    return json({ success: true, message: "ลบข้อความสำเร็จ" });
  },
  { roles: STAFF_ROLES }
);
