// src/app/payment-notice/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
import { CreditCard, Upload, CheckCircle, AlertCircle, Calendar, Clock, Building2 } from 'lucide-react';

export default function PaymentNotice() {
  const [formData, setFormData] = useState({
    order_code: '',
    fullName: '',
    order_email: '',
    totalPrice: '',
    transfer_date: '',
    transfer_time: '',
    bank_account: '',
    transfer_slip: ''
  });
  const [transferSlipFile, setTransferSlipFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedBank, setSelectedBank] = useState("krungthai");

  const banks = [
    {
      id: "krungthai",
      name: "ธนาคารกรุงไทย สาขาเซ็นทรัลพลาซา เวสต์เกต",
      accountNumber: "660-4-49380-6",
      accountName: "บริษัท เบสท เมดิคอล จำกัด",
      logo: "/bank.png",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name === 'transfer_slip_file') {
        setTransferSlipFile(files[0] || null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add bank account
      formDataToSend.append('bank_account', selectedBank);
      
      // Add file if selected
      if (transferSlipFile) {
        formDataToSend.append('transfer_slip_file', transferSlipFile);
      }

      const response = await fetch('/api/payment-notice', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          order_code: '',
          fullName: '',
          order_email: '',
          totalPrice: '',
          transfer_date: '',
          transfer_time: '',
          bank_account: '',
          transfer_slip: ''
        });
        setTransferSlipFile(null); // Reset file input
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการแจ้งชำระเงิน');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  // Success message component
  if (success) {
    return (
      <div>
        <Navbar />
        <div className='min-h-screen bg-gray-50'>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-900 p-8 text-center">
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">แจ้งชำระเงินสำเร็จ!</h1>
                <p className="text-green-100">ระบบได้รับข้อมูลการชำระเงินของคุณแล้ว</p>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-6">
                  เราจะตรวจสอบการชำระเงินและอัพเดตสถานะคำสั่งซื้อของคุณภายใน 24 ชั่วโมง
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 mr-4"
                  >
                    แจ้งชำระใหม่
                  </button>
                  <button
                    onClick={() => window.location.href = '/paidstatus'}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    ตรวจสอบสถานะ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
            แจ้งชำระเงิน
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-6">
                <h2 className="text-2xl font-semibold text-white text-center flex items-center justify-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  ข้อมูลการชำระเงิน
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      เลขที่ใบสั่งซื้อ <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="text"
                      name="order_code"
                      value={formData.order_code}
                      onChange={handleChange}
                      required
                      className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ORD-2024-001"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      ชื่อ-นามสกุล <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ชื่อ นามสกุล"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    อีเมล <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="email"
                    name="order_email"
                    value={formData.order_email}
                    onChange={handleChange}
                    required
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    จำนวนเงินที่โอน <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    กรุณากรอกจำนวนเงินให้ตรงกับยอดในใบสั่งซื้อ
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      วันที่โอน <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="date"
                      name="transfer_date"
                      value={formData.transfer_date}
                      onChange={handleChange}
                      required
                      className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      เวลาที่โอน <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type="time"
                      name="transfer_time"
                      value={formData.transfer_time}
                      onChange={handleChange}
                      required
                      className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    หลักฐานการโอน
                  </label>
                  
                  {/* File upload section */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      แนบไฟล์หลักฐานการโอน (รูปภาพ)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        name="transfer_slip_file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="transfer_slip_file"
                      />
                      <label
                        htmlFor="transfer_slip_file"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {transferSlipFile ? transferSlipFile.name : 'คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          รองรับไฟล์ JPG, PNG, GIF (ขนาดไม่เกิน 5MB)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Reference number input */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      เลขที่อ้างอิง (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      name="transfer_slip"
                      value={formData.transfer_slip}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="เลขที่อ้างอิงหรือรหัสการโอน (ถ้ามี)"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      ยืนยันการแจ้งชำระเงิน
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bank Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-900 p-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Building2 className="w-6 h-6 mr-2" />
                    ข้อมูลบัญชีสำหรับโอน
                  </h3>
                </div>
                
                <div className="p-6">
                  {banks.map((bank) => (
                    <div key={bank.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{bank.name}</h4>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">เลขที่บัญชี:</span>
                          <span className="font-mono font-semibold text-blue-600">{bank.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ชื่อบัญชี:</span>
                          <span className="font-semibold text-gray-800">{bank.accountName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-900 p-6">
                  <h3 className="text-xl font-semibold text-white">คำแนะนำ</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-semibold">1</div>
                      <p>โอนเงินตามยอดที่ระบุในใบสั่งซื้อ</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-semibold">2</div>
                      <p>กรอกข้อมูลให้ตรงกับใบสั่งซื้อ</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-semibold">3</div>
                      <p>ระบุวันที่และเวลาที่โอนให้ถูกต้อง</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-semibold">4</div>
                      <p>ระบบจะตรวจสอบและอัพเดตสถานะภายใน 24 ชั่วโมง</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>หมายเหตุ:</strong> กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน 
                      หากข้อมูลไม่ตรงกับในระบบ การแจ้งชำระเงินจะไม่สำเร็จ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
