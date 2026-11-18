import { transaction } from "@/app/lib/db";
import { route, json, HttpError, str, email as parseEmail, phone as parsePhone, money, rateLimit } from "@/app/lib/api";
import { saveImage } from "@/app/lib/upload";

/**
 * POST /api/payment-notice  (multipart/form-data)
 * Customer reports a bank transfer. The order stays PENDING ("รอตรวจสอบ") until staff
 * confirms it in the back office – customers can no longer mark their own order as PAID.
 */
export const POST = route(async (req) => {
  rateLimit(req, "payment-notice", { limit: 10, windowMs: 10 * 60_000 });
  const fd = await req.formData();

  const order_code = str(fd.get("order_code"), { required: true, max: 60, label: "เลขที่ใบสั่งซื้อ" }).toUpperCase();
  const fullName = str(fd.get("fullName"), { required: true, max: 150, label: "ชื่อ-นามสกุล" });
  const order_email = parseEmail(fd.get("order_email"));
  const order_phone = parsePhone(fd.get("order_phone"), { required: true });
  const totalPrice = money(fd.get("totalPrice"), { label: "จำนวนเงิน" });
  const transfer_date = str(fd.get("transfer_date"), { required: true, max: 10, label: "วันที่โอน" });
  const transfer_time = str(fd.get("transfer_time"), { required: true, max: 8, label: "เวลาที่โอน" });
  const shippingAddress = str(fd.get("shippingAddress"), { required: true, max: 1000, label: "ที่อยู่จัดส่ง" });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(transfer_date)) throw new HttpError(400, "วันที่โอนไม่ถูกต้อง");
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(transfer_time)) throw new HttpError(400, "เวลาที่โอนไม่ถูกต้อง");
  if (new Date(transfer_date) > new Date(Date.now() + 86400000)) throw new HttpError(400, "วันที่โอนต้องไม่เป็นวันในอนาคต");

  const slipFile = fd.get("transfer_slip_file");
  if (!slipFile || typeof slipFile === "string" || !slipFile.size) {
    throw new HttpError(400, "กรุณาแนบหลักฐานการโอนเงิน (สลิป)");
  }

  // validate order before saving the file
  const result = await transaction(async (conn) => {
    const [rows] = await conn.execute("SELECT * FROM `order` WHERE order_code = ? FOR UPDATE", [order_code]);
    if (!rows.length) throw new HttpError(404, "ไม่พบเลขที่ใบสั่งซื้อนี้ในระบบ");
    const order = rows[0];

    if ((order.order_email || "").trim().toLowerCase() !== order_email) {
      throw new HttpError(400, "อีเมลไม่ตรงกับที่ใช้สั่งซื้อ");
    }
    if (order.status === "CANCELLED") throw new HttpError(400, "ใบสั่งซื้อนี้ถูกยกเลิกแล้ว");
    if (order.status !== "PENDING") throw new HttpError(400, "ใบสั่งซื้อนี้ได้รับการยืนยันการชำระเงินแล้ว");
    if (Math.abs(Number(order.totalPrice) - totalPrice) > 0.009) {
      throw new HttpError(
        400,
        `จำนวนเงินไม่ตรงกับยอดที่ต้องชำระ (฿${Number(order.totalPrice).toLocaleString("th-TH", { minimumFractionDigits: 2 })})`,
        { expectedAmount: Number(order.totalPrice) }
      );
    }

    const slipPath = await saveImage(slipFile, "payments");

    await conn.execute(
      `UPDATE \`order\` SET fullName = ?, order_phone = ?, paidAtdate = ?, paidAttime = ?,
         transfer_slip_file = ?, shippingAddress = ?, updatedAt = NOW(3)
       WHERE order_id = ?`,
      [fullName, order_phone, transfer_date, transfer_time, slipPath, shippingAddress, order.order_id]
    );

    // remember contact details on the customer account (if one exists)
    await conn.execute(
      "UPDATE `user` SET phone = COALESCE(phone, ?), address = COALESCE(address, ?) WHERE email = ?",
      [order_phone, shippingAddress.slice(0, 191), order_email]
    );

    await conn.execute(
      `INSERT INTO payment_notifications
        (order_id, order_code, customer_name, customer_email, customer_phone, amount, transfer_date, transfer_time, transfer_slip_file, shipping_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [order.order_id, order_code, fullName, order_email, order_phone, totalPrice, transfer_date, transfer_time, slipPath, shippingAddress]
    );

    await conn.execute(
      `INSERT INTO order_status_history (order_id, order_code, status, previous_status, note, changed_by, created_at)
       VALUES (?, ?, 'PENDING', 'PENDING', ?, 'customer', NOW())`,
      [order.order_id, order_code, `ลูกค้าแจ้งชำระเงิน ฿${totalPrice.toLocaleString("th-TH")} (${transfer_date} ${transfer_time})`]
    ).catch(() => {});

    return { order_code };
  });

  return json({
    success: true,
    message: "แจ้งชำระเงินเรียบร้อยแล้ว ร้านค้าจะตรวจสอบและยืนยันภายใน 24 ชั่วโมง",
    order_code: result.order_code,
  });
});
