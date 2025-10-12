import mysql from 'mysql2/promise';
import { dbConfig } from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || new Date().getFullYear();
    
    const connection = await mysql.createConnection(dbConfig);
    
    // ยอดขายทั้งหมดในปีที่เลือก
    const [totalOrdersResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM `order` WHERE status = "COMPLETED" AND YEAR(createdAt) = ?',
      [year]
    );
    
    // ยอดขายทั้งหมดเป็นเงิน
    const [totalRevenueResult] = await connection.execute(
      'SELECT COALESCE(SUM(totalPrice), 0) as total FROM `order` WHERE status = "COMPLETED" AND YEAR(createdAt) = ?',
      [year]
    );
    
    // รายการรอจัดส่ง
    const [pendingOrdersResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM `order` WHERE status = "PENDING" AND YEAR(createdAt) = ?',
      [year]
    );
    
    // ข้อมูลรายเดือน
    const [monthlyDataResult] = await connection.execute(`
      SELECT 
        MONTH(createdAt) as month,
        COUNT(*) as orders,
        COALESCE(SUM(totalPrice), 0) as revenue
      FROM \`order\` 
      WHERE YEAR(createdAt) = ?
      GROUP BY MONTH(createdAt)
      ORDER BY month
    `, [year]);
    
    // รายการออร์เดอร์ล่าสุด 5 รายการ
    const [recentOrdersResult] = await connection.execute(`
      SELECT 
        order_id,
        order_code,
        order_email,
        totalPrice,
        status,
        createdAt
      FROM \`order\` 
      WHERE YEAR(createdAt) = ?
      ORDER BY createdAt DESC 
      LIMIT 5
    `, [year]);
    
    await connection.end();
    
    // สร้างข้อมูลรายเดือน (12 เดือน)
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const monthData = monthlyDataResult.find(item => item.month === index + 1);
      return {
        month: index + 1,
        orders: monthData ? monthData.orders : 0,
        revenue: monthData ? parseFloat(monthData.revenue) : 0
      };
    });
    
    const dashboardData = {
      totalOrders: totalOrdersResult[0].total,
      totalRevenue: parseFloat(totalRevenueResult[0].total),
      pendingOrders: pendingOrdersResult[0].total,
      monthlyData: monthlyData,
      recentOrders: recentOrdersResult.map(order => ({
        ...order,
        totalPrice: parseFloat(order.totalPrice),
        createdAt: new Date(order.createdAt).toLocaleDateString('th-TH')
      }))
    };
    
    return new Response(JSON.stringify(dashboardData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      monthlyData: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        orders: 0,
        revenue: 0
      })),
      recentOrders: []
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}