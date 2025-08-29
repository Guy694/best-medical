'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error caught by error.js:', error);
  }, [error]);

  return (
     <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3rem' }}>เกิดข้อผิดพลาดในหน้านี้ 😥</h1>
      <p style={{ fontSize: '1.25rem' }}>{error.message}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => reset()}>ลองใหม่</button>
    </div>
  );
}