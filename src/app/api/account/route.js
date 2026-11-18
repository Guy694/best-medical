import bcrypt from "bcryptjs";
import { query } from "@/app/lib/db";
import { route, json, HttpError, str, phone as parsePhone } from "@/app/lib/api";
import { ROLES } from "@/app/lib/auth";

// GET /api/account – own profile
export const GET = route(
  async (req, { user }) => {
    const rows = await query("SELECT id, name, email, phone, address, role, createdAt FROM user WHERE id = ?", [user.id]);
    if (!rows.length) throw new HttpError(404, "ไม่พบบัญชีผู้ใช้");
    return json(rows[0]);
  },
  { roles: ROLES }
);

// PUT /api/account { name, phone, address, currentPassword?, newPassword? }
export const PUT = route(
  async (req, { user }) => {
    const body = await req.json().catch(() => ({}));
    const name = str(body.name, { required: true, max: 100, label: "ชื่อ-นามสกุล" });
    const phoneNo = parsePhone(body.phone);
    const address = str(body.address, { max: 191, label: "ที่อยู่" });

    const sets = ["name = ?", "phone = ?", "address = ?"];
    const vals = [name, phoneNo, address];

    if (body.newPassword) {
      if (String(body.newPassword).length < 8) throw new HttpError(400, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      const [row] = await query("SELECT password FROM user WHERE id = ?", [user.id]);
      if (!row || !(await bcrypt.compare(String(body.currentPassword || ""), row.password))) {
        throw new HttpError(400, "รหัสผ่านปัจจุบันไม่ถูกต้อง");
      }
      sets.push("password = ?");
      vals.push(await bcrypt.hash(String(body.newPassword), 10));
    }
    await query(`UPDATE user SET ${sets.join(", ")} WHERE id = ?`, [...vals, user.id]);
    return json({ success: true, message: "บันทึกข้อมูลเรียบร้อย" });
  },
  { roles: ROLES }
);
