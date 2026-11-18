// Server-side analytics helpers (no external service, no IP stored).
import { query } from "./db";

export const TZ = "+07:00"; // reports are shown in Thailand time

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|line-poker|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|axios|node-fetch|go-http|java\//i;

export const isBot = (ua = "") => !ua || BOT_RE.test(ua);

export function parseUA(ua = "") {
  const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const browser = /edg\//i.test(ua) ? "Edge"
    : /line\//i.test(ua) ? "LINE"
    : /fban|fbav|fb_iab/i.test(ua) ? "Facebook"
    : /samsungbrowser/i.test(ua) ? "Samsung"
    : /opr\/|opera/i.test(ua) ? "Opera"
    : /firefox|fxios/i.test(ua) ? "Firefox"
    : /chrome|crios/i.test(ua) ? "Chrome"
    : /safari/i.test(ua) ? "Safari" : "อื่นๆ";
  const os = /windows/i.test(ua) ? "Windows"
    : /iphone|ipad|ipod/i.test(ua) ? "iOS"
    : /android/i.test(ua) ? "Android"
    : /mac os/i.test(ua) ? "macOS"
    : /linux/i.test(ua) ? "Linux" : "อื่นๆ";
  return { device, browser, os };
}

/** Classify traffic source from referrer host + utm_source. */
export function classifySource(referrer, utm, selfHost) {
  if (utm) return utm.toLowerCase().slice(0, 100);
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
  if (!host || (selfHost && host === selfHost.replace(/^www\./, ""))) return null; // internal navigation
  if (/google\./.test(host)) return "google";
  if (/facebook\.com|fb\.com|fb\.me|messenger\.com/.test(host)) return "facebook";
  if (/line\.me|line\.naver/.test(host)) return "line";
  if (/bing\.com/.test(host)) return "bing";
  if (/youtube\.com|youtu\.be/.test(host)) return "youtube";
  if (/tiktok\.com/.test(host)) return "tiktok";
  if (/instagram\.com/.test(host)) return "instagram";
  if (/shopee|lazada/.test(host)) return host.includes("shopee") ? "shopee" : "lazada";
  return host.slice(0, 100);
}

export const validId = (v) => typeof v === "string" && /^[a-z0-9]{16}$/.test(v);

/** Record an event originating from the server (e.g. a purchase). Never throws. */
export async function recordServerEvent(req, event, { value = null, ref_code = null, product_id = null } = {}) {
  try {
    const vid = req.headers.get("x-bm-vid");
    const sid = req.headers.get("x-bm-sid");
    if (!validId(vid) || !validId(sid)) return;
    const { device, browser, os } = parseUA(req.headers.get("user-agent") || "");
    await query(
      `INSERT INTO analytics_events (event, visitor_id, session_id, path, product_id, device, browser, os, value, ref_code, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [event, vid, sid, "/cart", product_id, device, browser, os, value, ref_code]
    );
  } catch (err) {
    console.warn("[analytics] server event skipped:", err.message);
  }
}

/** Parse ?from=YYYY-MM-DD&to=YYYY-MM-DD (Thai dates) into a UTC range + day list. */
export function parseRange(sp, defaultDays = 30) {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  const todayTH = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  let to = re.test(sp.get("to") || "") ? sp.get("to") : todayTH;
  let from = re.test(sp.get("from") || "") ? sp.get("from") : null;
  if (!from) {
    const d = new Date(`${to}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - (defaultDays - 1));
    from = d.toISOString().slice(0, 10);
  }
  if (from > to) [from, to] = [to, from];
  // cap at 400 days
  const maxFrom = new Date(`${to}T00:00:00Z`);
  maxFrom.setUTCDate(maxFrom.getUTCDate() - 399);
  if (new Date(`${from}T00:00:00Z`) < maxFrom) from = maxFrom.toISOString().slice(0, 10);

  const days = [];
  for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  // Thai local midnight → UTC
  const startUtc = new Date(new Date(`${from}T00:00:00+07:00`).getTime()).toISOString().slice(0, 19).replace("T", " ");
  const endUtc = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + 86400e3).toISOString().slice(0, 19).replace("T", " ");

  // previous period of equal length (for % change)
  const len = days.length * 86400e3;
  const prevStart = new Date(new Date(`${from}T00:00:00+07:00`).getTime() - len).toISOString().slice(0, 19).replace("T", " ");
  return { from, to, days, startUtc, endUtc, prevStart, prevEnd: startUtc };
}

/** Same range for tables whose timestamps are stored in server local time (orders). */
export const localRange = (r) => ({ start: `${r.from} 00:00:00`, end: `${r.to} 23:59:59.999` });
