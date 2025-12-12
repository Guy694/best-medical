/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '199.21.175.91',
        pathname: '/best-medical/public/**',
      },
    ],
  },
  // เพิ่มการตั้งค่าเพื่อแก้ปัญหา chunk loading
  generateBuildId: async () => {
    // ใช้ timestamp เป็น build ID เพื่อป้องกัน cache conflict
    return `build-${Date.now()}`;
  },
  // Cache control headers
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};


export default nextConfig;
