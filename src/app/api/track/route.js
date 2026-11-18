import { query } from "@/app/lib/db";
import { getCurrentUser, rateLimit } from "@/app/lib/api";
import { isStaff } from "@/app/lib/auth";
import { isBot, parseUA, classifySource, validId } from "@/app/lib/analytics";

const EVENTS = ["pageview", "add_to_cart", "begin_checkout", "search"];
const NO_CONTENT = () => new Response(null, { status: 204 });

// POST /api/track – collects storefront analytics (sent with navigator.sendBeacon)
export async function POST(req) {
  try {
    const ua = req.headers.get("user-agent") || "";
    if (isBot(ua) || req.headers.get("dnt") === "1") return NO_CONTENT();
    try {
      rateLimit(req, "track", { limit: 120, windowMs: 60_000 });
    } catch {
      return NO_CONTENT();
    }
    // staff browsing their own shop would skew the numbers
    if (isStaff(await getCurrentUser())) return NO_CONTENT();

    const b = await req.json().catch(() => null);
    if (!b || !EVENTS.includes(b.e) || !validId(b.vid) || !validId(b.sid)) return NO_CONTENT();

    let url;
    try {
      url = new URL(String(b.path || "/"), "http://x");
    } catch {
      return NO_CONTENT();
    }
    const path = url.pathname.slice(0, 255);
    if (path.startsWith("/admin") || path.startsWith("/api")) return NO_CONTENT();

    const productMatch = path.match(/^\/product\/(\d+)/);
    const productId = Number(b.pid) || (productMatch ? Number(productMatch[1]) : null);
    const search = (b.q || (path === "/product" ? url.searchParams.get("q") : "") || "").trim().slice(0, 100) || null;

    let source = null;
    let referrer = null;
    if (b.e === "pageview" && b.landing) {
      const selfHost = req.headers.get("host")?.split(":")[0];
      source = classifySource(b.ref, url.searchParams.get("utm_source"), selfHost) || "direct";
      try {
        referrer = b.ref ? new URL(b.ref).hostname.slice(0, 255) : null;
      } catch {}
    }
    const { device, browser, os } = parseUA(ua);
    const value = b.value != null && Number.isFinite(Number(b.value)) ? Math.min(Math.abs(Number(b.value)), 9999999) : null;

    await query(
      `INSERT INTO analytics_events
        (event, visitor_id, session_id, path, product_id, search, referrer, source, device, browser, os, is_new, value, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [b.e, b.vid, b.sid, path, productId || null, search, referrer, source, device, browser, os, b.isNew ? 1 : 0, value]
    );

    // occasional housekeeping: keep ~13 months of raw events
    if (Math.random() < 0.002) {
      query("DELETE FROM analytics_events WHERE created_at < UTC_TIMESTAMP() - INTERVAL 400 DAY").catch(() => {});
    }
  } catch (err) {
    console.warn("[track]", err.message);
  }
  return NO_CONTENT();
}
