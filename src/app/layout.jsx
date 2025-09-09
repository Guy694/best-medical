import Footter from "./components/Footter";
import Navbar from "./components/Nav";
import Sidebar from "./components/sidebar";
import "./globals.css";
import { Prompt } from "next/font/google";
import CookieBanner from "./components/cookiebanner";
import FloatingContact from "./components/FloatingContact";

const prompt = Prompt({
  subsets: ["latin","thai"], // รองรับภาษาไทย
  weight: ["700", "400"], // น้ำหนักตัวอักษร
  display: "swap",
});
export const metadata = {
  title: "บริษัท เบสท เมดิคอล จำกัด",
  description: "บริษัท เบสท เมดิคอล จำกัด",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
    other: [
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "16x16",
      },
    ],
  },
  openGraph: {
    title: 'สินค้าสุขภาพ | เบสท เมดิคอล',
    description: 'ซื้อสินค้าสุขภาพ X ราคาดี',
    url: 'https://example.com/product',
    images: ['https://example.com/product.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'สินค้าสุขภาพ | เบสท เมดิคอล',
    description: 'ซื้อสินค้าสุขภาพ X ราคาดี',
    images: ['https://example.com/product.jpg'],
  },
  icons: '/favicon.ico',
};



export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={prompt.className}>
  <div className="flex flex-col min-h-screen">
    {/* <Sidebar /> */}
    {/* <Navbar /> */}
    <main className="flex-1 bg-gray-100">
      {children}
    </main>
    <Footter />
  </div>
  <FloatingContact
  facebookUrl="https://www.facebook.com/profile.php?id=100070566921817"
  lineUrl="https://line.me/ti/p/bestmedical"
  label="ติดต่อผ่านโซเชียล"
/>
  <CookieBanner />
</body>
      
    </html>
  );
}
