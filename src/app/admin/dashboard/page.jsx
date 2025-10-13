"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { TrendingUp, ShoppingCart, Package, DollarSign, Calendar, Filter } from 'lucide-react';
import { sessionManager } from '@/app/lib/sessionTimeout';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    monthlyData: [],
    recentOrders: []
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const userData = sessionManager.getSession();
    
    if (!userData || sessionManager.isSessionExpired()) {
      router.push('/login');
      return;
    }

    if (userData.role !== 'ADMIN') {
      // Redirect based on actual role
      if (userData.role === 'STAFF') {
        router.push('/staff/dashboard');
      } else {
        router.push('/user/homepage');
      }
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!loading && user) {
      fetchDashboardData();
    }
  }, [selectedYear, loading, user]);

  // สร้างปีให้เลือกย้อนหลัง 5 ปี
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?year=${selectedYear}`);
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect will happen automatically
  if (!user) {
    return null;
  }

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            {/* Hamburger for mobile */}
            <button className="md:hidden mb-4 px-3 py-2 bg-gray-200 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">แดชบอร์ด</h1>
              
              {/* Year Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  {years.map(year => (
                    <option key={year} value={year}>ปี {year}</option>
                  ))}
                </select>
              </div>
            </div>

            {dataLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Total Orders */}
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-gray-600">ยอดขายทั้งหมด</p>
                        <p className="text-xl md:text-3xl font-bold text-gray-900 truncate">{dashboardData.totalOrders.toLocaleString()}</p>
                        <p className="text-xs md:text-sm text-gray-500">รายการ</p>
                      </div>
                      <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                        <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-gray-600">ยอดขายทั้งหมด</p>
                        <p className="text-xl md:text-3xl font-bold text-green-600 truncate">฿{dashboardData.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs md:text-sm text-gray-500">บาท</p>
                      </div>
                      <div className="bg-green-100 p-2 md:p-3 rounded-full flex-shrink-0">
                        <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Pending Orders */}
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-gray-600">รอจัดส่ง</p>
                        <p className="text-xl md:text-3xl font-bold text-orange-600 truncate">{dashboardData.pendingOrders.toLocaleString()}</p>
                        <p className="text-xs md:text-sm text-gray-500">รายการ</p>
                      </div>
                      <div className="bg-orange-100 p-2 md:p-3 rounded-full flex-shrink-0">
                        <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Sales Chart */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">ยอดขายรายเดือน ปี {selectedYear}</h2>
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="h-60 md:h-80 relative overflow-hidden">
                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between h-48 md:h-64 border-b border-gray-200 overflow-x-auto">
                      {dashboardData.monthlyData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 min-w-0 mx-0.5 md:mx-1">
                          <div 
                            className="bg-blue-500 rounded-t-lg w-full transition-all duration-300 hover:bg-blue-600 relative group min-h-[10px]"
                            style={{ 
                              height: `${Math.max((data.revenue / Math.max(...dashboardData.monthlyData.map(d => d.revenue))) * 180, 10)}px` 
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              ฿{data.revenue.toLocaleString()}
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                            {months[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-48 md:h-64 flex flex-col justify-between text-xs text-gray-500 -ml-8 md:-ml-12">
                      <span className="text-xs">฿{Math.max(...dashboardData.monthlyData.map(d => d.revenue)).toLocaleString()}</span>
                      <span className="text-xs">฿{Math.round(Math.max(...dashboardData.monthlyData.map(d => d.revenue)) / 2).toLocaleString()}</span>
                      <span className="text-xs">฿0</span>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">รายการสั่งซื้อล่าสุด</h2>
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="min-w-full inline-block align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              รหัสคำสั่งซื้อ
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              อีเมลลูกค้า
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ยอดรวม
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              สถานะ
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              วันที่สั่งซื้อ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dataLoading ? (
                            <tr>
                              <td colSpan="5" className="px-3 md:px-6 py-4 text-center text-gray-500">
                                กำลังโหลดข้อมูล...
                              </td>
                            </tr>
                          ) : dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                            dashboardData.recentOrders.map((order) => (
                              <tr key={order.order_id}>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                                  {order.order_code}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 max-w-[150px] truncate">
                                  {order.order_email}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                  ฿{order.totalPrice.toLocaleString()}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.status === 'PENDING' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : order.status === 'COMPLETED'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                                  {order.createdAt}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-3 md:px-6 py-4 text-center text-gray-500">
                                ไม่มีรายการสั่งซื้อ
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}