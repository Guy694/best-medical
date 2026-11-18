import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { parseItems, itemProductId } from "@/app/lib/orders";

const PAID = "('PAID','SHIPPING','COMPLETED')";

// GET /api/admin/dashboard?year=2026
export const GET = route(
  async (req) => {
    const yearParam = parseInt(req.nextUrl.searchParams.get("year"), 10);
    const year = yearParam >= 2000 && yearParam <= 2100 ? yearParam : new Date().getFullYear();

    const [summary] = await query(
      `SELECT
         COUNT(*) AS totalOrders,
         COALESCE(SUM(CASE WHEN status IN ${PAID} THEN totalPrice END), 0) AS totalRevenue,
         SUM(status IN ${PAID}) AS paidOrders,
         SUM(status = 'PENDING') AS pendingOrders,
         SUM(status = 'PENDING' AND paidAtdate IS NOT NULL) AS awaitingVerification,
         SUM(status = 'PAID') AS toShip,
         SUM(status = 'SHIPPING') AS shipping,
         SUM(status = 'COMPLETED') AS completed,
         SUM(status = 'CANCELLED') AS cancelled
       FROM \`order\` WHERE YEAR(createdAt) = ?`,
      [year]
    );

    const monthly = await query(
      `SELECT MONTH(createdAt) AS month, COUNT(*) AS orders,
              COALESCE(SUM(CASE WHEN status IN ${PAID} THEN totalPrice END), 0) AS revenue
       FROM \`order\` WHERE YEAR(createdAt) = ? GROUP BY MONTH(createdAt)`,
      [year]
    );
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const m = monthly.find((r) => Number(r.month) === i + 1);
      return { month: i + 1, orders: m ? Number(m.orders) : 0, revenue: m ? Number(m.revenue) : 0 };
    });

    const recentOrders = await query(
      `SELECT order_id, order_code, order_email, fullName, totalPrice, status, paidAtdate, createdAt
       FROM \`order\` ORDER BY createdAt DESC LIMIT 8`
    );

    const paidOrders = await query(
      `SELECT items FROM \`order\` WHERE status IN ${PAID} AND YEAR(createdAt) = ?`,
      [year]
    );
    const sales = new Map();
    for (const o of paidOrders) {
      for (const it of parseItems(o.items)) {
        const id = itemProductId(it);
        const cur = sales.get(id) || { id, name: it.name, image: it.image, quantity: 0, totalRevenue: 0 };
        cur.quantity += Number(it.quantity) || 0;
        cur.totalRevenue += (Number(it.price) || 0) * (Number(it.quantity) || 0);
        sales.set(id, cur);
      }
    }
    const topProducts = [...sales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8);

    const lowStock = await query(
      "SELECT id, pro_name, stock, imageUrl FROM product WHERE visible = 0 AND stock <= 5 ORDER BY stock ASC LIMIT 8"
    );
    const [counts] = await query(
      `SELECT
         (SELECT COUNT(*) FROM product) AS products,
         (SELECT COUNT(*) FROM product WHERE visible = 0) AS visibleProducts,
         (SELECT COUNT(*) FROM category) AS categories,
         (SELECT COUNT(*) FROM user WHERE role = 'CUSTOMER') AS customers,
         (SELECT COUNT(*) FROM contact WHERE is_read = 0) AS unreadContacts`
    ).catch(async () => query(
      `SELECT (SELECT COUNT(*) FROM product) AS products, (SELECT COUNT(*) FROM product WHERE visible = 0) AS visibleProducts,
              (SELECT COUNT(*) FROM category) AS categories, (SELECT COUNT(*) FROM user WHERE role = 'CUSTOMER') AS customers,
              0 AS unreadContacts`
    ));

    const [visitors] = await query(
      `SELECT
         COUNT(DISTINCT CASE WHEN created_at >= UTC_TIMESTAMP() - INTERVAL 5 MINUTE THEN session_id END) AS online,
         COUNT(DISTINCT CASE WHEN DATE(CONVERT_TZ(created_at,'+00:00','+07:00')) = DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00','+07:00')) THEN visitor_id END) AS today,
         COUNT(DISTINCT CASE WHEN DATE(CONVERT_TZ(created_at,'+00:00','+07:00')) = DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00','+07:00')) - INTERVAL 1 DAY THEN visitor_id END) AS yesterday,
         COUNT(DISTINCT CASE WHEN created_at >= UTC_TIMESTAMP() - INTERVAL 30 DAY THEN visitor_id END) AS last30,
         COUNT(CASE WHEN created_at >= UTC_TIMESTAMP() - INTERVAL 30 DAY THEN 1 END) AS pageviews30
       FROM analytics_events WHERE event = 'pageview' AND created_at >= UTC_TIMESTAMP() - INTERVAL 31 DAY`
    ).catch(() => [{}]);

    const years = await query("SELECT DISTINCT YEAR(createdAt) AS y FROM `order` ORDER BY y DESC");

    const n = (v) => Number(v) || 0;
    return json({
      year,
      years: [...new Set([new Date().getFullYear(), ...years.map((r) => n(r.y))])].filter(Boolean).sort((a, b) => b - a),
      totalOrders: n(summary.totalOrders),
      totalRevenue: n(summary.totalRevenue),
      paidOrders: n(summary.paidOrders),
      pendingOrders: n(summary.pendingOrders),
      awaitingVerification: n(summary.awaitingVerification),
      statusCounts: {
        PENDING: n(summary.pendingOrders),
        PAID: n(summary.toShip),
        SHIPPING: n(summary.shipping),
        COMPLETED: n(summary.completed),
        CANCELLED: n(summary.cancelled),
      },
      monthlyData,
      recentOrders: recentOrders.map((o) => ({ ...o, totalPrice: n(o.totalPrice) })),
      topProducts,
      lowStock,
      visitors: Object.fromEntries(Object.entries(visitors || {}).map(([k, v]) => [k, n(v)])),
      counts: Object.fromEntries(Object.entries(counts[0] || counts).map(([k, v]) => [k, n(v)])),
    });
  },
  { roles: STAFF_ROLES }
);
