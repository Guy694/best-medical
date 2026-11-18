// Product form parsing shared by admin product routes.
import { HttpError, str, int, money } from "./api";

/** Parse product fields from FormData or a plain object. */
export function parseProduct(src) {
  const get = (k) => (typeof src.get === "function" ? src.get(k) : src[k]);
  const categoryId = int(get("categoryId"), { min: 1, label: "หมวดหมู่" });
  const visibleRaw = get("visible");
  return {
    pro_name: str(get("pro_name"), { required: true, max: 200, label: "ชื่อสินค้า" }),
    codename: str(get("codename"), { max: 100, label: "รหัสสินค้า" }),
    description: str(get("description"), { max: 20000, label: "รายละเอียด" }),
    pro_size: str(get("pro_size"), { max: 5000, label: "ขนาด/รุ่น" }),
    price: money(get("price"), { label: "ราคา", fallback: 0 }),
    stock: int(get("stock"), { min: 0, max: 1000000, label: "จำนวนสต็อก", fallback: 0 }),
    delivery: money(get("delivery"), { label: "ค่าจัดส่ง", fallback: 0 }),
    warranty: int(get("warranty"), { min: 0, max: 1200, label: "ระยะรับประกัน", fallback: 0 }),
    visible: visibleRaw === undefined || visibleRaw === null || visibleRaw === "" ? 0 : Number(visibleRaw) ? 1 : 0,
    categoryId,
  };
}

export async function assertCategory(conn, categoryId) {
  const [rows] = await conn.execute("SELECT id FROM category WHERE id = ?", [categoryId]);
  if (!rows.length) throw new HttpError(400, "ไม่พบหมวดหมู่ที่เลือก");
}
