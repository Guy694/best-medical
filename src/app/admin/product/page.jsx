import React from 'react'

export default function Productmanagement() {
  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl font-semibold mb-4'>จัดการรายการสินค้า</h1>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='py-2 px-4 text-left'>ชื่อสินค้า</th>
              <th className='py-2 px-4 text-left'>ราคา</th>
              <th className='py-2 px-4 text-left'>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>
  )
}