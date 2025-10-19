// src/app/components/OrderTimeline.jsx
"use client";
import { CheckCircle, Clock, Package, Truck, XCircle, FileText } from 'lucide-react';

export default function OrderTimeline({ history }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-6 h-6" />;
      case 'PAID':
        return <CheckCircle className="w-6 h-6" />;
      case 'PROCESSING':
        return <Package className="w-6 h-6" />;
      case 'SHIPPING':
        return <Truck className="w-6 h-6" />;
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6" />;
      case 'CANCELLED':
        return <XCircle className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'PAID':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'รอการชำระเงิน';
      case 'PAID':
        return 'ชำระเงินแล้ว';
      case 'PROCESSING':
        return 'กำลังเตรียมสินค้า';
      case 'SHIPPING':
        return 'กำลังจัดส่ง';
      case 'COMPLETED':
        return 'จัดส่งสำเร็จ';
      case 'CANCELLED':
        return 'ยกเลิกคำสั่งซื้อ';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่มีประวัติการเปลี่ยนแปลงสถานะ
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Timeline Line */}
          {index < history.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
          )}

          {/* Timeline Item */}
          <div className="flex gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {getStatusText(item.status)}
                  </h3>
                  {/* <p className="text-sm text-gray-500">
                    {formatDateTime(item.changed_by)}
                  </p> */}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Note */}
              {item.note && (
                <p className="text-gray-600 mb-2">{item.note}</p>
              )}

              {/* Tracking Info */}
              {item.tracking_number && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">เลขพัสดุ:</span>
                      <span className="ml-2 font-semibold text-blue-700">{item.tracking_number}</span>
                    </div>
                    {item.shipping_company && (
                      <div>
                        <span className="text-gray-600">ขนส่ง:</span>
                        <span className="ml-2 font-semibold text-blue-700">{item.shipping_company}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Changed By */}
              {(item.firstname || item.changed_by) && (
                <div className="mt-2 text-xs text-gray-500">
                  โดย: {item.firstname ? `${item.firstname} ${item.lastname}` : item.changed_by}
                </div>
              )}

              {/* Previous Status */}
              {item.previous_status && (
                <div className="mt-2 text-xs text-gray-400">
                  จาก: {getStatusText(item.previous_status)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
