import { route, json, HttpError } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { saveImage } from "@/app/lib/upload";

const PUBLIC_FOLDERS = ["pdimage", "categoryimg", "articles"];

// POST /api/upload (staff) – multipart { file, folder: pdimage|categoryimg|articles }
export const POST = route(
  async (req) => {
    const fd = await req.formData();
    const folder = fd.get("folder") || "articles";
    if (!PUBLIC_FOLDERS.includes(folder)) throw new HttpError(400, "โฟลเดอร์ไม่ถูกต้อง");
    const url = await saveImage(fd.get("file"), folder);
    if (!url) throw new HttpError(400, "ไม่พบไฟล์");
    return json({ success: true, message: "อัปโหลดสำเร็จ", url, imageUrl: url });
  },
  { roles: STAFF_ROLES }
);
