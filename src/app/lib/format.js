// Client-side formatting & display helpers.

export const formatTHB = (value, { decimals = 2 } = {}) =>
  `฿${Number(value || 0).toLocaleString("th-TH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

/** Price display – products priced 0 are "contact for price". */
export const priceLabel = (price) => (Number(price) > 0 ? formatTHB(price) : "สอบถามราคา");
export const isPurchasable = (p) => Number(p?.price) > 0 && Number(p?.stock) > 0;

export const formatDate = (value, opts = {}) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", ...opts });
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return d.toLocaleString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

/** Normalise legacy absolute image URLs (http://host/best-medical/public/x.png → /x.png). */
export function imgSrc(url, fallback = "/placeholder.png") {
  if (!url) return fallback;
  const s = String(url).trim();
  const m = s.match(/\/best-medical\/public(\/.*)$/);
  if (m) return m[1];
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s;
  return `/${s}`;
}

/** Slip URLs: legacy files live in /public/payments, new ones under /api/media/payments. */
export const slipSrc = (url) => (url ? imgSrc(url, "") : "");

export const ORDER_STATUS = {
  PENDING: { label: "รอชำระเงิน", tone: "amber" },
  VERIFYING: { label: "รอตรวจสอบการชำระ", tone: "sky" },
  PAID: { label: "ชำระเงินแล้ว", tone: "blue" },
  SHIPPING: { label: "กำลังจัดส่ง", tone: "violet" },
  COMPLETED: { label: "สำเร็จ", tone: "emerald" },
  CANCELLED: { label: "ยกเลิก", tone: "red" },
};

/** Effective display status (PENDING + payment reported → VERIFYING). */
export const displayStatus = (order) =>
  order?.status === "PENDING" && (order.payment_reported || order.paidAtdate) ? "VERIFYING" : order?.status;

export const TONES = {
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  blue: "bg-brand-50 text-brand-700 ring-brand-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

/** fetch JSON helper that throws Error(message-from-api) on non-2xx. */
export async function api(url, { method = "GET", body, headers, ...rest } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: isForm || body === undefined ? headers : { "Content-Type": "application/json", ...headers },
    body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    ...rest,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const err = new Error(data?.error || `เกิดข้อผิดพลาด (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const cn = (...classes) => classes.filter(Boolean).join(" ");
