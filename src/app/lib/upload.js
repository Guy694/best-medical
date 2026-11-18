// Safe image upload helper (server only).
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { HttpError } from "./api";

// Public folders are served from /public (and via /api/media for files added after build).
// Private folders live in /storage and are only served to staff.
export const UPLOAD_FOLDERS = {
  pdimage: { base: "public", dir: "pdimage" },
  categoryimg: { base: "public", dir: "categoryimg" },
  articles: { base: "public", dir: "uploads/articles" },
  payments: { base: "storage", dir: "payments" },
};

function sniffImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf.slice(0, 4).toString() === "GIF8") return "gif";
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return "webp";
  return null;
}

export function folderRoot(folderKey) {
  const f = UPLOAD_FOLDERS[folderKey];
  if (!f) throw new HttpError(400, "โฟลเดอร์ปลายทางไม่ถูกต้อง");
  return path.join(process.cwd(), f.base, ...f.dir.split("/"));
}

/**
 * Validate & save an uploaded image. Returns the URL path (e.g. "/pdimage/123_ab.png"),
 * or null when no file was provided.
 */
export async function saveImage(file, folderKey, { maxBytes = 5 * 1024 * 1024 } = {}) {
  if (!file || typeof file === "string" || !file.size) return null;
  if (file.size > maxBytes) {
    throw new HttpError(400, `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${Math.round(maxBytes / 1024 / 1024)}MB)`);
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(buffer);
  if (!ext) throw new HttpError(400, "รองรับเฉพาะไฟล์รูปภาพ JPG, PNG, WEBP หรือ GIF");

  const root = folderRoot(folderKey);
  await mkdir(root, { recursive: true });
  const fileName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(root, fileName), buffer);

  const f = UPLOAD_FOLDERS[folderKey];
  return f.base === "public" ? `/${f.dir}/${fileName}` : `/api/media/${folderKey}/${fileName}`;
}
