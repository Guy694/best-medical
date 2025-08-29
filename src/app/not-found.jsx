export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem' }}>ขออภัย ไม่พบหน้าที่คุณค้นหา</p>
      <a href="/" style={{ color: '#0070f3', marginTop: '1rem', display: 'inline-block' }}>
        กลับไปหน้าหลัก
      </a>
    </div>
  );
}