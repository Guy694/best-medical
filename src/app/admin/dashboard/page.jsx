import React from 'react'
export default function Dashboard() {
    return (
        <div className='min-h-screen bg-gray-100 p-4'>
            <div className='max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6'>
                <h1 className='text-2xl font-semibold mb-4'>Dashboard</h1>
                <div className='flex-1'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='bg-blue-500 text-white rounded-lg p-4 shadow'>
                            <h2 className='text-lg font-semibold'>Total Sales</h2>
                            <p className='text-2xl mt-2'>฿50,000</p>
                        </div>
                        <div className='bg-green-500 text-white rounded-lg p-4 shadow'>
                            <h2 className='text-lg font-semibold'>Total Orders</h2>
                            <p className='text-2xl mt-2'>150</p>
                        </div>
                        <div className='bg-yellow-500 text-white rounded-lg p-4 shadow'>
                            <h2 className='text-lg font-semibold'>Total Customers</h2>
                            <p className='text-2xl mt-2'>75</p>
                        </div>
                    </div>

                </div> 
                <div className='mt-6'>
                    <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
                    <ul className='space-y-2'>
                        <li className='bg-gray-100 p-4 rounded-lg shadow'>
                            <p className='font-semibold'>Order #1234</p>
                            <p className='text-sm text-gray-600'>Completed on 2023-03-15</p>
                        </li>
                        <li className='bg-gray-100 p-4 rounded-lg shadow'>
                            <p className='font-semibold'>Order #1235</p>
                            <p className='text-sm text-gray-600'>Pending</p>
                        </li>
                        <li className='bg-gray-100 p-4 rounded-lg shadow'>
                            <p className='font-semibold'>Order #1236</p>
                            <p className='text-sm text-gray-600'>Cancelled</p>
                        </li>
                    </ul>
                </div>
                <div className='max-w-7xl'>
                    <h2 className='text-xl font-semibold mb-4'>Sales Overview</h2>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        {/* กราฟหรือข้อมูลสถิติอื่น ๆ สามารถเพิ่มที่นี่ */}
                        <p>กราฟแสดงยอดขายจะอยู่ที่นี่</p>
                    </div>
                </div>
                <div className='max-w-7xl mt-6'>
                    <h2 className='text-xl font-semibold mb-4'>Inventory Status</h2>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        {/* ข้อมูลสถานะสินค้าคงคลังสามารถเพิ่มที่นี่ */}
                        <p>ข้อมูลสถานะสินค้าคงคลังจะอยู่ที่นี่</p>
                    </div>
                </div>
                </div> </div>
    )
}
