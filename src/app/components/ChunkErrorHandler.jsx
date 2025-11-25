"use client";

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
    useEffect(() => {
        // จับ error แบบ global
        const handleError = (event) => {
            const errorMessage = event.message || event.reason?.message || '';

            // ตรวจสอบว่าเป็น chunk loading error หรือไม่
            if (
                errorMessage.includes('Loading chunk') ||
                errorMessage.includes('Failed to fetch dynamically imported module') ||
                errorMessage.toLowerCase().includes('chunk')
            ) {
                console.warn('Chunk loading error detected. Reloading page...');

                // แสดง notification ก่อน reload (optional)
                const shouldReload = window.confirm(
                    'มีการอัพเดทเวอร์ชันใหม่ กรุณารีเฟรชหน้าเว็บ\n\nคลิก OK เพื่อรีเฟรชอัตโนมัติ'
                );

                if (shouldReload) {
                    // ลบ cache และ reload
                    if ('caches' in window) {
                        caches.keys().then(names => {
                            names.forEach(name => caches.delete(name));
                        });
                    }

                    // Hard reload
                    window.location.reload(true);
                }

                // ป้องกัน error แสดงใน console
                event.preventDefault();
                return true;
            }
        };

        // จับ error จาก window
        window.addEventListener('error', handleError);

        // จับ unhandled promise rejection
        window.addEventListener('unhandledrejection', handleError);

        // Cleanup
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleError);
        };
    }, []);

    return null; // Component นี้ไม่แสดงอะไร เป็นแค่ handler
}
