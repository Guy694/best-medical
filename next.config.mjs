/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "199.21.175.91", pathname: "/best-medical/public/**" },
    ],
  },
  // Files uploaded after `next build` are not served from /public in production,
  // so fall back to the media route for these folders.
  async rewrites() {
    return {
      afterFiles: [],
      beforeFiles: [],
      fallback: [
        { source: "/pdimage/:file", destination: "/api/media/pdimage/:file" },
        { source: "/categoryimg/:file", destination: "/api/media/categoryimg/:file" },
        { source: "/uploads/articles/:file", destination: "/api/media/uploads/articles/:file" },
      ],
    };
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
