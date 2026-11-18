import { query } from "@/app/lib/db";
import { route, json, HttpError, rateLimit } from "@/app/lib/api";
import { canSeePrivate, serializeOrder } from "@/app/lib/orderView";

// GET /api/order-status?order_code=...&email=...
// Anyone with the order code sees the status; personal details need the order email (or login).
export const GET = route(async (req, { user }) => {
  rateLimit(req, "order-status", { limit: 30, windowMs: 60_000 });
  const sp = req.nextUrl.searchParams;
  const code = (sp.get("order_code") || "").trim().toUpperCase().slice(0, 60);
  if (!code) throw new HttpError(400, "กรุณาระบุเลขที่ใบสั่งซื้อ");

  const rows = await query("SELECT * FROM `order` WHERE order_code = ?", [code]);
  if (!rows.length) throw new HttpError(404, "ไม่พบใบสั่งซื้อนี้ในระบบ");
  const order = rows[0];

  const emailParam = sp.get("email");
  const full = canSeePrivate(order, user, emailParam);
  if (emailParam && !full) throw new HttpError(403, "อีเมลไม่ตรงกับคำสั่งซื้อนี้");

  let history = [];
  if (full) {
    history = await query(
      "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC, id ASC",
      [order.order_id]
    ).catch(() => []);
  }
  return json({ success: true, order: serializeOrder(order, { full, history }) });
});
