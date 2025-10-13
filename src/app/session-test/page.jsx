"use client";

import { useState, useEffect } from 'react';
import { sessionManager } from '../lib/sessionTimeout';
import { Clock, User, Shield, LogOut, RefreshCw } from 'lucide-react';

export default function SessionTestPage() {
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Update session info every second for demonstration
    const interval = setInterval(() => {
      const userData = sessionManager.getSession();
      const remaining = sessionManager.getRemainingTime();
      const expired = sessionManager.isSessionExpired();
      
      setUser(userData);
      setRemainingTime(remaining);
      setIsExpired(expired);
      
      if (userData && userData.lastActivity) {
        setLastActivity(new Date(userData.lastActivity).toLocaleString('th-TH'));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExtendSession = () => {
    sessionManager.updateActivity();
  };

  const handleLogout = () => {
    sessionManager.logout();
  };

  const handleTestActivity = () => {
    sessionManager.updateActivity();
    alert('กิจกรรมได้รับการอัปเดตแล้ว!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบเซสชัน</h2>
            <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อทดสอบฟีเจอร์เซสชัน</p>
            <a 
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              เข้าสู่ระบบ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="mr-2" />
            ทดสอบ Session Timeout
          </h1>
          
          {/* User Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <User className="mr-2" size={18} />
                ข้อมูลผู้ใช้
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
                <p><span className="font-medium">ชื่อ:</span> {user.firstname} {user.lastname}</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <Clock className="mr-2" size={18} />
                สถานะเซสชัน
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">เวลาคงเหลือ:</span> 
                  <span className={`ml-1 font-bold ${remainingTime <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingTime} นาที
                  </span>
                </p>
                <p><span className="font-medium">กิจกรรมล่าสุด:</span> {lastActivity}</p>
                <p>
                  <span className="font-medium">สถานะ:</span> 
                  <span className={`ml-1 font-bold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {isExpired ? 'หมดอายุ' : 'ใช้งานได้'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>เวลาเซสชัน</span>
              <span>{remainingTime}/30 นาที</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  remainingTime <= 5 ? 'bg-red-500' : remainingTime <= 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(remainingTime / 30) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExtendSession}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="mr-2" size={16} />
              ขยายเซสชัน
            </button>
            
            <button
              onClick={handleTestActivity}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Clock className="mr-2" size={16} />
              อัปเดตกิจกรรม
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="mr-2" size={16} />
              ออกจากระบบ
            </button>
          </div>
          
          {/* Warning Message */}
          {remainingTime <= 5 && remainingTime > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
                <p className="text-red-800 font-medium">
                  ⚠️ เซสชันจะหมดอายุในอีก {remainingTime} นาที!
                </p>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">วิธีทดสอบ:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• เซสชันจะหมดอายุภายใน 30 นาทีหลังจากล็อกอิน</li>
              <li>• การเคลื่อนไหวเมาส์, คลิก, หรือกดคีย์บอร์ดจะรีเซ็ตเวลา</li>
              <li>• เมื่อเหลือ 5 นาที จะมีแจ้งเตือน</li>
              <li>• เมื่อหมดเวลาจะออกจากระบบอัตโนมัติ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}