// Shared order serializers (server only).
import { parseItems, statusInfo } from "./orders";
import { isStaff } from "./auth";

export function canSeePrivate(order, user, providedEmail) {
  if (isStaff(user)) return true;
  if (user && (order.user_id === user.id || order.order_email?.toLowerCase() === user.email?.toLowerCase())) return true;
  if (providedEmail && order.order_email?.toLowerCase() === String(providedEmail).trim().toLowerCase()) return true;
  return false;
}

/** Public-safe view of an order; private fields only when `full` is true. */
export function serializeOrder(order, { full = false, history = [] } = {}) {
  const items = parseItems(order.items).map((i) => ({
    product_id: Number(i.product_id ?? i.id),
    name: i.name,
    price: Number(i.price),
    quantity: Number(i.quantity),
    image: i.image || null,
    delivery: Number(i.delivery) || 0,
  }));
  const base = {
    order_id: order.order_id,
    order_code: order.order_code,
    status: order.status,
    statusInfo: statusInfo(order),
    totalPrice: Number(order.totalPrice),
    shipping: order.shipping,
    shipping_cost: Number(order.shipping_cost ?? 0),
    items,
    createdAt: order.createdAt,
    payment_reported: !!order.paidAtdate,
    tracking_number: order.tracking_number || null,
    shipping_company: order.shipping_company || null,
  };
  if (!full) return base;
  return {
    ...base,
    order_email: order.order_email,
    fullName: order.fullName,
    order_phone: order.order_phone,
    shippingAddress: order.shippingAddress,
    paidAtdate: order.paidAtdate,
    paidAttime: order.paidAttime,
    transfer_slip_file: order.transfer_slip_file || null,
    history: history.map((h) => ({
      id: h.id,
      status: h.status,
      previous_status: h.previous_status,
      note: h.note,
      tracking_number: h.tracking_number,
      shipping_company: h.shipping_company,
      created_at: h.created_at,
    })),
  };
}
