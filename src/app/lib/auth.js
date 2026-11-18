// Edge-safe session helpers (used by middleware AND route handlers).
// Do NOT import node-only modules (fs, mysql2, crypto) here.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "bm_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
export const STAFF_ROLES = ["ADMIN", "STAFF"];
export const ROLES = ["CUSTOMER", "STAFF", "ADMIN"];

const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-please-set-AUTH_SECRET-0123456789";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET || process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is not configured");
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user) {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload?.id || !ROLES.includes(payload.role)) return null;
    return {
      id: Number(payload.id),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  // COOKIE_SECURE=false lets production run over plain HTTP (e.g. IP-only servers).
  const secure =
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
  return { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge };
}

export const isStaff = (user) => !!user && STAFF_ROLES.includes(user.role);
