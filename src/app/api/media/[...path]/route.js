import { readFile, stat } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/app/lib/api";
import { isStaff } from "@/app/lib/auth";
import { folderRoot } from "@/app/lib/upload";

const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };

// Folders whose files are public but may be added after `next build`
// (Next.js only serves /public files that existed at build time).
const PUBLIC = { pdimage: "pdimage", categoryimg: "categoryimg", uploads: "articles" };

/**
 * GET /api/media/<folder>/<file>
 *  - pdimage / categoryimg / uploads/articles : public
 *  - payments : staff only (payment slips are private)
 */
export async function GET(req, ctx) {
  const parts = (await ctx.params).path || [];
  const [folder, ...rest] = parts;
  let root;
  let fileParts = rest;

  try {
    if (folder === "payments") {
      const user = await getCurrentUser();
      if (!isStaff(user)) return new Response("Forbidden", { status: 403 });
      root = folderRoot("payments");
    } else if (folder === "uploads" && rest[0] === "articles") {
      root = folderRoot("articles");
      fileParts = rest.slice(1);
    } else if (PUBLIC[folder]) {
      root = folderRoot(PUBLIC[folder]);
    } else {
      return new Response("Not found", { status: 404 });
    }

    const name = fileParts.join("/");
    const ext = path.extname(name).slice(1).toLowerCase();
    if (!MIME[ext] || name.includes("..") || name.includes("\0")) return new Response("Not found", { status: 404 });

    const bases = [root];
    // legacy slips were stored in /public/payments
    if (folder === "payments") bases.push(path.join(process.cwd(), "public", "payments"));

    for (const base of bases) {
      const file = path.resolve(base, name);
      if (!file.startsWith(path.resolve(base) + path.sep)) continue;
      try {
        const s = await stat(file);
        if (!s.isFile()) continue;
        const data = await readFile(file);
        return new Response(data, {
          headers: {
            "Content-Type": MIME[ext],
            "Cache-Control": folder === "payments" ? "private, no-store" : "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
            ...(ext === "svg" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } : {}),
          },
        });
      } catch {}
    }
    return new Response("Not found", { status: 404 });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
