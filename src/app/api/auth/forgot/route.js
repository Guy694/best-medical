import crypto from "crypto";
import { query } from "@/app/lib/db";
import { route, json, email as parseEmail, rateLimit } from "@/app/lib/api";
import { sendMail, siteUrl, templates } from "@/app/lib/mailer";

// POST /api/auth/forgot  { email }
// Always answers success so attackers cannot discover registered emails.
export const POST = route(async (req) => {
  rateLimit(req, "forgot", { limit: 5, windowMs: 15 * 60_000 });
  const body = await req.json().catch(() => ({}));
  const emailAddr = parseEmail(body.email);

  const users = await query("SELECT id FROM user WHERE email = ? LIMIT 1", [emailAddr]);
  if (users.length) {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await query(
      "UPDATE user SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?",
      [hash, users[0].id]
    );
    const url = `${siteUrl()}/forgot-password?token=${token}`;
    await sendMail({ to: emailAddr, subject: "รีเซ็ตรหัสผ่าน - Best Medical", title: "รีเซ็ตรหัสผ่าน", html: templates.reset(url) });
  }
  return json({ success: true, message: "หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว" });
});
