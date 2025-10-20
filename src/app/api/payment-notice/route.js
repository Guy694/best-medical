import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // Check if request is FormData (file upload) or JSON
    const contentType = request.headers.get('content-type');
    let formData;
    let transferSlipFile = null;
    let transferSlipPath = null;

    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formDataRequest = await request.formData();
      
      formData = {
        order_code: formDataRequest.get('order_code'),
        fullName: formDataRequest.get('fullName'),
        order_email: formDataRequest.get('order_email'),
        order_phone: formDataRequest.get('order_phone'), // เพิ่ม order_phone
        totalPrice: formDataRequest.get('totalPrice'),
        transfer_date: formDataRequest.get('transfer_date'),
        transfer_time: formDataRequest.get('transfer_time'),
        shippingAddress: formDataRequest.get('shippingAddress')
      };

      // Handle file upload
      transferSlipFile = formDataRequest.get('transfer_slip_file');
      
      if (transferSlipFile && transferSlipFile.size > 0) {
        // Create unique filename
        const timestamp = Date.now();
        const originalName = transferSlipFile.name;
        const extension = path.extname(originalName);
        const fileName = `payment_slip_${timestamp}${extension}`;
        
        // Save file to public/payments directory
        const bytes = await transferSlipFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        transferSlipPath = path.join(process.cwd(), 'public/payments', fileName);
        await writeFile(transferSlipPath, buffer);
        
        // Store relative path for database
        transferSlipPath = `/payments/${fileName}`;
      }
    } else {
      // Handle JSON request (backward compatibility)
      formData = await request.json();
    }

    const {
      order_code,
      fullName,
      order_email,
      order_phone,
      totalPrice,
      transfer_date,
      transfer_time,
      shippingAddress
    } = formData;

    // Debug: Log received data
    console.log('Received payment notice data:', {
      order_code,
      fullName,
      order_email,
      order_phone,
      totalPrice,
      transfer_date,
      transfer_time,
      shippingAddress,
      hasFile: !!transferSlipFile
    });

    // Validate required fields
    if (!order_code || !fullName || !order_email || !order_phone || !totalPrice || !transfer_date || !transfer_time || !shippingAddress) {
      const missingFields = [];
      if (!order_code) missingFields.push('เลขที่ใบสั่งซื้อ');
      if (!fullName) missingFields.push('ชื่อ-นามสกุล');
      if (!order_email) missingFields.push('อีเมล');
      if (!order_phone) missingFields.push('เบอร์โทรศัพท์');
      if (!totalPrice) missingFields.push('จำนวนเงิน');
      if (!transfer_date) missingFields.push('วันที่โอน');
      if (!transfer_time) missingFields.push('เวลาที่โอน');
      if (!shippingAddress) missingFields.push('ที่อยู่จัดส่ง');
      
      console.log('Missing fields:', missingFields);
      
      return NextResponse.json(
        { 
          error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          missingFields: missingFields
        },
        { status: 400 }
      );
    }

    // Check if order exists and get order details
    const orderQuery = `
      SELECT 
        o.order_id,
        o.order_code,
        o.totalPrice as order_total,
        o.status,
        u.name As firstname,
        u.email
    FROM \`order\` o
          LEFT JOIN user u ON o.order_email = u.email
      WHERE o.order_code = ?
    `;

    const orders = await query(orderQuery, [order_code]);

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบเลขที่ใบสั่งซื้อนี้ในระบบ' },
        { status: 404 }
      );
    }

    const order = orders[0];


    // Check if email matches
    if (order.email !== order_email) {
      return NextResponse.json(
        { error: 'อีเมลไม่ตรงกับในระบบ' },
        { status: 400 }
      );
    }

    // Check if total price matches
    if (parseFloat(order.order_total) !== parseFloat(totalPrice)) {
      return NextResponse.json(
        { 
          error: `จำนวนเงินไม่ถูกต้อง ยอดที่ต้องชำระคือ ฿${Number(order.order_total).toLocaleString()}`,
          expectedAmount: order.order_total
        },
        { status: 400 }
      );
    }

    // Check if order is already paid
    if (order.status === 'PAID' || order.status === 'SHIPPING' || order.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'ใบสั่งซื้อนี้ได้รับการชำระเงินแล้ว' },
        { status: 400 }
      );
    }

    // Check if order is cancelled
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'ใบสั่งซื้อนี้ถูกยกเลิกแล้ว' },
        { status: 400 }
      );
    }

    // Update order status and payment information
    const updateQuery = `
      UPDATE \`order\` 
      SET 
        status = 'PAID',
        fullName = ?,
        order_phone = ?,
        paidAtdate = ?,
        paidAttime = ?,
        transfer_slip_file = ?,
        shippingAddress = ?
      WHERE order_code = ?
    `;

    await query(updateQuery, [
      fullName,
      order_phone,
      transfer_date,
      transfer_time,
      transferSlipPath || null, // Save file path
      shippingAddress,
      order_code
    ]);

       const updateuser = `
      UPDATE \`user\` 
      SET 
        phone = ?,
        address = ?
      WHERE email = ?
    `;

    await query(updateuser, [
      order_phone,
      shippingAddress,
      order_email
    ]);

    // Log payment notification
    const logQuery = `
      INSERT INTO payment_notifications 
      (order_id, order_code, customer_name, customer_email, customer_phone, amount, transfer_date, transfer_time, transfer_slip_file, shipping_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    try {
      await query(logQuery, [
        order.order_id,
        order_code,
        fullName,
        order_email,
        order_phone,
        totalPrice,
        transfer_date,
        transfer_time,
        transferSlipPath || null, // Save file path in log too
        shippingAddress
      ]);
    } catch (logError) {
      // ถ้า table payment_notifications ไม่มี ก็ไม่ต้อง error
      console.log('Payment log table not found, skipping log:', logError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'แจ้งชำระเงินเรียบร้อยแล้ว ระบบจะตรวจสอบและอัพเดตสถานะภายใน 24 ชั่วโมง',
      order_code: order_code,
      amount: totalPrice
    });

  } catch (error) {
    console.error('Error processing payment notification:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแจ้งชำระเงิน' },
      { status: 500 }
    );
  }
}