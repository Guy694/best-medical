import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { serializeOrder } from "@/app/lib/orderView";

// GET /api/orders/history – orders of the logged-in user (by account id or email)
export const GET = route(
  async (req, { user }) => {
    const rows = await query(
      "SELECT * FROM `order` WHERE user_id = ? OR order_email = ? ORDER BY createdAt DESC LIMIT 200",
      [user.id, user.email]
    );
    return json({ success: true, orders: rows.map((o) => serializeOrder(o, { full: true })) });
  },
  { roles: ["CUSTOMER", "STAFF", "ADMIN"] }
);
