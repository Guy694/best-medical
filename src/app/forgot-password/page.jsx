import { div } from 'framer-motion/client'
import React from 'react'
import Navbar from '../components/Nav'
export default function ForgotPassword() {
  return (
    <div>
        <Navbar />
        <br />
    <div className='min-h-screen flex items-start justify-center'>
        <div className='max-w-7xl rounded-2xl shadow-2xl p-8 border border-white/20 bg-white/70 backdrop-blur-md'>
            <h2 className='text-2xl font-bold mb-6 text-center'>ลืมรหัสผ่าน</h2>
            <form>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='email'>อีเมล</label>
                    <input className='w-full px-3 py-2 border rounded' type='email' id='email' placeholder='กรอกอีเมลของคุณ' />
                </div>
                <button className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition'>ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
            </form>
    </div>
    </div></div>
  )
}