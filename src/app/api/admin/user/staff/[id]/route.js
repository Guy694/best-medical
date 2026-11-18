import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { parseStaff } from "@/app/lib/staff";

const idOf = (params) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "ไม่พบข้อมูลพนักงาน");
  return id;
};

export const GET = route(
  async (req, { params }) => {
    const rows = await query(
      "SELECT id, name, email, phone, address, role, createdAt FROM user WHERE id = ? AND role IN ('ADMIN','STAFF')",
      [idOf(params)]
    );
    if (!rows.length) throw new HttpError(404, "ไม่พบข้อมูลพนักงาน");
    return json(rows[0]);
  },
  { roles: ["ADMIN"] }
);

// PUT – password is optional; empty = keep current password
export const PUT = route(
  async (req, { params, user }) => {
    const id = idOf(params);
    const s = await parseStaff(await req.json().catch(() => ({})), { requirePassword: false });
    if (id === user.id && s.role !== "ADMIN") throw new HttpError(400, "ไม่สามารถลดสิทธิ์บัญชีของตัวเองได้");
    const sets = ["name = ?", "email = ?", "phone = ?", "address = ?", "role = ?"];
    const vals = [s.name, s.email, s.phone, s.address, s.role];
    if (s.passwordHash) {
      sets.push("password = ?");
      vals.push(s.passwordHash);
    }
    const r = await query(`UPDATE user SET ${sets.join(", ")} WHERE id = ? AND role IN ('ADMIN','STAFF')`, [...vals, id]);
    if (!r.affectedRows) throw new HttpError(404, "ไม่พบข้อมูลพนักงาน");
    return json({ success: true, message: "บันทึกข้อมูลพนักงานเรียบร้อย" });
  },
  { roles: ["ADMIN"] }
);

export const DELETE = route(
  async (req, { params, user }) => {
    const id = idOf(params);
    if (id === user.id) throw new HttpError(400, "ไม่สามารถลบบัญชีของตัวเองได้");
    const [{ admins }] = await query("SELECT COUNT(*) AS admins FROM user WHERE role = 'ADMIN' AND id <> ?", [id]);
    const target = await query("SELECT role FROM user WHERE id = ? AND role IN ('ADMIN','STAFF')", [id]);
    if (!target.length) throw new HttpError(404, "ไม่พบข้อมูลพนักงาน");
    if (target[0].role === "ADMIN" && Number(admins) === 0) throw new HttpError(400, "ต้องมีผู้ดูแลระบบอย่างน้อย 1 คน");
    await query("DELETE FROM user WHERE id = ?", [id]);
    return json({ success: true, message: "ลบพนักงานเรียบร้อย" });
  },
  { roles: ["ADMIN"] }
);
