import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { parseStaff } from "@/app/lib/staff";

// ADMIN only (also enforced by middleware)
export const GET = route(
  async () => {
    const rows = await query(
      "SELECT id, name, email, phone, address, role, createdAt FROM user WHERE role IN ('ADMIN','STAFF') ORDER BY createdAt DESC"
    );
    return json(rows);
  },
  { roles: ["ADMIN"] }
);

export const POST = route(
  async (req) => {
    const s = await parseStaff(await req.json().catch(() => ({})), { requirePassword: true });
    const result = await query(
      "INSERT INTO user (name, email, password, phone, address, role, verified) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [s.name, s.email, s.passwordHash, s.phone, s.address, s.role]
    );
    return json({ success: true, message: "เพิ่มพนักงานเรียบร้อย", id: result.insertId }, { status: 201 });
  },
  { roles: ["ADMIN"] }
);
