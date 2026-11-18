import { transaction } from "@/app/lib/db";
import { route, json, HttpError, email as parseEmail, rateLimit } from "@/app/lib/api";
import { newOrderCode } from "@/app/lib/orders";
import { sendMail, templates } from "@/app/lib/mailer";
import { recordServerEvent } from "@/app/lib/analytics";

const SHIPPING_METHODS = ["ems", "store"];

/**
 * POST /api/cart/sendOrder
 * Body (JSON): { items: [{ id, quantity }], shipping: "ems" | "store", email }
 * Prices, names and shipping cost are ALWAYS taken from the database – never from the client.
 */
export const POST = route(async (req, { user }) => {
  rateLimit(req, "order", { limit: 10, windowMs: 10 * 60_000 });

  let body;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    body = await req.json().catch(() => ({}));
  } else {
    // backward compatibility with the old multipart form
    const fd = await req.formData();
    body = {
      items: JSON.parse(fd.get("cart") || "[]"),
      shipping: fd.get("shipping"),
      email: fd.get("order_email"),
    };
  }

  const orderEmail = parseEmail(body.email || user?.email);
  const shipping = SHIPPING_METHODS.includes(body.shipping) ? body.shipping : "ems";

  // merge duplicate lines & validate quantities
  const wanted = new Map();
  for (const line of Array.isArray(body.items) ? body.items : []) {
    const id = Number(line.id ?? line.product_id);
    const qty = Number(line.quantity);
    if (!Number.isInteger(id) || id <= 0) continue;
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) throw new HttpError(400, "จำนวนสินค้าไม่ถูกต้อง");
    wanted.set(id, (wanted.get(id) || 0) + qty);
  }
  if (!wanted.size) throw new HttpError(400, "ตะกร้าสินค้าว่างเปล่า");
  if (wanted.size > 100) throw new HttpError(400, "จำนวนรายการสินค้ามากเกินไป");

  const result = await transaction(async (conn) => {
    const ids = [...wanted.keys()];
    const [products] = await conn.query(
      "SELECT id, pro_name, price, stock, imageUrl, delivery, visible FROM product WHERE id IN (?)",
      [ids]
    );
    const byId = new Map(products.map((p) => [p.id, p]));

    const items = [];
    let subtotal = 0;
    let shippingCost = 0;
    for (const [id, quantity] of wanted) {
      const p = byId.get(id);
      if (!p || Number(p.visible) !== 0) throw new HttpError(400, "มีสินค้าบางรายการไม่พร้อมจำหน่ายแล้ว กรุณาตรวจสอบตะกร้า", { productId: id });
      const price = Number(p.price);
      if (!(price > 0)) throw new HttpError(400, `สินค้า "${p.pro_name}" ต้องติดต่อสอบถามราคา ไม่สามารถสั่งซื้อออนไลน์ได้`, { productId: id });
      if (p.stock < quantity) throw new HttpError(409, `สินค้า "${p.pro_name}" มีไม่พอ (คงเหลือ ${p.stock} ชิ้น)`, { productId: id, stock: p.stock });
      const delivery = Number(p.delivery) || 0;
      items.push({ product_id: p.id, id: p.id, name: p.pro_name, price: price.toFixed(2), image: p.imageUrl, quantity, delivery: delivery.toFixed(2) });
      subtotal += price * quantity;
      shippingCost += delivery * quantity;
    }
    if (shipping === "store") shippingCost = 0;
    const totalPrice = Math.round((subtotal + shippingCost) * 100) / 100;

    let order_code;
    let orderId;
    for (let attempt = 0; attempt < 5; attempt++) {
      order_code = newOrderCode();
      try {
        const [ins] = await conn.execute(
          `INSERT INTO \`order\` (order_code, order_email, user_id, shipping, shipping_cost, items, totalPrice, status, transfer_slip_file, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', NULL, NOW(3))`,
          [order_code, orderEmail, user?.id || null, shipping, shippingCost.toFixed(2), JSON.stringify(items), totalPrice.toFixed(2)]
        );
        orderId = ins.insertId;
        break;
      } catch (err) {
        if (err.code !== "ER_DUP_ENTRY" || attempt === 4) throw err;
      }
    }

    for (const it of items) {
      await conn.execute("INSERT INTO orderitem (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)", [
        orderId, it.product_id, it.quantity, it.price,
      ]);
    }
    await conn.execute(
      `INSERT INTO order_status_history (order_id, order_code, status, previous_status, note, changed_by, created_at)
       VALUES (?, ?, 'PENDING', NULL, 'สร้างคำสั่งซื้อ', 'system', NOW())`,
      [orderId, order_code]
    ).catch(() => {});

    return { order_code, orderId, items, totalPrice, shippingCost };
  });

  await recordServerEvent(req, "purchase", { value: result.totalPrice, ref_code: result.order_code });

  // fire-and-forget email
  sendMail({
    to: orderEmail,
    subject: `คำสั่งซื้อ ${result.order_code} - บริษัท เบสท เมดิคอล จำกัด`,
    title: "ขอบคุณสำหรับคำสั่งซื้อ",
    html: templates.order({ order_code: result.order_code, totalPrice: result.totalPrice, shippingCost: result.shippingCost }, result.items),
  });

  return json({ success: true, orderId: result.order_code, totalPrice: result.totalPrice });
});
