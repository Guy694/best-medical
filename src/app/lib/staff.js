import bcrypt from "bcryptjs";
import { HttpError, str, email as parseEmail, phone as parsePhone } from "./api";

const ROLES = ["ADMIN", "STAFF"];

export async function parseStaff(body, { requirePassword }) {
  const role = ROLES.includes(body.role) ? body.role : null;
  if (!role) throw new HttpError(400, "กรุณาเลือกสิทธิ์การใช้งาน");
  const password = String(body.password || "");
  if (requirePassword && password.length < 8) throw new HttpError(400, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
  if (!requirePassword && password && password.length < 8) throw new HttpError(400, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
  return {
    name: str(body.name, { required: true, max: 100, label: "ชื่อ" }),
    email: parseEmail(body.email),
    phone: parsePhone(body.phone),
    address: str(body.address, { max: 191, label: "ที่อยู่" }),
    role,
    passwordHash: password ? await bcrypt.hash(password, 10) : null,
  };
}
