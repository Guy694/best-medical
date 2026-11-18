// Order domain helpers shared by API routes (server only).
import crypto from "crypto";
import { HttpError } from "./api";

export const ORDER_STATUSES = ["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"];

export const STATUS_INFO = {
  PENDING: { text: "รอชำระเงิน", description: "รอการชำระเงินจากลูกค้า", step: 1 },
  PAID: { text: "ชำระเงินแล้ว", description: "ยืนยันการชำระเงินแล้ว กำลังเตรียมสินค้า", step: 2 },
  SHIPPING: { text: "กำลังจัดส่ง", description: "สินค้าออกจากคลังแล้ว กำลังขนส่ง", step: 3 },
  COMPLETED: { text: "สำเร็จ", description: "จัดส่งสินค้าเรียบร้อยแล้ว", step: 4 },
  CANCELLED: { text: "ยกเลิก", description: "คำสั่งซื้อถูกยกเลิก", step: 0 },
};

// Allowed manual transitions for staff.
export const TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPING", "COMPLETED", "CANCELLED", "PENDING"],
  SHIPPING: ["COMPLETED", "CANCELLED", "PAID"],
  COMPLETED: ["SHIPPING"],
  CANCELLED: ["PENDING"],
};

export function statusInfo(order) {
  const base = STATUS_INFO[order.status] || { text: order.status, description: "", step: 0 };
  if (order.status === "PENDING" && order.paidAtdate) {
    return { ...base, text: "แจ้งชำระแล้ว รอตรวจสอบ", description: "ได้รับหลักฐานการโอนแล้ว ร้านค้ากำลังตรวจสอบ", verifying: true };
  }
  return base;
}

export function newOrderCode() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `ORD${ymd}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export function parseItems(raw) {
  if (Array.isArray(raw)) return raw;
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Product id stored in an order item (old orders used `id`, newer `product_id`). */
export const itemProductId = (item) => Number(item.product_id ?? item.id);

const STOCK_STATUSES = ["PAID", "SHIPPING", "COMPLETED"];

/**
 * Change an order's status inside a transaction, keeping stock in sync:
 *  - moving into PAID/SHIPPING/COMPLETED deducts stock once (stock_deducted flag)
 *  - moving back to PENDING/CANCELLED restores the deducted stock
 */
export async function changeOrderStatus(conn, orderId, nextStatus, user, extra = {}) {
  const [rows] = await conn.execute("SELECT * FROM `order` WHERE order_id = ? FOR UPDATE", [orderId]);
  if (!rows.length) throw new HttpError(404, "ไม่พบคำสั่งซื้อ");
  const order = rows[0];
  if (!ORDER_STATUSES.includes(nextStatus)) throw new HttpError(400, "สถานะไม่ถูกต้อง");

  const changing = order.status !== nextStatus;
  if (changing && !(TRANSITIONS[order.status] || []).includes(nextStatus)) {
    throw new HttpError(
      400,
      `ไม่สามารถเปลี่ยนสถานะจาก "${STATUS_INFO[order.status]?.text}" เป็น "${STATUS_INFO[nextStatus]?.text}" ได้`
    );
  }

  const items = parseItems(order.items);
  let stockDeducted = !!order.stock_deducted;

  if (STOCK_STATUSES.includes(nextStatus) && !stockDeducted) {
    for (const item of items) {
      const pid = itemProductId(item);
      const qty = Number(item.quantity) || 0;
      if (!pid || qty <= 0) continue;
      const [res] = await conn.execute(
        "UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [qty, pid, qty]
      );
      if (res.affectedRows === 0) {
        const [p] = await conn.execute("SELECT pro_name, stock FROM product WHERE id = ?", [pid]);
        if (p.length) {
          throw new HttpError(409, `สินค้า "${p[0].pro_name}" มีสต็อกไม่พอ (เหลือ ${p[0].stock} ชิ้น ต้องการ ${qty} ชิ้น)`);
        }
      }
    }
    stockDeducted = true;
  } else if (!STOCK_STATUSES.includes(nextStatus) && stockDeducted) {
    for (const item of items) {
      const pid = itemProductId(item);
      const qty = Number(item.quantity) || 0;
      if (pid && qty > 0) {
        await conn.execute("UPDATE product SET stock = stock + ? WHERE id = ?", [qty, pid]);
      }
    }
    stockDeducted = false;
  }

  await conn.execute(
    `UPDATE \`order\` SET status = ?, stock_deducted = ?,
       tracking_number = COALESCE(?, tracking_number),
       shipping_company = COALESCE(?, shipping_company),
       updatedAt = NOW(3)
     WHERE order_id = ?`,
    [nextStatus, stockDeducted ? 1 : 0, extra.tracking_number || null, extra.shipping_company || null, orderId]
  );

  if (changing || extra.note || extra.tracking_number) {
    await addHistory(conn, { order, status: nextStatus, user, ...extra });
  }
  return { ...order, status: nextStatus, stock_deducted: stockDeducted ? 1 : 0 };
}

/** Insert a status history row (best effort – table may be missing on old installs). */
export async function addHistory(conn, { order, status, note, user, tracking_number, shipping_company }) {
  try {
    await conn.execute(
      `INSERT INTO order_status_history
        (order_id, order_code, status, previous_status, note, changed_by, changed_by_user_id, tracking_number, shipping_company, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        order.order_id,
        order.order_code,
        status,
        order.status || null,
        note || null,
        user ? user.name || user.email : "system",
        user ? user.id : null,
        tracking_number || null,
        shipping_company || null,
      ]
    );
  } catch (err) {
    console.warn("[order history] skipped:", err.message);
  }
}
