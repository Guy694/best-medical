"use client";

import { useState, useEffect } from 'react';
import { sessionManager } from '../lib/sessionTimeout';
import { Clock, AlertTriangle, X } from 'lucide-react';

export default function SessionTimeout() {
  const [remainingTime, setRemainingTime] = useState(30);
  const [showWarning, setShowWarning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = sessionManager.getSession();
    if (!user || sessionManager.isSessionExpired()) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Update remaining time every minute
    const timeInterval = setInterval(() => {
      if (sessionManager.isSessionExpired()) {
        alert('เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่');
        sessionManager.logout();
        return;
      }

      const remaining = sessionManager.getRemainingTime();
      setRemainingTime(remaining);
      
      // Show warning when 5 minutes or less remaining
      if (remaining <= 5 && remaining > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 60000); // Check every minute

    // Initial check
    const remaining = sessionManager.getRemainingTime();
    setRemainingTime(remaining);
    if (remaining <= 5 && remaining > 0) {
      setShowWarning(true);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const extendSession = () => {
    sessionManager.updateActivity();
    setShowWarning(false);
    setRemainingTime(30);
  };

  const dismissWarning = () => {
    setShowWarning(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Session Timer Display (bottom right corner) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center space-x-2 text-sm">
          <Clock size={16} className={remainingTime <= 5 ? "text-red-500" : "text-blue-500"} />
          <span className={remainingTime <= 5 ? "text-red-600 font-semibold" : "text-gray-600"}>
            เซสชัน: {remainingTime} นาที
          </span>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  แจ้งเตือนเซสชัน
                </h3>
              </div>
              <button
                onClick={dismissWarning}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                เซสชันของคุณจะหมดอายุใน <span className="font-semibold text-red-600">{remainingTime} นาที</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                คลิก "ขยายเวลา" เพื่อเพิ่มเวลาเซสชันอีก 30 นาที
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={extendSession}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ขยายเวลา
              </button>
              <button
                onClick={() => sessionManager.logout()}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}