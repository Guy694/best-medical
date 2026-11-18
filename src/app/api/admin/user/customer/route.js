import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";

// GET /api/admin/user/customer – customers with order stats (no password hashes!)
export const GET = route(
  async () => {
    const rows = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.verified, u.createdAt,
              COUNT(o.order_id) AS order_count,
              COALESCE(SUM(CASE WHEN o.status IN ('PAID','SHIPPING','COMPLETED') THEN o.totalPrice END), 0) AS total_spent,
              MAX(o.createdAt) AS last_order_at
       FROM user u LEFT JOIN \`order\` o ON o.order_email = u.email OR o.user_id = u.id
       WHERE u.role = 'CUSTOMER'
       GROUP BY u.id ORDER BY u.createdAt DESC`
    );
    return json(rows.map((r) => ({ ...r, order_count: Number(r.order_count), total_spent: Number(r.total_spent) })));
  },
  { roles: STAFF_ROLES }
);
