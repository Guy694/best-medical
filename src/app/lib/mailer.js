// Email helper. Credentials come from environment variables only.
import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user, pass },
      })
    : nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  return transporter;
}

export const siteUrl = () =>
  (process.env.SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function layout(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Tahoma,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#0b4f8a;color:#fff;padding:20px 24px;font-size:18px;font-weight:bold">บริษัท เบสท เมดิคอล จำกัด</td></tr>
    <tr><td style="padding:24px;color:#0f172a;font-size:15px;line-height:1.7">
      <h2 style="margin:0 0 12px;font-size:18px">${title}</h2>${body}
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px">อีเมลนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับ</td></tr>
  </table></td></tr></table></body></html>`;
}

const button = (href, label) =>
  `<p style="margin:20px 0"><a href="${href}" style="background:#0b4f8a;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;display:inline-block">${label}</a></p>`;

/** Send mail; never throws (logs instead) so business flows are not blocked. */
export async function sendMail({ to, subject, title, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured – skipped email "${subject}" to ${to}`);
    return false;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || `"Best Medical" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: layout(title || subject, html),
    });
    return true;
  } catch (err) {
    console.error("[mailer] send failed:", err.message);
    return false;
  }
}

export const templates = {
  verify: (url) =>
    `<p>ขอบคุณที่สมัครสมาชิกกับเรา กรุณายืนยันอีเมลของคุณโดยคลิกปุ่มด้านล่าง</p>${button(url, "ยืนยันอีเมล")}
     <p style="color:#64748b;font-size:13px">หากปุ่มไม่ทำงาน ให้คัดลอกลิงก์นี้: ${url}</p>`,
  reset: (url) =>
    `<p>เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณ ลิงก์นี้ใช้ได้ภายใน 1 ชั่วโมง</p>${button(url, "ตั้งรหัสผ่านใหม่")}
     <p style="color:#64748b;font-size:13px">หากคุณไม่ได้ร้องขอ สามารถเพิกเฉยอีเมลนี้ได้</p>`,
  order: (order, items) => {
    const rows = items
      .map(
        (i) =>
          `<tr><td style="padding:6px 0">${escapeHtml(i.name)} × ${i.quantity}</td><td align="right">${Number(i.price * i.quantity).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td></tr>`
      )
      .join("");
    return `<p>ขอบคุณสำหรับคำสั่งซื้อ เลขที่คำสั่งซื้อของคุณคือ</p>
      <p style="font-size:22px;font-weight:bold;color:#0b4f8a;letter-spacing:1px">${escapeHtml(order.order_code)}</p>
      <table width="100%" style="font-size:14px;border-top:1px solid #e2e8f0;margin-top:8px">${rows}
      <tr><td style="padding:6px 0;color:#64748b">ค่าจัดส่ง</td><td align="right">${Number(order.shippingCost).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;border-top:1px solid #e2e8f0">ยอดชำระทั้งหมด</td><td align="right" style="font-weight:bold;border-top:1px solid #e2e8f0">${Number(order.totalPrice).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td></tr></table>
      ${button(`${siteUrl()}/payment-notice?order=${encodeURIComponent(order.order_code)}`, "แจ้งชำระเงิน")}
      <p>ตรวจสอบสถานะได้ที่ <a href="${siteUrl()}/paidstatus">${siteUrl()}/paidstatus</a></p>`;
  },
};
