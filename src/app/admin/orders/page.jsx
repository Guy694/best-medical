import React from 'react'


export default function OrdersManagement() {
  const orders = [
    {
      id: 'ORD123456',
        items: 'Product A, Product B',
        total: 1500,
        status: 'Shipped',
        orderDate: '2023-10-01',
    },
    {
      id: 'ORD123457',
        items: 'Product C',
        total: 500,
        status: 'Processing',
        orderDate: '2023-10-02',
    },
    // เพิ่มคำสั่งซื้อเพิ่มเติมตามต้องการ
  ];
    return (
    <div>
      <div className='min-h-screen bg-gray-100 p-4'>
        <div className='bg-white max-w-7xl rounded-lg shadow p-4'>
          <h2 className='text-xl font-bold mb-4'>Order List</h2>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='py-2 px-4 border-b'>รหัสคำสั่งซื้อ</th>
                <th className='py-2 px-4 border-b'>รายการ</th>
                <th className='py-2 px-4 border-b'>ราคา</th>
                <th className='py-2 px-4 border-b'>สถานะ</th>
                <th className='py-2 px-4 border-b'>วันที่สั่งซื้อ</th>
                <th className='py-2 px-4 border-b'>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='py-2 px-4 border-b'>{order.id}</td>
                  <td className='py-2 px-4 border-b'>{order.items}</td>
                  <td className='py-2 px-4 border-b'>{order.total}</td>
                  <td className='py-2 px-4 border-b'>{order.status}</td>
                  <td className='py-2 px-4 border-b'>{order.orderDate}</td>
                  <td className='py-2 px-4 border-b'>
                    <button className='text-blue-500 hover:underline'>Edit</button>
                    <button className='text-red-500 hover:underline'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
