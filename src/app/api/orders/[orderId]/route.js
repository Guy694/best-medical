import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { canSeePrivate, serializeOrder } from "@/app/lib/orderView";

// GET /api/orders/:code?email=...  – order summary (private details for owner/staff/matching email)
export const GET = route(async (req, { params, user }) => {
  const code = String(params.orderId || "").trim().slice(0, 60);
  const rows = await query("SELECT * FROM `order` WHERE order_code = ?", [code]);
  if (!rows.length) throw new HttpError(404, "ไม่พบคำสั่งซื้อ");
  const order = rows[0];
  const full = canSeePrivate(order, user, req.nextUrl.searchParams.get("email"));
  let history = [];
  if (full) {
    history = await query(
      "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC, id ASC",
      [order.order_id]
    ).catch(() => []);
  }
  return json(serializeOrder(order, { full, history }));
});
