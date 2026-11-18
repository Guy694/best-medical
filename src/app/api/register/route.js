import crypto from "crypto";
import bcrypt from "bcryptjs";
import { query } from "@/app/lib/db";
import { route, json, HttpError, str, email as parseEmail, rateLimit } from "@/app/lib/api";
import { sendMail, siteUrl, templates } from "@/app/lib/mailer";

// POST /api/register  { name, email, password }
export const POST = route(async (req) => {
  rateLimit(req, "register", { limit: 5, windowMs: 15 * 60_000 });
  const body = await req.json().catch(() => ({}));
  const name = str(body.name, { required: true, max: 100, label: "ชื่อ-นามสกุล" });
  const emailAddr = parseEmail(body.email);
  const password = String(body.password || "");
  if (password.length < 8) throw new HttpError(400, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");

  const existing = await query("SELECT id, verified FROM user WHERE email = ?", [emailAddr]);
  if (existing.length) throw new HttpError(409, "อีเมลนี้ถูกใช้งานแล้ว");

  const hashed = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(24).toString("hex");
  const smtpReady = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

  // If email is not configured (e.g. local dev) accounts are auto-verified so they can log in.
  await query(
    "INSERT INTO user (name, email, password, role, verify_token, verified) VALUES (?, ?, ?, 'CUSTOMER', ?, ?)",
    [name, emailAddr, hashed, smtpReady ? verifyToken : null, smtpReady ? 0 : 1]
  );

  if (smtpReady) {
    const url = `${siteUrl()}/api/verify?token=${verifyToken}`;
    await sendMail({ to: emailAddr, subject: "ยืนยันการสมัครสมาชิก - Best Medical", title: "ยืนยันอีเมลของคุณ", html: templates.verify(url) });
  }

  return json(
    {
      success: true,
      needVerify: smtpReady,
      message: smtpReady
        ? "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน"
        : "สมัครสมาชิกสำเร็จ สามารถเข้าสู่ระบบได้ทันที",
    },
    { status: 201 }
  );
});
