import { NextResponse } from "next/server";
import { SESSION_COOKIE, STAFF_ROLES, verifySessionToken } from "@/app/lib/auth";

// Pages/APIs that only ADMIN may use (STAFF is blocked).
const ADMIN_ONLY = [/^\/admin\/user\/staff/, /^\/api\/admin\/user\/staff/];

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const user = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  const isApi = pathname.startsWith("/api/");

  const deny = (status, message) => {
    if (isApi) return NextResponse.json({ error: message }, { status });
    const url = req.nextUrl.clone();
    url.pathname = status === 401 ? "/login" : "/";
    url.search = status === 401 ? `?next=${encodeURIComponent(pathname + search)}` : "";
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!user) return deny(401, "กรุณาเข้าสู่ระบบ");
    if (!STAFF_ROLES.includes(user.role)) return deny(403, "คุณไม่มีสิทธิ์ใช้งานส่วนนี้");
    if (ADMIN_ONLY.some((re) => re.test(pathname)) && user.role !== "ADMIN") {
      return deny(403, "เฉพาะผู้ดูแลระบบเท่านั้น");
    }
  }

  if (pathname.startsWith("/user")) {
    if (!user) return deny(401, "กรุณาเข้าสู่ระบบ");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/user/:path*"],
};
