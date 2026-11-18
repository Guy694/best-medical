import { HttpError, str, sanitizeHtml } from "./api";

export const ARTICLE_STATUSES = ["draft", "published", "scheduled"];
const STATUSES = ARTICLE_STATUSES;

export function parseArticle(body, { partial = false } = {}) {
  const out = {};
  if (!partial || body.title !== undefined) out.title = str(body.title, { required: true, max: 255, label: "หัวข้อบทความ" });
  if (!partial || body.content !== undefined) {
    const content = sanitizeHtml(body.content || "");
    if (!content.replace(/<[^>]*>/g, "").trim() && !/<img/i.test(content)) throw new HttpError(400, "กรุณากรอกเนื้อหาบทความ");
    out.content = content;
  }
  if (body.excerpt !== undefined || !partial) {
    out.excerpt =
      str(body.excerpt, { max: 1000, label: "คำโปรย" }) ||
      (out.content ? out.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200) : null);
  }
  if (body.banner !== undefined) out.banner = str(body.banner, { max: 500, label: "รูปปก" });
  if (body.category !== undefined) out.category = str(body.category, { max: 100, label: "หมวดหมู่" });
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) throw new HttpError(400, "สถานะบทความไม่ถูกต้อง");
    out.status = body.status;
  }
  if (body.published_at !== undefined) {
    const d = body.published_at ? new Date(body.published_at) : null;
    if (d && isNaN(d)) throw new HttpError(400, "วันที่เผยแพร่ไม่ถูกต้อง");
    out.published_at = d;
  }
  return out;
}

