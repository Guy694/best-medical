import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

// GET /api/verify?token=...  → redirects to /login with a status flag
export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");
  const to = (status) => NextResponse.redirect(new URL(`/login?verified=${status}`, req.url));
  if (!token || !/^[a-f0-9]{20,100}$/i.test(token)) return to("invalid");
  try {
    const result = await query(
      "UPDATE user SET verified = 1, verify_token = NULL WHERE verify_token = ? AND verified = 0",
      [token]
    );
    return to(result.affectedRows ? "success" : "invalid");
  } catch (err) {
    console.error("[verify]", err);
    return to("error");
  }
}
