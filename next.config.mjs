/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.108',
        // ไม่ต้องใส่ port ถ้าเป็น 80
        pathname: '/best-medical/public/**',
      },
    ],
  },
};


export default nextConfig;
