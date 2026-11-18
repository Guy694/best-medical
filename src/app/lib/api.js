// Shared helpers for route handlers: errors, auth guards, input parsing.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

export const json = (data, init) => NextResponse.json(data, init);

export async function getCurrentUser() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireUser(roles) {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "กรุณาเข้าสู่ระบบ");
  if (roles && !roles.includes(user.role)) throw new HttpError(403, "คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
  return user;
}

export function handleError(err, name = "api") {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message, ...err.extra }, { status: err.status });
  }
  if (err?.code === "ER_DUP_ENTRY") {
    return NextResponse.json({ error: "ข้อมูลนี้มีอยู่ในระบบแล้ว" }, { status: 409 });
  }
  console.error(`[${name}]`, err);
  return NextResponse.json(
    { error: "เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง" },
    { status: 500 }
  );
}

/**
 * Wrap a route handler with error handling and optional role guard.
 *   export const GET = route(async (req, { params, user }) => {...}, { roles: STAFF_ROLES })
 */
export function route(handler, { roles, name } = {}) {
  return async (req, ctx = {}) => {
    try {
      const user = roles ? await requireUser(roles) : await getCurrentUser();
      const params = ctx.params ? await ctx.params : {};
      return await handler(req, { params, user });
    } catch (err) {
      return handleError(err, name || req?.nextUrl?.pathname);
    }
  };
}

// ---------- input helpers ----------
export function str(value, { max = 255, required = false, label = "ข้อมูล" } = {}) {
  const v = value == null ? "" : String(value).trim();
  if (required && !v) throw new HttpError(400, `กรุณากรอก${label}`);
  if (v.length > max) throw new HttpError(400, `${label}ยาวเกินไป (สูงสุด ${max} ตัวอักษร)`);
  return v || null;
}

export function int(value, { min = -Infinity, max = Infinity, label = "ตัวเลข", fallback } = {}) {
  if ((value === "" || value == null) && fallback !== undefined) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new HttpError(400, `${label}ไม่ถูกต้อง`);
  return n;
}

export function money(value, { label = "จำนวนเงิน", fallback } = {}) {
  if ((value === "" || value == null) && fallback !== undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 99999999) throw new HttpError(400, `${label}ไม่ถูกต้อง`);
  return Math.round(n * 100) / 100;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function email(value, { required = true } = {}) {
  const v = value == null ? "" : String(value).trim().toLowerCase();
  if (!v && !required) return null;
  if (!EMAIL_RE.test(v) || v.length > 191) throw new HttpError(400, "รูปแบบอีเมลไม่ถูกต้อง");
  return v;
}

export function phone(value, { required = false } = {}) {
  const v = value == null ? "" : String(value).replace(/[\s-]/g, "");
  if (!v && !required) return null;
  if (!/^0\d{8,9}$/.test(v)) throw new HttpError(400, "เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0)");
  return v;
}

// ---------- very small in-memory rate limiter (per process) ----------
const buckets = new Map();
export function rateLimit(req, key, { limit = 10, windowMs = 60_000 } = {}) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const entry = buckets.get(id);
  if (!entry || entry.reset < now) {
    buckets.set(id, { count: 1, reset: now + windowMs });
  } else if (++entry.count > limit) {
    throw new HttpError(429, "ทำรายการบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่");
  }
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }
}

// Strip dangerous markup from rich-text HTML (articles).
export function sanitizeHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*(javascript|vbscript|data:text\/html)[^"']*\2/gi, '$1="#"');
}
