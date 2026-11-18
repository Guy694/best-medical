import { query } from "@/app/lib/db";
import { route, json, str, email as parseEmail, phone as parsePhone, rateLimit } from "@/app/lib/api";

// POST /api/contacts – public contact form
export const POST = route(async (req) => {
  rateLimit(req, "contact", { limit: 5, windowMs: 10 * 60_000 });
  const body = await req.json().catch(() => ({}));
  const name = str(body.name, { required: true, max: 150, label: "ชื่อ" });
  const emailAddr = parseEmail(body.email);
  const phoneNo = parsePhone(body.phone);
  const article = str(body.article, { required: true, max: 191, label: "หัวข้อ" });
  const detail = str(body.detail, { required: true, max: 5000, label: "รายละเอียด" });

  const result = await query(
    "INSERT INTO contact (name, email, phone, article, detail, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))",
    [name, emailAddr, phoneNo, article, detail]
  );
  return json({ success: true, message: "ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด", id: result.insertId });
});
