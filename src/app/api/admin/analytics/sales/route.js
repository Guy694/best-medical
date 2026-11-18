import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { parseRange } from "@/app/lib/analytics";
import { parseItems, itemProductId } from "@/app/lib/orders";

const PAID = ["PAID", "SHIPPING", "COMPLETED"];
const n = (v) => Number(v) || 0;
const fmt = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

function summarize(orders, firstOrderAt, start) {
  const valid = orders.filter((o) => o.status !== "CANCELLED");
  const paid = orders.filter((o) => PAID.includes(o.status));
  const revenue = paid.reduce((s, o) => s + n(o.totalPrice), 0);
  const customers = new Set(valid.map((o) => o.order_email?.toLowerCase()));
  let newCustomers = 0;
  for (const email of customers) {
    const first = firstOrderAt.get(email);
    if (first && first >= start) newCustomers++;
  }
  const itemsSold = paid.reduce((s, o) => s + parseItems(o.items).reduce((a, i) => a + n(i.quantity), 0), 0);
  return {
    orders: orders.length,
    validOrders: valid.length,
    paidOrders: paid.length,
    revenue,
    aov: paid.length ? revenue / paid.length : 0,
    cancelled: orders.length - valid.length,
    cancelRate: orders.length ? ((orders.length - valid.length) / orders.length) * 100 : 0,
    pendingValue: orders.filter((o) => o.status === "PENDING").reduce((s, o) => s + n(o.totalPrice), 0),
    itemsSold,
    customers: customers.size,
    newCustomers,
    returningCustomers: Math.max(customers.size - newCustomers, 0),
  };
}

// GET /api/admin/analytics/sales?from=&to=   (order timestamps are server-local time)
export const GET = route(
  async (req) => {
    const r = parseRange(req.nextUrl.searchParams);
    const start = new Date(`${r.from}T00:00:00`);
    const end = new Date(`${r.to}T00:00:00`);
    end.setDate(end.getDate() + 1);
    const prevStart = new Date(start.getTime() - (end - start));

    const [orders, prevOrders, firsts, products] = await Promise.all([
      query("SELECT order_id, order_code, order_email, fullName, totalPrice, shipping, shipping_cost, items, status, createdAt FROM `order` WHERE createdAt >= ? AND createdAt < ?", [start, end]),
      query("SELECT order_id, order_email, totalPrice, items, status FROM `order` WHERE createdAt >= ? AND createdAt < ?", [prevStart, start]),
      query("SELECT LOWER(order_email) AS email, MIN(createdAt) AS first FROM `order` WHERE status <> 'CANCELLED' GROUP BY LOWER(order_email)"),
      query("SELECT p.id, p.pro_name, p.imageUrl, p.categoryId, c.cate_name FROM product p LEFT JOIN category c ON c.id = p.categoryId"),
    ]);
    const firstOrderAt = new Map(firsts.map((f) => [f.email, new Date(f.first)]));
    const productMap = new Map(products.map((p) => [p.id, p]));

    const current = summarize(orders, firstOrderAt, start);
    const previous = summarize(prevOrders, firstOrderAt, prevStart);

    const daily = r.days.map((d) => ({ date: d, revenue: 0, orders: 0, paidOrders: 0 }));
    const dayIndex = new Map(daily.map((d, i) => [d.date, i]));
    const weekday = Array.from({ length: 7 }, () => ({ orders: 0, revenue: 0 }));
    const byStatus = {};
    const byShipping = {};
    const prodStats = new Map();
    const catStats = new Map();
    const custStats = new Map();

    for (const o of orders) {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      const idx = dayIndex.get(fmt(o.createdAt));
      if (idx != null) daily[idx].orders++;
      if (o.status === "CANCELLED") continue;
      const ship = o.shipping === "store" ? "รับที่ร้าน" : "จัดส่งพัสดุ";
      byShipping[ship] = (byShipping[ship] || 0) + 1;
      if (!PAID.includes(o.status)) continue;

      const total = n(o.totalPrice);
      if (idx != null) {
        daily[idx].revenue += total;
        daily[idx].paidOrders++;
      }
      const wd = (new Date(o.createdAt).getDay() + 6) % 7; // Monday = 0
      weekday[wd].orders++;
      weekday[wd].revenue += total;

      const email = o.order_email?.toLowerCase();
      const c = custStats.get(email) || { email: o.order_email, name: o.fullName, orders: 0, spent: 0 };
      c.orders++;
      c.spent += total;
      if (o.fullName) c.name = o.fullName;
      custStats.set(email, c);

      for (const it of parseItems(o.items)) {
        const id = itemProductId(it);
        const qty = n(it.quantity);
        const rev = n(it.price) * qty;
        const p = productMap.get(id);
        const ps = prodStats.get(id) || { id, name: p?.pro_name || it.name, image: p?.imageUrl || it.image, quantity: 0, revenue: 0, orders: 0 };
        ps.quantity += qty;
        ps.revenue += rev;
        ps.orders++;
        prodStats.set(id, ps);
        const catName = p?.cate_name || "ไม่ระบุหมวดหมู่";
        const cs = catStats.get(catName) || { name: catName, revenue: 0, quantity: 0 };
        cs.revenue += rev;
        cs.quantity += qty;
        catStats.set(catName, cs);
      }
    }

    return json({
      range: { from: r.from, to: r.to, days: r.days.length },
      current,
      previous,
      daily,
      weekday,
      byStatus,
      byShipping: Object.entries(byShipping).map(([name, value]) => ({ name, value })),
      topProducts: [...prodStats.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      categories: [...catStats.values()].sort((a, b) => b.revenue - a.revenue),
      topCustomers: [...custStats.values()].sort((a, b) => b.spent - a.spent).slice(0, 10),
    });
  },
  { roles: STAFF_ROLES }
);
