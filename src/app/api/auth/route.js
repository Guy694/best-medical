import bcrypt from "bcryptjs";
import { query } from "@/app/lib/db";
import { route, json, HttpError, email as parseEmail, rateLimit, getCurrentUser } from "@/app/lib/api";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/app/lib/auth";

// POST /api/auth  – login, sets httpOnly session cookie
export const POST = route(async (req) => {
  rateLimit(req, "login", { limit: 10, windowMs: 5 * 60_000 });
  const body = await req.json().catch(() => ({}));
  const emailAddr = parseEmail(body.email);
  const password = String(body.password || "");
  if (!password) throw new HttpError(400, "กรุณากรอกรหัสผ่าน");

  const users = await query(
    "SELECT id, name, email, phone, address, role, password, verified FROM user WHERE email = ? LIMIT 1",
    [emailAddr]
  );
  const user = users[0];
  const valid = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !valid) throw new HttpError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  if (!Number(user.verified)) {
    throw new HttpError(403, "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ (ตรวจสอบกล่องจดหมายของคุณ)", { needVerify: true });
  }

  const token = await createSessionToken(user);
  const res = json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
});

// GET /api/auth – current user (fresh from DB)
export const GET = route(async () => {
  const session = await getCurrentUser();
  if (!session) return json({ user: null });
  const rows = await query("SELECT id, name, email, phone, address, role FROM user WHERE id = ?", [session.id]);
  if (!rows.length) {
    const res = json({ user: null });
    res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  }
  return json({ user: rows[0], expiresAt: session.exp ? session.exp * 1000 : null });
});

// DELETE /api/auth – logout
export const DELETE = route(async () => {
  const res = json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
});
