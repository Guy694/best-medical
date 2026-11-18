import { query, transaction } from "@/app/lib/db";
import { route, json, HttpError, int, str } from "@/app/lib/api";
import { STAFF_ROLES } from "@/app/lib/auth";
import { changeOrderStatus } from "@/app/lib/orders";

// GET /api/admin/payment-notice – payment notifications with current order status
export const GET = route(
  async () => {
    const rows = await query(
      `SELECT pn.*, o.status, o.totalPrice AS order_total, o.paidAtdate
       FROM payment_notifications pn
       LEFT JOIN \`order\` o ON o.order_id = pn.order_id
       ORDER BY pn.created_at DESC LIMIT 500`
    );
    return json(rows);
  },
  { roles: STAFF_ROLES }
);

// PUT /api/admin/payment-notice { orderId, action: "approve" | "reject", note? }
export const PUT = route(
  async (req, { user }) => {
    const body = await req.json().catch(() => ({}));
    const orderId = int(body.orderId ?? body.order_id, { min: 1, label: "รหัสคำสั่งซื้อ" });
    const note = str(body.note, { max: 1000, label: "หมายเหตุ" });

    if (body.action === "approve" || body.status === "PAID") {
      await transaction((conn) =>
        changeOrderStatus(conn, orderId, "PAID", user, { note: note || "ยืนยันการชำระเงิน" })
      );
      return json({ success: true, message: "ยืนยันการชำระเงินเรียบร้อย" });
    }
    if (body.action === "reject") {
      if (!note) throw new HttpError(400, "กรุณาระบุเหตุผลที่ปฏิเสธ");
      await transaction(async (conn) => {
        const [rows] = await conn.execute("SELECT * FROM `order` WHERE order_id = ? FOR UPDATE", [orderId]);
        if (!rows.length) throw new HttpError(404, "ไม่พบคำสั่งซื้อ");
        if (rows[0].status !== "PENDING") throw new HttpError(400, "คำสั่งซื้อนี้ไม่ได้อยู่ในสถานะรอตรวจสอบ");
        await conn.execute(
          "UPDATE `order` SET paidAtdate = NULL, paidAttime = NULL, updatedAt = NOW(3) WHERE order_id = ?",
          [orderId]
        );
        await conn.execute(
          `INSERT INTO order_status_history (order_id, order_code, status, previous_status, note, changed_by, changed_by_user_id, created_at)
           VALUES (?, ?, 'PENDING', 'PENDING', ?, ?, ?, NOW())`,
          [orderId, rows[0].order_code, `ปฏิเสธหลักฐานการชำระเงิน: ${note}`, user.name || user.email, user.id]
        ).catch(() => {});
      });
      return json({ success: true, message: "ปฏิเสธการแจ้งชำระเงินแล้ว" });
    }
    throw new HttpError(400, "คำสั่งไม่ถูกต้อง");
  },
  { roles: STAFF_ROLES }
);
