import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { parseRange } from "@/app/lib/analytics";
import { parseItems, itemProductId } from "@/app/lib/orders";

const n = (v) => Number(v) || 0;

// GET /api/admin/analytics/products?from=&to= – per-product interest vs sales
export const GET = route(
  async (req) => {
    const r = parseRange(req.nextUrl.searchParams);
    const start = new Date(`${r.from}T00:00:00`);
    const end = new Date(`${r.to}T00:00:00`);
    end.setDate(end.getDate() + 1);

    const [products, events, orders] = await Promise.all([
      query(
        `SELECT p.id, p.pro_name, p.codename, p.price, p.stock, p.imageUrl, p.visible, c.cate_name
         FROM product p LEFT JOIN category c ON c.id = p.categoryId`
      ),
      query(
        `SELECT product_id,
                SUM(event = 'pageview') AS views,
                COUNT(DISTINCT CASE WHEN event = 'pageview' THEN visitor_id END) AS viewers,
                SUM(event = 'add_to_cart') AS carts
         FROM analytics_events
         WHERE product_id IS NOT NULL AND created_at >= ? AND created_at < ?
         GROUP BY product_id`,
        [r.startUtc, r.endUtc]
      ),
      query(
        "SELECT items FROM `order` WHERE status IN ('PAID','SHIPPING','COMPLETED') AND createdAt >= ? AND createdAt < ?",
        [start, end]
      ),
    ]);

    const sold = new Map();
    for (const o of orders) {
      for (const it of parseItems(o.items)) {
        const id = itemProductId(it);
        const s = sold.get(id) || { quantity: 0, revenue: 0, orders: 0 };
        s.quantity += n(it.quantity);
        s.revenue += n(it.price) * n(it.quantity);
        s.orders++;
        sold.set(id, s);
      }
    }
    const ev = new Map(events.map((e) => [n(e.product_id), e]));

    const rows = products.map((p) => {
      const e = ev.get(p.id) || {};
      const s = sold.get(p.id) || {};
      const views = n(e.views);
      const carts = n(e.carts);
      const ordersCount = n(s.orders);
      return {
        id: p.id,
        name: p.pro_name,
        codename: p.codename,
        category: p.cate_name,
        image: p.imageUrl,
        price: n(p.price),
        stock: n(p.stock),
        hidden: n(p.visible) !== 0,
        views,
        viewers: n(e.viewers),
        carts,
        sold: n(s.quantity),
        orders: ordersCount,
        revenue: n(s.revenue),
        cartRate: views ? (carts / views) * 100 : 0,
        buyRate: views ? (ordersCount / views) * 100 : 0,
      };
    });

    const totals = rows.reduce(
      (t, x) => ({ views: t.views + x.views, carts: t.carts + x.carts, sold: t.sold + x.sold, revenue: t.revenue + x.revenue }),
      { views: 0, carts: 0, sold: 0, revenue: 0 }
    );

    return json({
      range: { from: r.from, to: r.to, days: r.days.length },
      totals,
      products: rows.sort((a, b) => b.views - a.views || b.revenue - a.revenue),
      insights: {
        // many views but no sales → check price/photos/description
        viewedNotBought: rows.filter((x) => x.views >= 5 && x.sold === 0 && x.price > 0).sort((a, b) => b.views - a.views).slice(0, 8),
        // "contact for price" items people look at → sales leads
        priceOnRequest: rows.filter((x) => x.price <= 0 && x.views > 0).sort((a, b) => b.views - a.views).slice(0, 8),
        // interest but out of stock → restock
        outOfStockDemand: rows.filter((x) => x.stock <= 0 && (x.views > 0 || x.carts > 0)).sort((a, b) => b.views - a.views).slice(0, 8),
        // visible products nobody viewed
        noViews: rows.filter((x) => !x.hidden && x.views === 0).length,
      },
    });
  },
  { roles: STAFF_ROLES }
);
