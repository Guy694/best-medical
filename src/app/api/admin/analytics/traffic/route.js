import { query } from "@/app/lib/db";
import { route, json } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { parseRange, TZ } from "@/app/lib/analytics";

const LOCAL = `CONVERT_TZ(created_at, '+00:00', '${TZ}')`;
const n = (v) => Number(v) || 0;

async function summary(start, end) {
  const [s] = await query(
    `SELECT COUNT(DISTINCT visitor_id) AS visitors,
            COUNT(DISTINCT CASE WHEN is_new = 1 THEN visitor_id END) AS newVisitors,
            COUNT(DISTINCT session_id) AS sessions,
            COUNT(*) AS pageviews
     FROM analytics_events WHERE event = 'pageview' AND created_at >= ? AND created_at < ?`,
    [start, end]
  );
  const [b] = await query(
    `SELECT COUNT(*) AS sessions, SUM(pv = 1) AS bounced, AVG(TIMESTAMPDIFF(SECOND, t0, t1)) AS avgDuration
     FROM (SELECT session_id, COUNT(*) AS pv, MIN(created_at) AS t0, MAX(created_at) AS t1
           FROM analytics_events WHERE event = 'pageview' AND created_at >= ? AND created_at < ?
           GROUP BY session_id) x`,
    [start, end]
  );
  const [p] = await query(
    `SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS orders, COALESCE(SUM(value), 0) AS value
     FROM analytics_events WHERE event = 'purchase' AND created_at >= ? AND created_at < ?`,
    [start, end]
  );
  const sessions = n(s.sessions);
  return {
    visitors: n(s.visitors),
    newVisitors: n(s.newVisitors),
    returningVisitors: Math.max(n(s.visitors) - n(s.newVisitors), 0),
    sessions,
    pageviews: n(s.pageviews),
    pagesPerSession: sessions ? n(s.pageviews) / sessions : 0,
    bounceRate: n(b.sessions) ? (n(b.bounced) / n(b.sessions)) * 100 : 0,
    avgDuration: n(b.avgDuration),
    purchases: n(p.orders),
    purchaseValue: n(p.value),
    conversionRate: sessions ? (n(p.sessions) / sessions) * 100 : 0,
  };
}

