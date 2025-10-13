import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get('order_code');

    if (!orderCode) {
      return NextResponse.json(
        { error: 'กรุณาระบุเลขที่ใบสั่งซื้อ' },
        { status: 400 }
      );
    }

    // Query order details with customer information
    const orderQuery = `
      SELECT 
        o.id as order_id,
        o.orderCode as order_code,
        o.totalPrice as total_amount,
        o.status,
        o.createdAt as created_at,
        o.shippingAddress as shipping_address,
        o.paymentMethod as payment_method,
        o.trackingNumber as tracking_number,
        u.firstname,
        u.lastname,
        u.email,
        u.phone
      FROM \`order\` o
      LEFT JOIN users u ON o.userId = u.id
      WHERE o.orderCode = ?
    `;

    const orders = await query(orderQuery, [orderCode]);

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบใบสั่งซื้อนี้ในระบบ' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Query order items
    const itemsQuery = `
      SELECT 
        oi.quantity,
        oi.price,
        p.name as product_name,
        p.image as product_image
      FROM orderitem oi
      LEFT JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `;

    const items = await query(itemsQuery, [order.order_id]);

    // Calculate status information
    const statusInfo = getStatusInfo(order.status);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items,
        statusInfo
      }
    });

  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ' },
      { status: 500 }
    );
  }
}

function getStatusInfo(status) {
  const statusMap = {
    'PENDING': {
      text: 'รอดำเนินการ',
      description: 'รอการตรวจสอบและยืนยันคำสั่งซื้อ',
      color: 'bg-yellow-500',
      step: 1
    },
    'PAID': {
      text: 'ชำระเงินแล้ว',
      description: 'ได้รับการชำระเงินแล้ว กำลังเตรียมสินค้า',
      color: 'bg-blue-500',
      step: 2
    },
    'SHIPPING': {
      text: 'กำลังจัดส่ง',
      description: 'สินค้าออกจากคลังแล้ว กำลังขนส่ง',
      color: 'bg-purple-500',
      step: 3
    },
    'COMPLETED': {
      text: 'สำเร็จ',
      description: 'จัดส่งสินค้าเรียบร้อยแล้ว',
      color: 'bg-green-500',
      step: 4
    },
    'CANCELLED': {
      text: 'ยกเลิก',
      description: 'คำสั่งซื้อถูกยกเลิก',
      color: 'bg-red-500',
      step: 0
    }
  };

  return statusMap[status] || {
    text: 'ไม่ทราบสถานะ',
    description: 'สถานะไม่ถูกต้อง',
    color: 'bg-gray-500',
    step: 0
  };
}