import { query } from "@/app/lib/db";
import { route, json, HttpError } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { serializeOrder } from "@/app/lib/orderView";

// GET /api/admin/orders/:id – full detail incl. history & payment notifications
export const GET = route(
  async (req, { params }) => {
    const id = Number(params.id);
    const rows = await query("SELECT * FROM `order` WHERE order_id = ?", [Number.isInteger(id) ? id : 0]);
    if (!rows.length) throw new HttpError(404, "ไม่พบคำสั่งซื้อ");
    const history = await query(
      "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC, id ASC",
      [id]
    ).catch(() => []);
    const payments = await query(
      "SELECT * FROM payment_notifications WHERE order_id = ? ORDER BY created_at DESC",
      [id]
    ).catch(() => []);
    return json({ ...serializeOrder(rows[0], { full: true, history }), payments });
  },
  { roles: STAFF_ROLES }
);