// GET /api/admin/analytics/traffic?from=YYYY-MM-DD&to=YYYY-MM-DD
export const GET = route(
  async (req) => {
    const r = parseRange(req.nextUrl.searchParams);
    const args = [r.startUtc, r.endUtc];
    const W = "created_at >= ? AND created_at < ?";

    const [current, previous] = await Promise.all([summary(r.startUtc, r.endUtc), summary(r.prevStart, r.prevEnd)]);

    const [daily, hourly, pages, sources, devices, browsers, oses, searches, funnel, [online]] = await Promise.all([
      query(
        `SELECT DATE_FORMAT(${LOCAL}, '%Y-%m-%d') AS d, COUNT(DISTINCT visitor_id) AS visitors,
                COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS pageviews
         FROM analytics_events WHERE event = 'pageview' AND ${W} GROUP BY d`,
        args
      ),
      query(
        `SELECT WEEKDAY(${LOCAL}) AS dow, HOUR(${LOCAL}) AS h, COUNT(*) AS c
         FROM analytics_events WHERE event = 'pageview' AND ${W} GROUP BY dow, h`,
        args
      ),
      query(
        `SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
         FROM analytics_events WHERE event = 'pageview' AND ${W} GROUP BY path ORDER BY views DESC LIMIT 15`,
        args
      ),
      query(
        `SELECT COALESCE(source, 'direct') AS name, COUNT(DISTINCT session_id) AS value
         FROM analytics_events WHERE event = 'pageview' AND source IS NOT NULL AND ${W}
         GROUP BY name ORDER BY value DESC LIMIT 12`,
        args
      ),
      query(`SELECT device AS name, COUNT(DISTINCT session_id) AS value FROM analytics_events WHERE event='pageview' AND ${W} GROUP BY name ORDER BY value DESC`, args),
      query(`SELECT browser AS name, COUNT(DISTINCT session_id) AS value FROM analytics_events WHERE event='pageview' AND ${W} GROUP BY name ORDER BY value DESC LIMIT 8`, args),
      query(`SELECT os AS name, COUNT(DISTINCT session_id) AS value FROM analytics_events WHERE event='pageview' AND ${W} GROUP BY name ORDER BY value DESC LIMIT 8`, args),
      query(
        `SELECT LOWER(search) AS term, COUNT(*) AS c, COUNT(DISTINCT visitor_id) AS visitors
         FROM analytics_events WHERE search IS NOT NULL AND search <> '' AND ${W}
         GROUP BY term ORDER BY c DESC LIMIT 20`,
        args
      ),
      query(
        `SELECT COUNT(DISTINCT session_id) AS sessions,
                COUNT(DISTINCT CASE WHEN event='pageview' AND product_id IS NOT NULL THEN session_id END) AS viewedProduct,
                COUNT(DISTINCT CASE WHEN event='add_to_cart' THEN session_id END) AS addedToCart,
                COUNT(DISTINCT CASE WHEN event='pageview' AND path='/cart' THEN session_id END) AS viewedCart,
                COUNT(DISTINCT CASE WHEN event='purchase' THEN session_id END) AS purchased
         FROM analytics_events WHERE ${W}`,
        args
      ),
      query(
        `SELECT COUNT(DISTINCT session_id) AS online FROM analytics_events
         WHERE event='pageview' AND created_at >= UTC_TIMESTAMP() - INTERVAL 5 MINUTE`
      ),
    ]);

    // friendly page titles
    const productIds = pages.map((p) => p.path.match(/^\/product\/(\d+)/)?.[1]).filter(Boolean).map(Number);
    const categoryIds = pages.map((p) => p.path.match(/^\/category\/(\d+)/)?.[1]).filter(Boolean).map(Number);
    const articleIds = pages.map((p) => p.path.match(/^\/article\/(\d+)/)?.[1]).filter(Boolean).map(Number);
    const [prods, cats, arts] = await Promise.all([
      productIds.length ? query(`SELECT id, pro_name AS name FROM product WHERE id IN (${productIds.join(",")})`) : [],
      categoryIds.length ? query(`SELECT id, cate_name AS name FROM category WHERE id IN (${categoryIds.join(",")})`) : [],
      articleIds.length ? query(`SELECT id, title AS name FROM articles WHERE id IN (${articleIds.join(",")})`) : [],
    ]);
    const nameOf = (list, id) => list.find((x) => x.id === id)?.name;
    const STATIC = {
      "/": "หน้าหลัก", "/product": "สินค้าทั้งหมด", "/cart": "ตะกร้าสินค้า", "/payment-notice": "แจ้งชำระเงิน",
      "/paidstatus": "ตรวจสอบสถานะ", "/howtopay": "วิธีสั่งซื้อ/ชำระเงิน", "/contact": "ติดต่อเรา", "/article": "บทความ",
      "/qa": "คำถามที่พบบ่อย", "/login": "เข้าสู่ระบบ", "/register": "สมัครสมาชิก", "/user/history": "ประวัติการสั่งซื้อ",
    };
    const titled = pages.map((p) => {
      let title = STATIC[p.path];
      let m;
      if ((m = p.path.match(/^\/product\/(\d+)/))) title = nameOf(prods, Number(m[1])) || `สินค้า #${m[1]}`;
      else if ((m = p.path.match(/^\/category\/(\d+)/))) title = `หมวด: ${nameOf(cats, Number(m[1])) || m[1]}`;
      else if ((m = p.path.match(/^\/article\/(\d+)/))) title = `บทความ: ${nameOf(arts, Number(m[1])) || m[1]}`;
      else if (p.path.startsWith("/orderNumber/")) title = "หน้ายืนยันคำสั่งซื้อ";
      else if (p.path.startsWith("/order-status/")) title = "รายละเอียดคำสั่งซื้อ";
      return { ...p, title: title || p.path, views: n(p.views), visitors: n(p.visitors) };
    });

    // searches that return no product → demand the shop is not serving
    const withResults = await Promise.all(
      searches.map(async (s) => {
        const [{ c }] = await query(
          "SELECT COUNT(*) AS c FROM product WHERE visible = 0 AND (pro_name LIKE ? OR codename LIKE ? OR description LIKE ?)",
          [`%${s.term}%`, `%${s.term}%`, `%${s.term}%`]
        );
        return { term: s.term, count: n(s.c), visitors: n(s.visitors), results: n(c) };
      })
    );

    const heat = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const h of hourly) heat[n(h.dow)][n(h.h)] = n(h.c);

    const f = funnel[0] || {};
    const toList = (rows) => rows.map((x) => ({ name: x.name || "ไม่ทราบ", value: n(x.value) }));

    return json({
      range: { from: r.from, to: r.to, days: r.days.length },
      online: n(online?.online),
      current,
      previous,
      daily: r.days.map((d) => {
        const row = daily.find((x) => x.d === d);
        return { date: d, visitors: n(row?.visitors), sessions: n(row?.sessions), pageviews: n(row?.pageviews) };
      }),
      heatmap: heat,
      topPages: titled,
      sources: toList(sources),
      devices: toList(devices),
      browsers: toList(browsers),
      os: toList(oses),
      searches: withResults,
      funnel: [
        { key: "sessions", label: "เข้าชมเว็บไซต์", value: n(f.sessions) },
        { key: "viewedProduct", label: "ดูหน้าสินค้า", value: n(f.viewedProduct) },
        { key: "addedToCart", label: "เพิ่มลงตะกร้า", value: n(f.addedToCart) },
        { key: "viewedCart", label: "เปิดตะกร้าสินค้า", value: n(f.viewedCart) },
        { key: "purchased", label: "สั่งซื้อสำเร็จ", value: n(f.purchased) },
      ],
    });
  },
  { roles: STAFF_ROLES }
);
