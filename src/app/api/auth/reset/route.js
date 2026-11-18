import crypto from "crypto";
import bcrypt from "bcryptjs";
import { query } from "@/app/lib/db";
import { route, json, HttpError, rateLimit } from "@/app/lib/api";

// POST /api/auth/reset  { token, password }
export const POST = route(async (req) => {
  rateLimit(req, "reset", { limit: 10, windowMs: 15 * 60_000 });
  const { token, password } = await req.json().catch(() => ({}));
  if (!token || typeof token !== "string") throw new HttpError(400, "ลิงก์ไม่ถูกต้อง");
  if (!password || String(password).length < 8) throw new HttpError(400, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");

  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const users = await query(
    "SELECT id FROM user WHERE reset_token = ? AND reset_expires > NOW() LIMIT 1",
    [hash]
  );
  if (!users.length) throw new HttpError(400, "ลิงก์หมดอายุหรือถูกใช้งานแล้ว กรุณาขอลิงก์ใหม่");

  const hashed = await bcrypt.hash(String(password), 10);
  await query(
    "UPDATE user SET password = ?, reset_token = NULL, reset_expires = NULL, verified = 1 WHERE id = ?",
    [hashed, users[0].id]
  );
  return json({ success: true, message: "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ" });
});
