import { query, transaction } from "@/app/lib/db";
import { route, json, HttpError, int, str } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { changeOrderStatus, ORDER_STATUSES } from "@/app/lib/orders";
import { serializeOrder } from "@/app/lib/orderView";

// GET /api/admin/orders?status=&q=&verify=1
export const GET = route(
  async (req) => {
    const sp = req.nextUrl.searchParams;
    const where = [];
    const params = [];
    const status = sp.get("status");
    if (ORDER_STATUSES.includes(status)) {
      where.push("status = ?");
      params.push(status);
    }
    if (sp.get("verify") === "1") where.push("status = 'PENDING' AND paidAtdate IS NOT NULL");
    const q = (sp.get("q") || "").trim().slice(0, 100);
    if (q) {
      where.push("(order_code LIKE ? OR order_email LIKE ? OR fullName LIKE ? OR order_phone LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    const rows = await query(
      `SELECT * FROM \`order\` ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY createdAt DESC LIMIT 1000`,
      params
    );
    return json(rows.map((o) => serializeOrder(o, { full: true })));
  },
  { roles: STAFF_ROLES }
);

// PUT /api/admin/orders  { order_id, status, note?, tracking_number?, shipping_company? }
export const PUT = route(
  async (req, { user }) => {
    const body = await req.json().catch(() => ({}));
    const orderId = int(body.order_id, { min: 1, label: "รหัสคำสั่งซื้อ" });
    if (!ORDER_STATUSES.includes(body.status)) throw new HttpError(400, "สถานะไม่ถูกต้อง");
    const extra = {
      note: str(body.note, { max: 1000, label: "หมายเหตุ" }),
      tracking_number: str(body.tracking_number, { max: 100, label: "เลขพัสดุ" }),
      shipping_company: str(body.shipping_company, { max: 100, label: "บริษัทขนส่ง" }),
    };
    if (body.status === "CANCELLED" && !extra.note) throw new HttpError(400, "กรุณาระบุเหตุผลในการยกเลิก");
    const updated = await transaction((conn) => changeOrderStatus(conn, orderId, body.status, user, extra));
    return json({ success: true, message: "อัปเดตสถานะเรียบร้อย", order: serializeOrder(updated, { full: true }) });
  },
  { roles: STAFF_ROLES }
);
